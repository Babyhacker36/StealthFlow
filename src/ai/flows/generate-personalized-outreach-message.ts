'use server';
/**
 * @fileOverview Generates personalized outreach message variations for leads.
 *
 * - generatePersonalizedOutreachMessage - A function that generates personalized outreach messages.
 * - GeneratePersonalizedOutreachMessageInput - The input type for the generatePersonalizedOutreachMessage function.
 * - GeneratePersonalizedOutreachMessageOutput - The return type for the generatePersonalizedOutreachMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedOutreachMessageInputSchema = z.object({
  leadInfo: z
    .string()
    .describe("A detailed description of the lead's public information, including job title, university, and any other relevant details."),
  numVariations: z
    .number()
    .default(3)
    .describe('The number of personalized outreach message variations to generate.'),
});
export type GeneratePersonalizedOutreachMessageInput = z.infer<
  typeof GeneratePersonalizedOutreachMessageInputSchema
>;

const GeneratePersonalizedOutreachMessageOutputSchema = z.object({
  messages: z.array(z.string()).describe('An array of personalized outreach message variations.'),
});
export type GeneratePersonalizedOutreachMessageOutput = z.infer<
  typeof GeneratePersonalizedOutreachMessageOutputSchema
>;

export async function generatePersonalizedOutreachMessage(
  input: GeneratePersonalizedOutreachMessageInput
): Promise<GeneratePersonalizedOutreachMessageOutput> {
  return generatePersonalizedOutreachMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedOutreachMessagePrompt',
  input: {schema: GeneratePersonalizedOutreachMessageInputSchema},
  output: {schema: GeneratePersonalizedOutreachMessageOutputSchema},
  prompt: `You are an expert at crafting personalized outreach messages that get high engagement rates.

  Analyze the following information about the lead and generate {{numVariations}} different outreach message variations. Each message should be personalized based on the lead's job title, university, or other relevant details. Be creative and vary the approach in each message.

  Lead Information: {{{leadInfo}}}

  Output the messages as a JSON array of strings.
  `, // Ensure the output is a valid JSON array of strings
});

const generatePersonalizedOutreachMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOutreachMessageFlow',
    inputSchema: GeneratePersonalizedOutreachMessageInputSchema,
    outputSchema: GeneratePersonalizedOutreachMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

