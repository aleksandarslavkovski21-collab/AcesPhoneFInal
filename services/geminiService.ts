
import { GoogleGenAI } from "@google/genai";
import { PhoneModel } from "../types";

export const getAIReview = async (phone: PhoneModel): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Feature is currently unavailable (Missing API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Врз основа на следните спецификации за телефон, генерирај краток и атрактивен преглед на македонски јазик за потенцијален купувач.
    Модел: ${phone.brand} ${phone.model}
    RAM: ${phone.ram}
    Меморија: ${phone.storage}
    Состојба: ${phone.condition}
    Опис од продавачот: ${phone.description}
    
    Кажи му на купувачот зошто овој уред е добар избор (или на што да внимава). Биди искрен и професионален.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Не успеавме да генерираме преглед во моментот.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Грешка при контактирање на AI сервисот.";
  }
};
