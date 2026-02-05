# services/claude_service.py
import anthropic
from django.conf import settings

CLAUDE_MODEL = "claude-3-haiku-20240307"

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)


def analyze_cv(text: str) -> str:
    """
    Analyze a CV and return ATS-style professional feedback.
    """
    prompt = f"""
You are an ATS resume expert.

Respond in Markdown.
Use headings and bullet points.

Return:

## ATS Score (/100)

## Strengths

## Weaknesses

## Missing Skills

## Formatting Advice

CV:
{text}
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return response.content[0].text


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

    return response.content[0].text

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

    return response.content[0].text

def generate_roadmap(cv_text: str) -> str:
    prompt = f"""
You are a career coach.

Respond in Markdown.
Use headings and bullet points.

Generate a 3-month learning roadmap with:

## Month 1
## Month 2
## Month 3

Include:

- Technical skills
- Soft skills
- Projects
- Certifications (if any)

CV:
{cv_text}
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return response.content[0].text

