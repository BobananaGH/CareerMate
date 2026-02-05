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
- Do not be Polite
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


def generate_roadmap(cv_text: str, ats_result: str) -> str:
    prompt = f"""
You are a strict career roadmap generator.

You are given:
1. Resume
2. ATS Evaluation

Use BOTH to build roadmap.
Target missing skills aggressively.

ATS Evaluation:
{ats_result}

Resume:
{cv_text}

You MUST generate a detailed 6 month roadmap.

FORMAT EXACTLY:

## Month 1
### Technical Skills
- bullet

### Soft Skills
- bullet

### Projects
- bullet

Repeat until Month 6.

RULES:
- NO introductions
- NO summaries
- MUST output Month 1 through Month 6
- Be aggressive and realistic
- Assume junior job seeker
- Focus on employability
- Each month must be clearly different
- If resume is weak, fill gaps logically
- Do NOT be motivational
- Do NOT use vague phrases
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1600,
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}],
    )

    if not response.content:
        raise ValueError("Empty response from AI")

    return "".join(c.text for c in response.content if hasattr(c, "text"))


