'use server';
/**
 * @fileOverview An AI agent flow that handles customer queries in Urdu, providing intelligent and context-aware responses.
 *
 * - urduIntelligentQueryResponse - A function that processes customer questions in Urdu.
 * - UrduIntelligentQueryResponseInput - The input type for the urduIntelligentQueryResponse function.
 * - UrduIntelligentQueryResponseOutput - The return type for the urduIntelligentQueryResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UrduIntelligentQueryResponseInputSchema = z.object({
  customerQuery: z.string().describe('The customer\'s question in Urdu.'),
  orderId: z.string().optional().describe('Optional: The Shopify order ID if the query is order-specific.'),
  productId: z.string().optional().describe('Optional: The Shopify product ID if the query is product-specific.'),
});
export type UrduIntelligentQueryResponseInput = z.infer<typeof UrduIntelligentQueryResponseInputSchema>;

const UrduIntelligentQueryResponseOutputSchema = z.object({
  answer: z.string().describe('The AI agent\'s response to the customer in fluent Pakistani Urdu.'),
  dataSources: z.array(z.string()).optional().describe('Optional: A list of sources from which the answer was derived (e.g., Shopify, FAQ).'),
});
export type UrduIntelligentQueryResponseOutput = z.infer<typeof UrduIntelligentQueryResponseOutputSchema>;

/**
 * Simulates fetching product details from Shopify.
 * In a real application, this would call out to a Shopify API.
 */
const getShopifyProductDetails = ai.defineTool(
  {
    name: 'getShopifyProductDetails',
    description: 'Fetches detailed information about a product from Shopify based on its ID. Returns product name, price, available colors, description, delivery info, return policy, and cash on delivery availability.',
    inputSchema: z.object({
      productId: z.string().describe('The Shopify product ID.'),
    }),
    outputSchema: z.object({
      productName: z.string().optional().describe('The name of the product.'),
      price: z.string().optional().describe('The price of the product.'),
      availableColors: z.array(z.string()).optional().describe('Available colors for the product.'),
      description: z.string().optional().describe('A brief description of the product.'),
      deliveryInfo: z.string().optional().describe('Information regarding product delivery.'),
      returnPolicy: z.string().optional().describe('The return policy for the product.'),
      cashOnDelivery: z.boolean().optional().describe('Indicates if Cash on Delivery is available for the product.'),
    }).optional(),
  },
  async (input) => {
    // Mock implementation for demonstration purposes.
    // In a real application, this would integrate with Shopify API.
    console.log(`Tool: getShopifyProductDetails called for productId: ${input.productId}`);
    if (input.productId === 'prod123') {
      return {
        productName: 'Designer Kurta',
        price: 'PKR 2500',
        availableColors: ['Red', 'Blue', 'Green'],
        description: 'A stylish kurta made from premium fabric.',
        deliveryInfo: 'Usually delivered within 3-5 business days across Pakistan.',
        returnPolicy: '30-day return policy, product must be unused.',
        cashOnDelivery: true,
      };
    }
    return undefined;
  }
);

/**
 * Simulates fetching an answer from a predefined FAQ database.
 * In a real application, this would query a database or a knowledge base.
 */
const getFaqAnswer = ai.defineTool(
  {
    name: 'getFaqAnswer',
    description: 'Retrieves an answer to a general customer query from a predefined FAQ database.',
    inputSchema: z.object({
      query: z.string().describe('The customer\'s query to search in the FAQ database.'),
    }),
    outputSchema: z.string().optional().describe('The relevant answer from the FAQ database, if found.'),
  },
  async (input) => {
    // Mock implementation for demonstration purposes.
    const lowerCaseQuery = input.query.toLowerCase();
    if (lowerCaseQuery.includes('delivery')) {
      return 'ہماری ڈیلیوری کا وقت عام طور پر 3 سے 5 کاروباری دنوں کا ہوتا ہے۔ (Our delivery time is usually 3 to 5 business days.)';
    } else if (lowerCaseQuery.includes('return policy') || lowerCaseQuery.includes('واپسی پالیسی')) {
      return 'ہماری واپسی پالیسی 30 دن کی ہے بشرطیکہ پروڈکٹ غیر استعمال شدہ ہو۔ (Our return policy is 30 days, provided the product is unused.)';
    } else if (lowerCaseQuery.includes('cash on delivery') || lowerCaseQuery.includes('کیش آن ڈیلیوری')) {
      return 'جی بالکل، کیش آن ڈیلیوری کی سہولت دستیاب ہے۔ (Yes, Cash on Delivery facility is available.)';
    }
    return undefined;
  }
);

const urduIntelligentQueryResponsePrompt = ai.definePrompt({
  name: 'urduIntelligentQueryResponsePrompt',
  input: { schema: UrduIntelligentQueryResponseInputSchema },
  output: { schema: UrduIntelligentQueryResponseOutputSchema },
  tools: [getShopifyProductDetails, getFaqAnswer],
  prompt: `You are an intelligent AI assistant specialized in customer service for an e-commerce platform, speaking fluent and polite Pakistani Urdu. Your primary goal is to answer customer questions accurately and helpfully, using information available to you. You must always respond in Urdu. If you use information from a tool, you must explicitly state the source in the 'dataSources' field.

The customer has asked the following question: "{{{customerQuery}}}"

If the question is about product details (price, colors, description), delivery, or return policy, consider using the 'getShopifyProductDetails' tool with the provided 'productId' if available, or try to infer it from the query. If specific product details are found, prioritize them.

If the question is a general inquiry that might be covered in an FAQ, such as general delivery information or return policy, use the 'getFaqAnswer' tool. If you get an answer from the FAQ, mention 'FAQ' as a dataSource.

Respond in fluent Pakistani Urdu, using natural phrases like "جی بالکل", "ٹھیک ہے", "مہربانی فرما کر تصدیق کریں" where appropriate. If you cannot find relevant information, politely state that you are unable to answer the specific part of the question.

Here is the context available:
{{#if orderId}}
Order ID: {{{orderId}}}
{{/if}}
{{#if productId}}
Product ID: {{{productId}}}
{{/if}}
`,
});

const urduIntelligentQueryResponseFlow = ai.defineFlow(
  {
    name: 'urduIntelligentQueryResponseFlow',
    inputSchema: UrduIntelligentQueryResponseInputSchema,
    outputSchema: UrduIntelligentQueryResponseOutputSchema,
  },
  async (input) => {
    const { output } = await urduIntelligentQueryResponsePrompt(input);
    return output!;
  }
);

export async function urduIntelligentQueryResponse(input: UrduIntelligentQueryResponseInput): Promise<UrduIntelligentQueryResponseOutput> {
  return urduIntelligentQueryResponseFlow(input);
}
