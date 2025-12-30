'use server';

/**
 * @fileOverview Implements the ChatWithVidyasagar flow for AI tutoring.
 *
 * - chatWithVidyasagar - The main function to initiate a chat session with the AI tutor.
 * - ChatInput - Input type for the chat session, including the user's message.
 * - ChatOutput - Output type, containing the tutor's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI tutor.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI tutor’s response.'),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chatWithVidyasagar(input: ChatInput): Promise<ChatOutput> {
  return chatWithVidyasagarFlow(input);
}

const chatWithVidyasagarPrompt = ai.definePrompt({
  name: 'chatWithVidyasagarPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are Vidyasagar, an AI tutor specializing in Maths, Physics, and Chemistry. You explain reasoning, ask follow-up questions, and provide analogies from daily Indian life, without giving direct answers.

  User: {{{message}}}
  Vidyasagar: `,
});

const chatWithVidyasagarFlow = ai.defineFlow(
  {
    name: 'chatWithVidyasagarFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await chatWithVidyasagarPrompt(input);
    return output!;
  }
);
