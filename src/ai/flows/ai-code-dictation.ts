'use server';
/**
 * @fileOverview Converts dictated natural language into Python code.
 *
 * - `dictateCode` - A function that takes dictated text and returns formatted Python code.
 * - `DictateCodeInput` - The input type for the `dictateCode` function.
 * - `DictateCodeOutput` - The return type for the `dictateCode` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DictateCodeInputSchema = z.object({
  dictatedText: z.string().describe('The natural language dictation to be converted into code.'),
});
export type DictateCodeInput = z.infer<typeof DictateCodeInputSchema>;

const DictateCodeOutputSchema = z.object({
  formattedCode: z.string().describe('The formatted Python code.'),
});
export type DictateCodeOutput = z.infer<typeof DictateCodeOutputSchema>;

export async function dictateCode(input: DictateCodeInput): Promise<DictateCodeOutput> {
  return codeDictationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeDictationPrompt',
  input: {schema: DictateCodeInputSchema},
  output: {schema: DictateCodeOutputSchema},
  prompt: `You are an expert programmer specializing in Python. Convert the following natural language dictation into valid Python code.
  - Convert spoken words for symbols and operators into their character representations (e.g., 'plus' -> '+', 'equals' -> '=', 'open parenthesis' -> '(').
  - Add correct syntax, such as parentheses for function calls and quotes for strings.
  - For example, 'print hello world' should become 'print("Hello, World!")'.
  - Another example, 'x equals 5' should become 'x = 5'.
  - Do not add any commentary or explanation, only the resulting code.

  Dictation: {{{dictatedText}}}
  `,
});

const codeDictationFlow = ai.defineFlow(
  {
    name: 'codeDictationFlow',
    inputSchema: DictateCodeInputSchema,
    outputSchema: DictateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
