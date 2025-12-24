
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
        systemInstruction: `You are "Ask Cyber", a state-of-the-art AI Q&A Engine for the College of Engineering. 
        Your expertise:
        1. Academic Coursework: Specialized in Cybersecurity and AI Engineering.
        2. Security Auditor: Analyze code for vulnerabilities (XSS, SQLi, Buffer Overflows). Suggest fixes.
        3. Real-time Researcher: Use Google Search to find latest CVEs, AI papers (Arxiv), and industry trends.
        4. Clear Explanations: Use academic terminology.
        5. Multilingual: Respond in the user's language (Arabic/English).
        
        When using Google Search results, ALWAYS provide a brief summary and mention your sources.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      },
    });
    
    // Extract grounding metadata for UI
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return {
      text: response.text,
      sources: grounding || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "نعتذر، واجهت مشكلة في الاتصال بقاعدة المعرفة الخاصة بي حالياً. يرجى المحاولة مرة أخرى.",
      sources: []
    };
  }
}

export async function recommendLearningPath(description: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Generate a custom engineering roadmap for: ${description}` }] }],
      config: {
        systemInstruction: "You are an Academic Advisor. Return a structured JSON roadmap for an engineering student.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, description: "One of: Course, Project, Skill" }
                },
                required: ["label", "description", "type"]
              }
            }
          },
          required: ["title", "description", "steps"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Pathfinder API Error:", error);
    return null;
  }
}
