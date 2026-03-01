import { env } from "../../../config/env";
import { Review } from "../domain/models";

type GeminiPart = {
  text?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
};

async function callGemini(model: string, parts: GeminiPart[]): Promise<GeminiResponse> {
  if (!env.geminiApiKey) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is missing.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.geminiApiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Gemini call failed with ${response.status}`);
  }

  return (await response.json()) as GeminiResponse;
}

function readText(response: GeminiResponse): string | null {
  const textPart = response.candidates?.[0]?.content?.parts?.find(
    (part) => typeof part.text === "string",
  );

  return textPart?.text?.trim() ?? null;
}

export async function getEthicalInsight(breed: string): Promise<string> {
  const response = await callGemini("gemini-2.0-flash", [
    {
      text: `Donne 3 conseils éthiques et bien-être pour la race ${breed}. Réponds en français, format liste concise.`,
    },
  ]);

  return readText(response) ?? "Conseils indisponibles pour le moment.";
}

export async function getBreederTrustSummary(
  breederName: string,
  reviews: Review[],
): Promise<string> {
  const reviewText = reviews.map((review) => `${review.rating}/5 - ${review.comment}`).join("\n");

  const response = await callGemini("gemini-2.0-flash", [
    {
      text: `Résume en 2 phrases maximum la fiabilité de l'éleveur ${breederName} à partir des avis:\n${reviewText}\nRéponds en français.`,
    },
  ]);

  return readText(response) ?? "Synthèse de confiance indisponible.";
}

export async function auditPriceEthics(
  type: string,
  breed: string,
  price: number,
): Promise<string> {
  const response = await callGemini("gemini-2.0-flash", [
    {
      text: `Analyse le prix ${price} EUR pour un ${type} de race ${breed}. Dis si le prix est trop bas, correct ou trop élevé, et justifie en une phrase.`,
    },
  ]);

  return readText(response) ?? "Audit indisponible.";
}

export async function editAnimalPhoto(imageBase64: string, prompt: string): Promise<string> {
  const response = await callGemini("gemini-2.5-flash-image", [
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
    {
      text: `Retouche cette photo selon la demande: ${prompt}`,
    },
  ]);

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => typeof part.inlineData?.data === "string",
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No edited image in Gemini response.");
  }

  return `data:image/png;base64,${imagePart.inlineData.data}`;
}
