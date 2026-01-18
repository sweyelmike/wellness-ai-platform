import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the .env file to get your key
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: API Key not found in .env file")
else:
    genai.configure(api_key=api_key)
    print(f"Checking models for API Key ending in: ...{api_key[-5:]}")
    
    try:
        print("\n--- AVAILABLE MODELS ---")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
        print("------------------------\n")
    except Exception as e:
        print(f"Error connecting: {e}")