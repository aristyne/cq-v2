"use server";

import { aiCodingAssistantSuggestsImprovements } from "@/ai/flows/ai-coding-assistant-improvements";
import { executePythonCode } from "@/ai/flows/ai-python-interpreter";
import { dictateCode } from "@/ai/flows/ai-code-dictation";
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

export async function runPythonCode(
  code: string
): Promise<{ output: string[]; error: string | null }> {
  if (!code.trim()) {
    return {
      output: [],
      error: "Code is empty.",
    };
  }
  try {
    const result = await executePythonCode({ code });
    const outputLines = result.output.split("\n");
    return {
      output: outputLines,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      output: [],
      error: "Failed to run code using AI. Please try again.",
    };
  }
}

export async function dictateCodeAction(
  dictatedText: string
): Promise<{ formattedCode: string | null; error: string | null }> {
  if (!dictatedText.trim()) {
    return {
      formattedCode: null,
      error: "No text was dictated.",
    };
  }

  try {
    const result = await dictateCode({ dictatedText });
    return {
      formattedCode: result.formattedCode,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      formattedCode: null,
      error: "Failed to format dictated code using AI. Please try again.",
    };
  }
}
