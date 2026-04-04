'use server';
/**
 * @fileOverview This file implements a Genkit flow for processing Urdu call transcripts.
 *
 * - urduCallSummaryAndSentiment - A function that processes an Urdu call transcript to generate a summary, sentiment, and return the original transcript.
 * - UrduCallSummaryAndSentimentInput - The input type for the urduCallSummaryAndSentiment function.
 * - UrduCallSummaryAndSentimentOutput - The return type for the urduCallSummaryAndSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UrduCallSummaryAndSentimentInputSchema = z.object({
  transcript: z.string().describe('The full Urdu conversation transcript of the call.'),
});
export type UrduCallSummaryAndSentimentInput = z.infer<typeof UrduCallSummaryAndSentimentInputSchema>;

const UrduCallSummaryAndSentimentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the call\'s outcome in Urdu.'),
  sentiment: z.enum(['مثبت', 'منفی', 'غیر جانبدار']).describe('The sentiment of the customer\'s interaction: مثبت (Positive), منفی (Negative), or غیر جانبدار (Neutral).'),
  originalTranscript: z.string().describe('The original Urdu conversation transcript.'),
});
export type UrduCallSummaryAndSentimentOutput = z.infer<typeof UrduCallSummaryAndSentimentOutputSchema>;

export async function urduCallSummaryAndSentiment(input: UrduCallSummaryAndSentimentInput): Promise<UrduCallSummaryAndSentimentOutput> {
  return urduCallSummaryAndSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'urduCallSummaryAndSentimentPrompt',
  input: {schema: UrduCallSummaryAndSentimentInputSchema},
  output: {schema: UrduCallSummaryAndSentimentOutputSchema},
  prompt: `آپ ایک AI اسسٹنٹ ہیں جو ایک شاپائف اسٹور کے مالک کے لیے کام کر رہے ہیں۔
آپ کو ایک اردو کال ٹرانسکرپٹ فراہم کیا جائے گا۔

اس ٹرانسکرپٹ کا تجزیہ کریں اور درج ذیل معلومات اردو میں فراہم کریں:
1. کال کے نتیجے کا ایک مختصر اور جامع خلاصہ۔
2. گاہک کے تعامل کے جذبات کا تعین کریں: مثبت (Positive)، منفی (Negative)، یا غیر جانبدار (Neutral)۔
3. اصلی ٹرانسکرپٹ کو بھی واپس کریں۔

فارمٹ کو سختی سے آؤٹ پٹ اسکیما کے مطابق ہونا چاہیے۔

ٹرانسکرپٹ:
{{{transcript}}}`,
});

const urduCallSummaryAndSentimentFlow = ai.defineFlow(
  {
    name: 'urduCallSummaryAndSentimentFlow',
    inputSchema: UrduCallSummaryAndSentimentInputSchema,
    outputSchema: UrduCallSummaryAndSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
