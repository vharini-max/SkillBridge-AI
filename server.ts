import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Endpoint for AI Resume Analysis using Gemini 3.6 Flash
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, resumeBase64, mimeType, targetRole } = req.body;

    if (!resumeText && !resumeBase64) {
      return res.status(400).json({ error: "No resume text or file provided.", useFallback: true });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(200).json({
        useFallback: true,
        message: "Gemini API key is not configured; using smart local rule-based evaluation.",
      });
    }

    const rolePrompt = targetRole || "Data Analyst / Software Engineer placement";

    let contents: any;
    if (resumeBase64 && mimeType && mimeType.startsWith("image/")) {
      contents = {
        parts: [
          {
            inlineData: {
              data: resumeBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this student resume image thoroughly for ATS optimization and campus placement readiness for a ${rolePrompt} role. Provide a structured evaluation.`
          }
        ]
      };
    } else {
      contents = `You are an expert ATS (Applicant Tracking System) Auditor and Campus Placement Director.
Evaluate this student's resume text for a target placement role of: "${rolePrompt}".

RESUME TEXT:
"""
${(resumeText || "").slice(0, 15000)}
"""

Provide a rigorous evaluation covering ATS score, role match, category scores, detected skills, missing skills, bullet fixes, strengths, and formatting improvements.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an elite ATS resume auditor. Provide strict, realistic, and highly actionable analysis in exact JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: "Overall ATS score from 0 to 100" },
            summary: { type: Type.STRING, description: "Executive summary of the resume evaluation" },
            targetRoleMatch: { type: Type.INTEGER, description: "Match percentage for target role" },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                impactVerbs: { type: Type.INTEGER },
                formattingReadability: { type: Type.INTEGER },
                skillRelevance: { type: Type.INTEGER },
                completeness: { type: Type.INTEGER },
              },
              required: ["impactVerbs", "formattingReadability", "skillRelevance", "completeness"],
            },
            detectedSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  skill: { type: Type.STRING },
                  level: { type: Type.STRING },
                },
                required: ["category", "skill"],
              },
            },
            missingCriticalSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                },
                required: ["skill", "importance", "recommendation"],
              },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            formattingFeedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sampleBulletFixes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["original", "improved", "reason"],
              },
            },
          },
          required: [
            "atsScore",
            "summary",
            "targetRoleMatch",
            "categoryScores",
            "detectedSkills",
            "missingCriticalSkills",
            "strengths",
            "improvements",
            "formattingFeedback",
            "sampleBulletFixes",
          ],
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      return res.json(parsedData);
    } else {
      return res.status(200).json({ useFallback: true });
    }
  } catch (err: any) {
    console.error("Resume analysis server error:", err);
    return res.status(200).json({ useFallback: true, error: err.message });
  }
});

// Endpoint for AI Daily Aptitude Challenge Questions Generation
app.post("/api/daily-aptitude", async (req, res) => {
  try {
    const { category, targetRole } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.status(200).json({
        useFallback: true,
        message: "Gemini API key not configured",
        questions: getFallbackAptitudeQuestions()
      });
    }

    const prompt = `Generate 5 fresh, high-yield placement aptitude multiple-choice questions for ${category || 'Quantitative & Logical Aptitude'} tailored for campus drives (TCS NPT, Infosys, Wipro, Accenture, Amazon).
Each question must have 4 options (A, B, C, D), 1 correct answer, a detailed explanation, difficulty, category, and company tag.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert campus placement aptitude test architect. Return exact JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  questionText: { type: Type.STRING },
                  categoryName: { type: Type.STRING },
                  companyTag: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        text: { type: Type.STRING },
                      },
                      required: ["id", "label", "text"],
                    },
                  },
                  correctOption: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "questionText", "options", "correctOption", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      if (parsedData && Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
        return res.json(parsedData);
      }
    }
    return res.status(200).json({ useFallback: true, questions: getFallbackAptitudeQuestions() });
  } catch (err: any) {
    console.error("Daily aptitude server error:", err);
    return res.status(200).json({ useFallback: true, questions: getFallbackAptitudeQuestions(), error: err.message });
  }
});

function getFallbackAptitudeQuestions() {
  const pool = [
    {
      id: Date.now() + 1,
      categoryName: 'Quantitative Aptitude',
      companyTag: 'TCS NPT',
      difficulty: 'Medium',
      questionText: 'A train 150m long is running at a speed of 54 km/hr. How much time will it take to pass a telegraph post?',
      options: [
        { id: 'A', label: 'Option A', text: '8 seconds' },
        { id: 'B', label: 'Option B', text: '10 seconds' },
        { id: 'C', label: 'Option C', text: '12 seconds' },
        { id: 'D', label: 'Option D', text: '15 seconds' },
      ],
      correctOption: 'B',
      explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
    },
    {
      id: Date.now() + 2,
      categoryName: 'Logical Reasoning',
      companyTag: 'Infosys',
      difficulty: 'Medium',
      questionText: 'In a code, "STATION" is written as "URCVKQP". How is "CAMPUS" written in that code?',
      options: [
        { id: 'A', label: 'Option A', text: 'ECORWU' },
        { id: 'B', label: 'Option B', text: 'ECORWR' },
        { id: 'C', label: 'Option C', text: 'ECOWRU' },
        { id: 'D', label: 'Option D', text: 'EAMRUU' },
      ],
      correctOption: 'A',
      explanation: 'Each letter is shifted by +2 forward in the alphabet (S+2=U, T+2=R, etc.). CAMPUS -> ECORWU.',
    },
    {
      id: Date.now() + 3,
      categoryName: 'Quantitative Aptitude',
      companyTag: 'Accenture',
      difficulty: 'Easy',
      questionText: 'If 20% of A = 50% of B, then what percentage of A is B?',
      options: [
        { id: 'A', label: 'Option A', text: '30%' },
        { id: 'B', label: 'Option B', text: '40%' },
        { id: 'C', label: 'Option C', text: '25%' },
        { id: 'D', label: 'Option D', text: '50%' },
      ],
      correctOption: 'B',
      explanation: '0.2A = 0.5B => B = 0.4A => B is 40% of A.',
    },
    {
      id: Date.now() + 4,
      categoryName: 'Verbal Ability',
      companyTag: 'Wipro',
      difficulty: 'Easy',
      questionText: 'Identify the antonym of "CANDID":',
      options: [
        { id: 'A', label: 'Option A', text: 'Frank' },
        { id: 'B', label: 'Option B', text: 'Secretive & Deceptive' },
        { id: 'C', label: 'Option C', text: 'Honest' },
        { id: 'D', label: 'Option D', text: 'Outspoken' },
      ],
      correctOption: 'B',
      explanation: 'Candid means truthful and straightforward. Its antonym is secretive or deceptive.',
    },
    {
      id: Date.now() + 5,
      categoryName: 'Coding Aptitude',
      companyTag: 'Amazon',
      difficulty: 'Hard',
      questionText: 'What is the time complexity of building a heap from an unsorted array of n elements?',
      options: [
        { id: 'A', label: 'Option A', text: 'O(n log n)' },
        { id: 'B', label: 'Option B', text: 'O(n)' },
        { id: 'C', label: 'Option C', text: 'O(n^2)' },
        { id: 'D', label: 'Option D', text: 'O(log n)' },
      ],
      correctOption: 'B',
      explanation: 'Bottom-up heap construction (Build-Heap algorithm) runs in O(n) linear time, not O(n log n).',
    },
  ];
  return pool;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
