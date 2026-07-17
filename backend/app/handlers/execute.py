import httpx
import asyncio
from dotenv import load_dotenv
from handlers.user import fetchLanguageCode
import os

load_dotenv()

JUDGE_BASE_URL = os.getenv("JUDGE_URL")

async def executePlainCode(code: str, language: str):
    url = f"{JUDGE_BASE_URL}/submissions"
    payload = {
            
    }
    languageId = fetchLanguageCode(language=language)
    if languageId is None:
        return {"error": True, "error_message": f"{language} isn't supported by CodeEye yet."}
    async with httpx.AsyncClient() as client:
        response = await client.post(url=url, json=payload)