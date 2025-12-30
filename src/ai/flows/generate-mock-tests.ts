'use server';

/**
 * @fileOverview A mock test generator AI agent.
 *
 * - generateMockTest - A function that handles the mock test generation process.
 * - GenerateMockTestInput - The input type for the generateMockTest function.
 * - GenerateMockTestOutput - The return type for the generateMockTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMockTestInputSchema = z.object({
  topic: z.string().describe('The topic of the mock test.'),
  numMcq: z.number().int().min(0).describe('The number of multiple-choice questions.'),
  numShortAnswer: z.number().int().min(0).describe('The number of short answer questions.'),
  numLongAnswer: z.number().int().min(0).describe('The number of long answer questions.'),
  numNumerical: z.number().int().min(0).describe('The number of numerical problems.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the mock test.'),
  language:
    z.enum(['English', 'Bengali', 'Mixed Bangla-English']).describe('The language of the mock test.')
});
export type GenerateMockTestInput = z.infer<typeof GenerateMockTestInputSchema>;

const GenerateMockTestOutputSchema = z.object({
  questionPaper: z.string().describe('The mock test in question paper style.'),
  answerKey: z.string().describe('The answer key for the mock test.'),
  detailedSolutions: z.string().describe('The detailed solutions for the mock test.'),
});
export type GenerateMockTestOutput = z.infer<typeof GenerateMockTestOutputSchema>;

export async function generateMockTest(input: GenerateMockTestInput): Promise<GenerateMockTestOutput> {
  return generateMockTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMockTestPrompt',
  input: {schema: GenerateMockTestInputSchema},
  output: {schema: GenerateMockTestOutputSchema},
  prompt: `You are an expert teacher specialized in creating mock tests for students.

You will generate a mock test based on the following specifications:

Topic: {{{topic}}}
Number of MCQs: {{{numMcq}}}
Number of Short Answer Questions: {{{numShortAnswer}}}
Number of Long Answer Questions: {{{numLongAnswer}}}
Number of Numerical Problems: {{{numNumerical}}}
Difficulty: {{{difficulty}}}
Language: {{{language}}}

Format the output in a question paper style, including marks for each question.
Also, generate an answer key and detailed solutions for all questions.

Make sure that the questions are relevant to the topic and appropriate for the specified difficulty level.
If the language is Bengali or Mixed Bangla-English, use appropriate Bengali characters and grammar.

{{#if numMcq}}
Generate {{{numMcq}}} multiple-choice questions.
{{/if}}

{{#if numShortAnswer}}
Generate {{{numShortAnswer}}} short answer questions.
{{/if}}

{{#if numLongAnswer}}
Generate {{{numLongAnswer}}} long answer questions.
{{/if}}

{{#if numNumerical}}
Generate {{{numNumerical}}} numerical problems.
{{/if}}


Output the question paper, answer key, and detailed solutions in a well-structured format.
`,
});

const generateMockTestFlow = ai.defineFlow(
  {
    name: 'generateMockTestFlow',
    inputSchema: GenerateMockTestInputSchema,
    outputSchema: GenerateMockTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
