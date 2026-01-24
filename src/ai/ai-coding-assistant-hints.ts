'use server';

/**
 * @fileOverview Provides hints to students when they are stuck on a coding challenge.
 *
 * - `provideHint` - A function that generates a hint for a coding challenge.
 * - `ProvideHintInput` - The input type for the `provideHint` function.
 * - `ProvideHintOutput` - The return type for the `provideHint` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideHintInputSchema = z.object({
  challengeDescription: z
    .string()
    .describe('The description of the current coding challenge.'),
  studentCode: z
    .string()
    .describe('The student code that has been written so far.'),
  attempts: z
    .number()
    .describe('The number of attempts the student has made on the challenge.'),
});
export type ProvideHintInput = z.infer<typeof ProvideHintInputSchema>;

const ProvideHintOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the coding challenge.'),
});
export type ProvideHintOutput = z.infer<typeof ProvideHintOutputSchema>;

export async function provideHint(input: ProvideHintInput): Promise<ProvideHintOutput> {
  return provideHintFlow(input);
}

const provideHintPrompt = ai.definePrompt({
  name: 'provideHintPrompt',
  input: {schema: ProvideHintInputSchema},
  output: {schema: ProvideHintOutputSchema},
  prompt: `You are an AI coding assistant helping a student learn Python.

The student is currently working on the following coding challenge:

Challenge Description: {{{challengeDescription}}}

The student has written the following code so far:

Student Code: {{{studentCode}}}

The student has made {{{attempts}}} attempts to get a hint for this challenge.

Your task is to provide a helpful hint to guide the student towards the correct solution. The hint's detail should be based on the number of attempts.
- Attempt 1: Provide a high-level, conceptual hint about the programming concept they should use.
- Attempt 2: Point to the specific part of their code that needs fixing, or a concept they are missing.
- Attempt 3: Give a more direct suggestion on how to fix the code, perhaps with a small pseudo-code example.
- Attempt 4 and beyond: Provide a very specific explanation, getting very close to the actual answer.

Be encouraging and supportive. Do not just give away the answer on early attempts.`,
});

const provideHintFlow = ai.defineFlow(
  {
    name: 'provideHintFlow',
    inputSchema: ProvideHintInputSchema,
    outputSchema: ProvideHintOutputSchema,
  },
  async input => {
    const {output} = await provideHintPrompt(input);
    return output!;
  }
);
