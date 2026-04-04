
'use server';

import {
  urduCallSummaryAndSentiment,
  type UrduCallSummaryAndSentimentInput,
} from '@/ai/flows/urdu-call-summary-and-sentiment';
import {
  urduIntelligentQueryResponse,
  type UrduIntelligentQueryResponseInput,
} from '@/ai/flows/urdu-intelligent-query-response';
import {
  urduOrderConfirmationAgent,
  type UrduOrderConfirmationInput,
} from '@/ai/flows/urdu-order-confirmation-agent';
import {
  initiateLiveCall,
  type InitiateLiveCallInput,
} from '@/ai/flows/initiate-live-call';

export async function startOrderConfirmationCall(
  input: UrduOrderConfirmationInput
) {
  try {
    const result = await urduOrderConfirmationAgent(input);
    return result;
  } catch (error) {
    console.error('Error in startOrderConfirmationCall:', error);
    return { error: 'Failed to start call.' };
  }
}

export async function getIntelligentResponse(
  input: UrduIntelligentQueryResponseInput
) {
  try {
    const result = await urduIntelligentQueryResponse(input);
    return result;
  } catch (error) {
    console.error('Error in getIntelligentResponse:', error);
    return { error: 'Failed to get response.' };
  }
}

export async function getCallSummary(input: UrduCallSummaryAndSentimentInput) {
  try {
    const result = await urduCallSummaryAndSentiment(input);
    return result;
  } catch (error) {
    console.error('Error in getCallSummary:', error);
    return { error: 'Failed to get summary.' };
  }
}

export async function startLiveCall(input: InitiateLiveCallInput) {
  try {
    const result = await initiateLiveCall(input);
    return result;
  } catch (error: any) {
    console.error('Error in startLiveCall:', error);
    return { error: error.message || 'Failed to start live call.' };
  }
}
