# services/claude_service.py
import anthropic
from django.conf import settings

CLAUDE_MODEL = "claude-3-haiku-20240307"

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)


def analyze_cv(text: str) -> str:
    prompt = f"""
You are an ATS resume scoring engine.

Start from 100 points.

Score using 4 categories:

Structure (25 points)
Content (35 points)
Skills (25 points)
Professionalism (15 points)

Deduct points:

Structure:
- Missing job titles: -10
- Missing dates: -5
- Poor section layout: -5

Content:
- No quantified achievements: -15
- Vague experience: -10
- No clear responsibilities: -10

Skills:
- Weak or missing skills section: -15
- Low keyword density: -10

Professionalism:
- Placeholder data: -10
- Informal language: -5

Rules:
- Stack deductions.
- If resume contains fake or placeholder text, final score MUST be under 45.
- If no metrics exist, Content score cannot exceed 15/35.
- Typical weak resumes should land 30–50.
- Average resumes 50–65.
- Strong resumes 65–80.
- Exceptional resumes 80+.

Return EXACT format:

## ATS Score
<number>/100

## Structure
- bullets

## Content
- bullets

## Skills
- bullets

## Professionalism
- bullets

## Good
- bullets

## Bad
- bullets

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

You MUST generate a detailed 3 month roadmap.

FORMAT EXACTLY:

## Month 1
### Technical Skills

### Soft Skills

### Projects

### Your Opinion


Repeat until Month 3.

RULES:
- NO introductions
- NO summaries
- MUST output Month 1 to 3
- Be aggressive and realistic
- Assume junior job seeker
- Focus on employability
- Each month must be clearly different
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


