# services/claude_service.py
import anthropic
from django.conf import settings

client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)

def analyze_cv(text):
    prompt = f"""
You are an ATS resume expert.
Analyze the CV below and give professional feedback.

CV:
{text}
"""
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.content[0].text
