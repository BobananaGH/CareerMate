# services/claude_service.py
import anthropic
from django.conf import settings

CLAUDE_MODEL = "claude-haiku-4-5-20251001"

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)


def analyze_cv(text: str) -> str:
    prompt = f"""
You are an ATS resume expert.
Analyze the CV below Score from 1-100 (ATS) and give professional feedback.
{text}
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1200,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))



def career_chat(message: str) -> str:
    """
    Provide career coaching advice for final-year university students.
    """
    prompt = f"""
You are a professional career coach for final-year university students.
Provide clear, practical, and concise advice.

User question:
{message}
"""
    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))

def career_chat_with_context(messages: list[dict]) -> str:
    """
    messages = [
        {"role": "system", "content": "..."},
        {"role": "user", "content": "..."},
        {"role": "assistant", "content": "..."}
    ]
    """

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=800,
        temperature=0.4,
        messages=messages,
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))


def generate_roadmap(cv_text: str, ats_result: str) -> str:
    prompt = f"""
Based on this resume and ATS feedback, generate a 3-month improvement roadmap for a junior candidate.

Resume:
{cv_text}

ATS:
{ats_result}

Each month: technical skills, soft skills, projects.
Concrete steps only.
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=900,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))

