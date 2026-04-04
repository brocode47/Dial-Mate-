'use server';
/**
 * @fileOverview An AI agent that calls customers in fluent Urdu to confirm Shopify orders.
 *
 * - urduOrderConfirmationAgent - A function that initiates an Urdu voice call to confirm an order.
 * - UrduOrderConfirmationInput - The input type for the urduOrderConfirmationAgent function.
 * - UrduOrderConfirmationOutput - The return type for the urduOrderConfirmationAgent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const UrduOrderConfirmationInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  productName: z.string().describe('The name of the product ordered.'),
  productPrice: z.string().describe('The price of the product.'),
});
export type UrduOrderConfirmationInput = z.infer<typeof UrduOrderConfirmationInputSchema>;

const UrduOrderConfirmationOutputSchema = z.object({
  spokenGreetingAudioUri: z
    .string()
    .describe(
      "The generated Urdu greeting and order confirmation message as an audio data URI (WAV format). Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type UrduOrderConfirmationOutput = z.infer<typeof UrduOrderConfirmationOutputSchema>;

/**
 * Initiates an Urdu voice call to confirm a Shopify order.
 * It greets the customer politely, states order details, and asks for confirmation.
 */
export async function urduOrderConfirmationAgent(
  input: UrduOrderConfirmationInput
): Promise<UrduOrderConfirmationOutput> {
  return urduOrderConfirmationFlow(input);
}

// Utility function to convert PCM audio to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const urduOrderConfirmationPrompt = ai.definePrompt({
  name: 'urduOrderConfirmationPrompt',
  input: { schema: UrduOrderConfirmationInputSchema },
  output: { schema: z.string().describe('The Urdu greeting and order confirmation message.') },
  prompt: `Assalamualaikum! Kya main {{{customerName}}} se baat kar raha hoon? Aap ne hamari website se {{{productName}}} order kiya tha, jiski price {{{productPrice}}} Rupees hai. Kya aap apna order confirm karte hain?`,
});

const urduOrderConfirmationFlow = ai.defineFlow(
  {
    name: 'urduOrderConfirmationFlow',
    inputSchema: UrduOrderConfirmationInputSchema,
    outputSchema: UrduOrderConfirmationOutputSchema,
  },
  async (input) => {
    const { output: generatedText } = await urduOrderConfirmationPrompt(input);

    if (!generatedText) {
      throw new Error('Failed to generate Urdu confirmation text.');
    }

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Algenib is a neutral voice, assumed suitable for Urdu.
          },
        },
      },
      prompt: generatedText,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS generation.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      spokenGreetingAudioUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
