import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);



const prompt = `You are a Smart Waste Classification AI model integrated into a split-screen web app.
Your job is to analyze the uploaded waste image and produce a short, formatted response that will be displayed on the right side of the screen.
The tone should be clear, educational, and visually structured for easy readability.

Analyze the provided image and classify it into one of these categories: Plastic, Paper, Metal, or Organic.

Then, structure your response exactly as follows:

Category: [Identified Category]
Confidence: [Percentage]
Disposal Tip: [A concise, actionable tip for disposal or recycling.]

Example output:

Category: Plastic
Confidence: 92%
Disposal Tip: Rinse and place in the plastic recycling bin.

If the image is unclear, does not contain waste, or cannot be confidently classified, respond with only this exact text:

Unable to classify. Please upload a clearer waste image.
`;

export const classifyWasteImage = async (imageDataBase64: string, mimeType: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageDataBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error classifying image with Gemini:", error);
    throw new Error("Failed to get a response from the AI model. Please try again.");
  }
};