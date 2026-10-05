import os

from google import genai
from google.genai import types

from services.models import CaseReview
from services.prompts import SYSTEM_INSTRUCTION


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is not configured."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


MODEL_NAME = "gemini-3.8-flash"


def test_gemini_connection():
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents="Respond with exactly: CaseFlow Gemini connection successful."
    )

    return response.text


def analyze_documents(prompt: str) -> CaseReview:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=CaseReview,
        ),
    )

    if response.parsed is None:
        raise RuntimeError(
            "Gemini returned no structured case review."
        )

    return response.parsed