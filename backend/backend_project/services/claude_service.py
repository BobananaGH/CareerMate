# services/claude_service.py
import anthropic
from django.conf import settings

CLAUDE_MODEL = "claude-3-haiku-20240307"

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)


def analyze_cv(text: str) -> str:
    prompt = f"""
You are an automated ATS resume scoring engine.

DO NOT repeat the CV.
DO NOT summarize the CV.
DO NOT paste any original resume text.

You MUST return STRICTLY in this markdown format:

## ATS Score
<number>/100

## Strengths
- bullet
- bullet

## Weaknesses
- bullet
- bullet

## Missing Skills
- bullet
- bullet

## Formatting Advice
- bullet
- bullet

Rules:
- Be critical
- Assume competitive job market
- Focus on measurable impact, keywords, and role readiness
- Use concise bullets only
- No introductions
- No closing remarks
- ATS Score MUST be numeric between 0 and 100
- Penalize vague experience
- Penalize missing metrics
- Penalize weak keywords
- Score critically unless the resume is strong

Resume:
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


def generate_roadmap(cv_text: str) -> str:
    prompt = f"""
You are a professional career roadmap generator.

DO NOT repeat the CV.

Create a 6 month roadmap.

Format EXACTLY:

## Month 1
### Technical Skills
- bullet

### Soft Skills
- bullet

### Projects
- bullet

## Month 2
...

Continue until Month 6.

Rules:
- No introductions
- No summaries
- Be specific
- Tailor to missing skills
- Assume job-seeking candidate
- Each month must differ or at least have a large difference
Resume:
{cv_text}
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1200,
        temperature=0.4,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))

