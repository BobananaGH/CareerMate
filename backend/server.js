import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import { fileURLToPath } from "url";

dotenv.config();

/* ================== FIX __dirname CHO ES MODULE ================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================== INIT APP (PHẢI TRƯỚC app.use) ================== */
const app = express();
const PORT = process.env.PORT || 3000;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

/* ================== LOG ================== */
console.log("🚀 CV AI Server starting...");
console.log("🔑 Claude key:", CLAUDE_API_KEY ? "✅ OK" : "❌ MISSING");

if (!CLAUDE_API_KEY) {
  console.error("❌ CLAUDE_API_KEY missing");
  process.exit(1);
}

/* ================== STATIC FRONTEND ================== */
app.use(express.static(path.join(__dirname, "../public")));

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== UPLOAD ================== */
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* ================== CLAUDE ================== */
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY
});

/* ================== EXTRACT TEXT ================== */
async function extractText(file) {
  const ext = file.originalname.toLowerCase();

  if (ext.endsWith(".pdf")) {
    const buffer = fs.readFileSync(file.path);
    const data = await pdf(buffer);
    return data.text;
  }

  if (ext.endsWith(".docx") || ext.endsWith(".doc")) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }

  if (ext.endsWith(".txt")) {
    return fs.readFileSync(file.path, "utf8");
  }

  throw new Error("Unsupported file type");
}

/* ================== ANALYZE ================== */
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("📄 Analyzing:", req.file.originalname);

    const cvText = await extractText(req.file);

    const prompt = `
You are an ATS resume expert.
Analyze the CV below and give professional feedback.

CV:
${cvText}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      analysis: text
    });

  } catch (err) {
    console.error("❌ Analyze error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ================== START ================== */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}/project.html`);
});
