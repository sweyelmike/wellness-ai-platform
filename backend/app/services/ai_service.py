import google.generativeai as genai
import os
from app.config import settings

# Configure API Key
genai.configure(api_key=settings.GEMINI_API_KEY)

# --- THE SMART MODEL LIST ---
# We will try these models one by one until one works.
# These are taken directly from your "check_models.py" output.
MODELS_TO_TRY = [
    'gemini-2.0-flash-exp',              # 1. Experimental (Usually Free)
    'gemini-2.5-flash',                  # 2. Newest Flash (Likely has quota)
    'gemini-2.0-flash-lite-preview-02-05' # 3. Lite version (Very high limits)
]

async def generate_wellness_response(user_message: str, history: list, user_profile: dict):
    
    # 1. Check Key
    if not settings.GEMINI_API_KEY:
        return "System Error: AI API Key is missing."

    # 2. Build Prompt
    system_instruction = (
        f"You are a supportive, empathetic Wellness Coach AI. "
        f"User Details -> Name: {user_profile.get('name')}, "
        f"Age: {user_profile.get('age')}, BMI: {user_profile.get('bmi', 'N/A')}. "
        f"Goal: Provide motivation, wellness tips, and mental health support. "
        f"SAFETY: Do NOT provide medical diagnoses. "
        f"Keep responses short (under 50 words) and conversational."
    )
    
    prompt = f"{system_instruction}\n\nUser Message: {user_message}"

    # 3. Try Models in Loop
    last_error = ""
    
    for model_name in MODELS_TO_TRY:
        try:
            print(f"Attempting to use model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(prompt)
            print(f"SUCCESS! Connected to {model_name}")
            return response.text
            
        except Exception as e:
            print(f"FAILED: {model_name} error: {e}")
            last_error = str(e)
            continue # Try the next model in the list

    # 4. If ALL fail
    print("\n======== ALL MODELS FAILED ========")
    print(f"Final Error: {last_error}")
    print("===================================\n")
    return "I am currently overloaded. Please try again in 1 minute."