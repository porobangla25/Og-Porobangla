// Implemented the GenerateStructuredNotes flow with input and output schemas and a prompt for generating structured notes.
'use server';
/**
 * @fileOverview Generates teacher-style structured notes on a given topic.
 *
 * - generateStructuredNotes - A function that generates structured notes.
 * - GenerateStructuredNotesInput - The input type for the generateStructuredNotes function.
 * - GenerateStructuredNotesOutput - The return type for the generateStructuredNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStructuredNotesInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate notes.'),
  language: z
    .enum(['English', 'Bengali', 'Mixed Bangla-English'])
    .describe('The language in which to generate the notes.'),
});
export type GenerateStructuredNotesInput = z.infer<typeof GenerateStructuredNotesInputSchema>;

const GenerateStructuredNotesOutputSchema = z.object({
  notes: z.string().describe('The generated structured notes.'),
});
export type GenerateStructuredNotesOutput = z.infer<typeof GenerateStructuredNotesOutputSchema>;

export async function generateStructuredNotes(
  input: GenerateStructuredNotesInput
): Promise<GenerateStructuredNotesOutput> {
  return generateStructuredNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStructuredNotesPrompt',
  input: {schema: GenerateStructuredNotesInputSchema},
  output: {schema: GenerateStructuredNotesOutputSchema},
  prompt: `You are an expert teacher skilled at creating well-structured notes for students.

  Please generate structured notes on the following topic: {{{topic}}}.
  The notes should be in {{{language}}} language.

  The notes should include:
  - Headings and subheadings to organize the content.
  - Bullet points to list key information.
  - Definitions of important terms.
  - Examples to illustrate concepts.
  - Exam tips to help students prepare for exams.
  - "Exam Focus" sections
  - "Common Mistakes" sections
  - "Memory Tricks" sections

  If the language is Bengali or Mixed Bangla-English, please use appropriate Bengali script.
  If there are math equations, please include LaTeX support.
  `,
});

const generateStructuredNotesFlow = ai.defineFlow(
  {
    name: 'generateStructuredNotesFlow',
    inputSchema: GenerateStructuredNotesInputSchema,
    outputSchema: GenerateStructuredNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
