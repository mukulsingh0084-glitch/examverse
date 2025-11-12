
import { GoogleGenAI, Type, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const geminiFlash = "gemini-2.5-flash";

// Helper function to convert a File to a GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function predictQuestions(formData: any) {
  const prompt = `
    Based on the following parameters for the Indian education system, predict potential exam questions.
    - State: ${formData.state}
    - Class: ${formData.class}
    - Subject: ${formData.subject}
    - Past Paper Year Range: ${formData.fromYear} to ${formData.toYear}
    - Question Type: ${formData.questionType}
    - Number of Questions to Generate: ${formData.numQuestions}

    Return the response as a JSON object.
  `;

  const response = await ai.models.generateContent({
    model: geminiFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                confidence: { type: Type.INTEGER, description: "Confidence score from 0 to 100" },
              },
            },
          },
        },
      },
    },
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString);
}


export async function analyzePaper(imageFile: File) {
  const imagePart = await fileToGenerativePart(imageFile);
  const prompt = "Analyze this question paper image. Identify the main topic, estimate the difficulty (Easy, Medium, Hard), suggest the total marks, and list 3 related questions. Return a JSON object.";
  
  const response = await ai.models.generateContent({
    model: geminiFlash,
    contents: { parts: [imagePart, {text: prompt}] },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                topic: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
                suggestedMarks: { type: Type.INTEGER },
                relatedQuestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        }
    }
  });
  
  const jsonString = response.text.trim();
  return JSON.parse(jsonString);
}

export async function extractTextFromPaper(imageFile: File) {
  const imagePart = await fileToGenerativePart(imageFile);
  const prompt = "Extract all text from this image of a question paper. Preserve the formatting, including line breaks and spacing, as accurately as possible.";

  const response = await ai.models.generateContent({
    model: geminiFlash,
    contents: { parts: [imagePart, { text: prompt }] },
  });
  
  return response.text;
}


export function createTutorChat(): Chat {
    return ai.chats.create({
        model: geminiFlash,
        config: {
            systemInstruction: "You are EduBrain, a friendly and encouraging AI tutor for students in India, grades 5-12. Be patient, explain concepts clearly, and always maintain a positive tone.",
        }
    });
}
