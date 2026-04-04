'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';

const UrduOrderConfirmationInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  productName: z.string().describe('The name of the product ordered.'),
  productPrice: z.string().describe('The price of the product.'),
  script: z.string().describe('The text-to-speech script with placeholders.'),
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

    const generatedText = input.order.script
      .replace('{customerName}', input.order.customerName)
      .replace('{productName}', input.order.productName)
      .replace('{productPrice}', input.order.productPrice);

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
