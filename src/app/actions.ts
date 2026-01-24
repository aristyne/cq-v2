"use server";

import { aiCodingAssistantSuggestsImprovements } from "@/ai/flows/ai-coding-assistant-improvements";
import { z } from "zod";

const submissionSchema = z.object({
  code: z.string().min(1, "Code cannot be empty."),
});

type FormState = {
  suggestion: string | null;
  error: string | null;
};

export async function getAiSuggestionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = submissionSchema.safeParse({
    code: formData.get("code"),
  });

  if (!validatedFields.success) {
    return {
      suggestion: null,
      error: "Invalid input. Please provide some code.",
    };
  }

  try {
    const result = await aiCodingAssistantSuggestsImprovements(
      validatedFields.data
    );
    return {
      suggestion: result.suggestions,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      suggestion: null,
      error: "Failed to get suggestion from AI. Please try again later.",
    };
  }
}
