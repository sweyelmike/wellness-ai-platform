from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_routes, user_routes

app = FastAPI(title="WellnessAI Platform")

# CORS
origins = ["http://localhost:5173", "http://localhost:3000"]

# In backend/app/main.py

# In backend/app/main.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <--- THIS IS THE KEY FIX
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(user_routes.router, prefix="/api", tags=["API"])

@app.get("/")
def read_root():
    return {"message": "WellnessAI Backend Running"}