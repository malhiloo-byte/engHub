
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAcademicAssistantResponse(prompt: string, history: {role: string, parts: {text: string}[]}[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are "Ask Cyber", a state-of-the-art AI Q&A Engine designed specifically for the College of Engineering. 
        Your expertise includes:
        1. Academic Coursework: You have deep knowledge of Cybersecurity and AI Engineering curricula (Slides, PDFs, Lab assignments).
        2. Security Auditor: When provided with code, you MUST analyze it for security vulnerabilities like XSS, SQL Injection, Buffer Overflows, and logic flaws. Suggest industry-standard remediation.
        3. Clear Explanations: Explain complex concepts (e.g., Hashing vs Encryption) using university-level terminology.
        4. Multilingual: Respond in Arabic for Arabic queries and English for English queries.
        Maintain a professional, academic, and highly technical tone.`,
        temperature: 0.65,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "نعتذر، واجهت مشكلة في الاتصال بقاعدة المعرفة الخاصة بي حالياً. يرجى المحاولة مرة أخرى.";
  }
}

export async function recommendLearningPath(answers: { interest: string; skillLevel: string; goal: string }) {
  try {
    const prompt = `Based on these student answers: Interest: ${answers.interest}, Skill Level: ${answers.skillLevel}, Career Goal: ${answers.goal}. Recommend a specialized learning path within Cybersecurity and AI.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a specialized career counselor for Engineering students. Return a structured JSON recommendation for a learning path.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            courses: { type: Type.ARRAY, items: { type: Type.STRING } },
            role: { type: Type.STRING }
          },
          required: ["name", "description", "courses", "role"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Pathfinder API Error:", error);
    return null;
  }
}
