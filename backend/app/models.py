from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# --- Auth Models ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Profile Models ---
class UserProfile(BaseModel):
    name: Optional[str] = None  # Added Name here so we can update it
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    gender: Optional[str] = "Not Specified"
    activity_level: Optional[str] = "Moderate"
    goal: Optional[str] = "General Wellness"

    class Config:
        extra = "ignore" # Ignores any extra random data instead of crashing