from fastapi import APIRouter, Depends, HTTPException, Body
from app.database import db
from app.models import UserProfile
from app.auth import get_current_user
from app.services.ai_service import generate_wellness_response
from app.services.game_service import check_badges
from datetime import datetime

router = APIRouter()

# --- Helper to fix MongoDB ObjectId error ---
def fix_doc(document):
    if document and "_id" in document:
        document["_id"] = str(document["_id"])
    return document

@router.post("/profile")
async def create_profile(profile: UserProfile, email: str = Depends(get_current_user)):
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 1. Update the User's Real Name in the main database
    if profile.name:
        await db.users.update_one(
            {"email": email},
            {"$set": {"name": profile.name}}
        )

    # 2. Calculate BMI (Safe Calculation)
    bmi = 0
    if profile.weight_kg and profile.height_cm and profile.height_cm > 0:
        bmi = profile.weight_kg / ((profile.height_cm / 100) ** 2)
    
    # 3. Save Profile Data
    profile_data = profile.dict()
    profile_data['bmi'] = round(bmi, 2)
    profile_data['user_id'] = str(user["_id"])
    
    await db.profiles.update_one(
        {"user_id": str(user["_id"])}, 
        {"$set": profile_data}, 
        upsert=True
    )
    
    # 4. Initialize Game Stats (if new)
    await db.gamification.update_one(
        {"user_id": str(user["_id"])},
        {"$setOnInsert": {"points": 0, "streak_days": 1, "badges": []}},
        upsert=True
    )
    
    return {"message": "Profile updated", "bmi": bmi}

@router.get("/dashboard")
async def get_dashboard(email: str = Depends(get_current_user)):
    user = await db.users.find_one({"email": email})
    uid = str(user["_id"])
    
    # Fetch and Fix documents (Convert ObjectId to string)
    profile = await db.profiles.find_one({"user_id": uid})
    profile = fix_doc(profile)

    gamification = await db.gamification.find_one({"user_id": uid})
    gamification = fix_doc(gamification)
    
    # Mock Metrics for demo if empty
    metrics = await db.metrics.find_one({"user_id": uid}, sort=[("date", -1)])
    metrics = fix_doc(metrics)

    if not metrics:
        metrics = {"heart_rate": 72, "sleep_hours": 7.5, "steps": 5400, "wellness_score": 85}

    return {
        "user_name": user["name"],
        "profile": profile, 
        "metrics": metrics,
        "gamification": gamification
    }

@router.post("/chat")
async def chat_with_ai(message: str = Body(..., embed=True), email: str = Depends(get_current_user)):
    user = await db.users.find_one({"email": email})
    uid = str(user["_id"])
    
    # 1. Get Context
    profile = await db.profiles.find_one({"user_id": uid})
    history_cursor = db.chat_history.find({"user_id": uid}).sort("timestamp", -1).limit(10)
    history = await history_cursor.to_list(length=10)
    history.reverse() # Oldest first for AI context
    
    user_context = {
        "name": user["name"],
        "age": profile["age"] if profile else "Unknown",
        "bmi": profile["bmi"] if profile else "Unknown"
    }

    # 2. Generate AI Response
    ai_text = await generate_wellness_response(message, history, user_context)
    
    # 3. Save Chat
    await db.chat_history.insert_one({"user_id": uid, "role": "user", "content": message, "timestamp": datetime.utcnow()})
    await db.chat_history.insert_one({"user_id": uid, "role": "model", "content": ai_text, "timestamp": datetime.utcnow()})
    
    # 4. Update Gamification (Add 10 points per message)
    game = await db.gamification.find_one({"user_id": uid})
    if game:
        new_points = game.get("points", 0) + 10
        new_badges = await check_badges(new_points, game.get("badges", []))
        
        update_query = {"$set": {"points": new_points}}
        if new_badges:
            update_query["$addToSet"] = {"badges": {"$each": new_badges}}
            
        await db.gamification.update_one({"user_id": uid}, update_query)

    return {"response": ai_text}

@router.get("/history")
async def get_chat_history(email: str = Depends(get_current_user)):
    user = await db.users.find_one({"email": email})
    uid = str(user["_id"])
    cursor = db.chat_history.find({"user_id": uid}).sort("timestamp", 1)
    history = await cursor.to_list(length=100)
    
    # Fix ObjectIds in list
    for h in history:
        h["_id"] = str(h["_id"])
        h.pop("user_id", None)
    return history