
import { GoogleGenAI, Type } from "@google/genai";
import { DailyProblem } from "../types";

// Ensure the API key is available, but do not expose it in the UI.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is fine.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const problemSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "A short, engaging story for a math word problem. The story should be set in Rwanda and be culturally relevant for a 10-year-old. It should contain numbers needed to solve the problem. Use Rwandan Francs (RWF) for currency if applicable.",
    },
    question: {
      type: Type.STRING,
      description: "The specific question that can be answered using the numbers in the story. e.g., 'How many samosas can she buy in total?'",
    },
    answer: {
      type: Type.INTEGER,
      description: "The single numerical answer to the question.",
    },
  },
  required: ["story", "question", "answer"],
};

export const generateDailyProblem = async (): Promise<DailyProblem> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a math word problem for a 10-year-old child in Rwanda. The problem should involve a simple calculation (addition, subtraction, multiplication, or division).",
      config: {
        responseMimeType: "application/json",
        responseSchema: problemSchema,
        temperature: 1, // Be creative with the stories
      },
    });

    const text = response.text.trim();
    // The response text is a JSON string, so we parse it.
    const problemData = JSON.parse(text);
    
    // Validate the parsed data to ensure it matches the DailyProblem interface
    if (
      typeof problemData.story === 'string' &&
      typeof problemData.question === 'string' &&
      typeof problemData.answer === 'number'
    ) {
      return problemData as DailyProblem;
    } else {
      throw new Error("Received malformed data from API.");
    }
  } catch (error) {
    console.error("Error generating daily problem:", error);
    // Provide a fallback problem in case the API fails
    return {
      story: "An API error occurred. Let's try a default problem. A farmer has 5 cows, and each cow gives 3 liters of milk every day.",
      question: "How many liters of milk does the farmer get in one day?",
      answer: 15,
    };
  }
};

export const getExplanation = async (problem: string, wrongAnswer: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `The original math problem was: "${problem}". A 10-year-old child answered "${wrongAnswer}", which is incorrect. Please provide a simple, step-by-step explanation of how to solve the problem correctly. Be very encouraging and use simple language suitable for a child. Do not just give the answer, explain the thinking process.`,
        config: {
            temperature: 0.5,
        },
    });
    return response.text;
   } catch(error) {
       console.error("Error generating explanation:", error);
       return "I'm sorry, I had trouble thinking of an explanation. Let's try breaking the problem down. What are the key numbers in the story?";
   }
};
