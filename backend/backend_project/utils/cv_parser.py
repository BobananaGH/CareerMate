# utils/cv_parser.py
import pdfplumber
import docx

def extract_text(file):
    """
    Extract text from PDF or DOCX file.
    `file` is a Django UploadedFile (request.FILES['resume'])
    """
    name = file.name.lower()

    if name.endswith(".pdf"):
        text = ""
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text

    if name.endswith(".docx"):
        doc = docx.Document(file)
        return "\n".join(p.text for p in doc.paragraphs)

    raise ValueError("Unsupported file type. Use PDF or DOCX.")
