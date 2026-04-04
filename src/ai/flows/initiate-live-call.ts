'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';

const UrduOrderConfirmationInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  productName: z.string().describe('The name of the product ordered.'),
  productPrice: z.string().describe('The price of the product.'),
});

const InitiateLiveCallInputSchema = z.object({
  to: z.string().describe('The phone number to call.'),
  order: UrduOrderConfirmationInputSchema,
});

export type InitiateLiveCallInput = z.infer<typeof InitiateLiveCallInputSchema>;

const InitiateLiveCallOutputSchema = z.object({
  callSid: z.string().describe('The SID of the initiated Twilio call.'),
});

export type InitiateLiveCallOutput = z.infer<
  typeof InitiateLiveCallOutputSchema
>;

const urduOrderConfirmationPrompt = ai.definePrompt({
  name: 'urduOrderConfirmationLiveCallPrompt',
  input: { schema: UrduOrderConfirmationInputSchema },
  output: {
    schema: z.string().describe('The Urdu greeting and order confirmation message.'),
  },
  prompt: `Assalamualaikum! Kya main {{{customerName}}} se baat kar raha hoon? Aap ne hamari website se {{{productName}}} order kiya tha, jiski price {{{productPrice}}} Rupees hai. Kya aap apna order confirm karte hain?`,
});

const initiateLiveCallFlow = ai.defineFlow(
  {
    name: 'initiateLiveCallFlow',
    inputSchema: InitiateLiveCallInputSchema,
    outputSchema: InitiateLiveCallOutputSchema,
  },
  async (input) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !from) {
      throw new Error(
        'Twilio credentials are not configured in .env.local. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.'
      );
    }

    const client = twilio(accountSid, authToken);

    const { output: generatedText } = await urduOrderConfirmationPrompt(
      input.order
    );

    if (!generatedText) {
      throw new Error('Failed to generate call script text.');
    }

    const twiml = `<Response><Say language="ur-PK" voice="Polly.Zayd">${generatedText}</Say></Response>`;

    const call = await client.calls.create({
      twiml: twiml,
      to: input.to,
      from: from,
    });

    return { callSid: call.sid };
  }
);

export async function initiateLiveCall(
  input: InitiateLiveCallInput
): Promise<InitiateLiveCallOutput> {
  return initiateLiveCallFlow(input);
}
