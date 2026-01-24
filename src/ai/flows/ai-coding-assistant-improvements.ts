'use server';

/**
 * @fileOverview An AI coding assistant that suggests improvements to Python code.
 *
 * - aiCodingAssistantSuggestsImprovements - A function that takes Python code as input and returns improvement suggestions.
 * - AICodingAssistantSuggestsImprovementsInput - The input type for the aiCodingAssistantSuggestsImprovements function.
 * - AICodingAssistantSuggestsImprovementsOutput - The return type for the aiCodingAssistantSuggestsImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICodingAssistantSuggestsImprovementsInputSchema = z.object({
  code: z.string().describe('The Python code to be improved.'),
});
export type AICodingAssistantSuggestsImprovementsInput = z.infer<typeof AICodingAssistantSuggestsImprovementsInputSchema>;

const AICodingAssistantSuggestsImprovementsOutputSchema = z.object({
  suggestions: z.string().describe('Suggestions for improving the Python code, focusing on efficiency, readability, and best practices.'),
});
export type AICodingAssistantSuggestsImprovementsOutput = z.infer<typeof AICodingAssistantSuggestsImprovementsOutputSchema>;

export async function aiCodingAssistantSuggestsImprovements(input: AICodingAssistantSuggestsImprovementsInput): Promise<AICodingAssistantSuggestsImprovementsOutput> {
  return aiCodingAssistantSuggestsImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodingAssistantSuggestsImprovementsPrompt',
  input: {schema: AICodingAssistantSuggestsImprovementsInputSchema},
  output: {schema: AICodingAssistantSuggestsImprovementsOutputSchema},
  prompt: `You are an AI coding assistant that reviews Python code and provides suggestions for improvement.

  Focus on efficiency, readability, and best practices. Provide clear and concise suggestions that the student can easily understand and implement.

  Code:
  {{code}}`,
});

const aiCodingAssistantSuggestsImprovementsFlow = ai.defineFlow(
  {
    name: 'aiCodingAssistantSuggestsImprovementsFlow',
    inputSchema: AICodingAssistantSuggestsImprovementsInputSchema,
    outputSchema: AICodingAssistantSuggestsImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
