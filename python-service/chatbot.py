import os
from google import genai
from google.genai import types
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List
from rate_limiter import limiter

router = APIRouter()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

system_prompt = """You are an expert scientific assistant for Anthem Biosciences. Your domain is biology, recombinant enzymes, Enterokinease, protein purification, and related Anthem Biosciences products. Assess the conceptual relevance of the question, rather than just looking for keywords. If a user asks a question conceptually outside these domains, politely decline and state that it is outside your field. Keep your answers concise, accurate, and helpful."""

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|model)$")
    parts: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]

@router.post("/api/chat")
@limiter.limit("20/minute")
def chat_with_bot(request: Request, payload: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key is missing on the server.")
    
    try:
        formatted_history = []
        for msg in payload.history[:-1]:
            formatted_history.append(
                types.Content(role=msg.role, parts=[types.Part.from_text(text=msg.parts)])
            )
        
        latest_message = payload.history[-1].parts
        
        chat = client.chats.create(
            model="gemma-4-31b-it",
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
            ),
            history=formatted_history
        )
        response = chat.send_message(latest_message)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    