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

The student has made {{{attempts}}} attempts on this challenge.

Provide a helpful hint to guide the student towards the correct solution.  Focus on one specific problem in the student's code and provide guidance to solve it, rather than providing the complete solution.  Be encouraging and supportive. Do not include any code in the response.`,
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
