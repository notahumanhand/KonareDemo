import os

from google import genai


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is not configured."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def test_gemini_connection():
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Respond with exactly: CaseFlow Gemini connection successful."
    )

    return response.text