// A Genkit Flow that generates an initial prompt for the chatbot to help new users get started.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptInputSchema = z.void();
export type GenerateInitialPromptInput = z.infer<typeof GenerateInitialPromptInputSchema>;

const GenerateInitialPromptOutputSchema = z.object({
  prompt: z.string().describe('The initial prompt or suggestion for the chatbot.'),
});
export type GenerateInitialPromptOutput = z.infer<typeof GenerateInitialPromptOutputSchema>;

export async function generateInitialPrompt(): Promise<GenerateInitialPromptOutput> {
  return generateInitialPromptFlow();
}

const prompt = ai.definePrompt({
  name: 'generateInitialPromptPrompt',
  prompt: `You are an AI chatbot. Provide a single initial prompt or suggestion to help new users understand your capabilities and get started quickly. The suggestion should be a question that you can answer.

Example: "What is the capital of France?"

Your suggestion:`,
  output: {schema: GenerateInitialPromptOutputSchema},
});

const generateInitialPromptFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptFlow',
    inputSchema: GenerateInitialPromptInputSchema,
    outputSchema: GenerateInitialPromptOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
