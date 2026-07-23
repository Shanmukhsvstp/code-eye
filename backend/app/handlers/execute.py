import httpx
import asyncio
from dotenv import load_dotenv
from app.handlers.user import fetchLanguageCode
import os

load_dotenv()

JUDGE_BASE_URL = os.getenv("JUDGE_URL")

async def executeCode(code: str, language: str, stdin: str = ""):
    url = f"{JUDGE_BASE_URL}/submissions?base64_encoded=false&wait=true"
    languageId = fetchLanguageCode(language=language)
    if languageId is None:
        return {"error": True, "error_message": f"{language} isn't supported by CodeEye yet."}
    payload = {
        "source_code": code,
        "language_id": languageId,
        "stdin": stdin
    }
    async with httpx.AsyncClient(timeout=600) as client:
        response = await client.post(url=url, json=payload)
        
        if response.status_code not in (200, 201):
            return {
                "error": True,
                "error_message": response.text
            }
        
        result = response.json()
        print(result)
        
        return {
            "error": False,
            "stdout": result.get("stdout"),
            "stderr": result.get("stderr"),
            "compile_output": result.get("compile_output"),
            "message": result.get("message"),
            "status": result.get("status", {}).get("description"),
            "time": result.get("time"),
            "memory": result.get("memory"),
            "exit_code": result.get("exit_code"),
        }