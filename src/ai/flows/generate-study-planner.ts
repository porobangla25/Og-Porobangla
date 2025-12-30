'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a day-wise study timetable.
 *
 * The flow takes into account the student's progress and missed days to create an adjustable schedule.
 *
 * @exports {
 *   generateStudyPlanner: (input: GenerateStudyPlannerInput) => Promise<GenerateStudyPlannerOutput>;
 *   GenerateStudyPlannerInput: type;
 *   GenerateStudyPlannerOutput: type;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlannerInputSchema = z.object({
  startDate: z.string().describe('The start date for the study plan (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the study plan (YYYY-MM-DD).'),
  subjects: z.array(z.string()).describe('List of subjects to study.'),
  revisionDaysInterval: z.number().describe('The interval (in days) for revision slots.'),
  mockTestDays: z.array(z.string()).describe('Specific dates (YYYY-MM-DD) designated for mock tests.'),
  missedDays: z.number().optional().describe('Number of study days missed.'),
  progress: z.number().optional().describe('Percentage of overall progress (0-100).'),
});
export type GenerateStudyPlannerInput = z.infer<typeof GenerateStudyPlannerInputSchema>;

const GenerateStudyPlannerOutputSchema = z.object({
  timetable: z.array(z.object({
    date: z.string().describe('Date in YYYY-MM-DD format.'),
    activities: z.array(z.string()).describe('List of activities for the day (e.g., study Math, revision, mock test).'),
  })).describe('A day-wise timetable with subjects, revision slots and mock test days.'),
});
export type GenerateStudyPlannerOutput = z.infer<typeof GenerateStudyPlannerOutputSchema>;

export async function generateStudyPlanner(input: GenerateStudyPlannerInput): Promise<GenerateStudyPlannerOutput> {
  return generateStudyPlannerFlow(input);
}

const generateStudyPlannerPrompt = ai.definePrompt({
  name: 'generateStudyPlannerPrompt',
  input: {schema: GenerateStudyPlannerInputSchema},
  output: {schema: GenerateStudyPlannerOutputSchema},
  prompt: `You are an AI study planner expert that generates a day-wise study timetable.

  The timetable should include specific subjects to study, revision slots scheduled at regular intervals,
  and designated mock test days.

  Consider the student's progress and missed days to adjust the timetable accordingly.  If progress
  is low or missed days are high, allocate more time to core concepts.

  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}
  Subjects: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Revision Days Interval: {{{revisionDaysInterval}}} days
  Mock Test Days: {{#each mockTestDays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Missed Days: {{{missedDays}}}
  Progress: {{{progress}}}%

  Generate a detailed timetable, ensuring it is well-organized and easy to follow.
  Here is the timetable:
  `,
});

const generateStudyPlannerFlow = ai.defineFlow(
  {
    name: 'generateStudyPlannerFlow',
    inputSchema: GenerateStudyPlannerInputSchema,
    outputSchema: GenerateStudyPlannerOutputSchema,
  },
  async input => {
    const {output} = await generateStudyPlannerPrompt(input);
    return output!;
  }
);
