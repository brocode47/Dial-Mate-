'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Send,
  Loader2,
  PhoneOff,
  User,
  Bot,
  Sparkles,
  HeartPulse,
  Download,
  PhoneForwarded,
} from 'lucide-react';
import { type Order } from '@/lib/mock-data';
import {
  startOrderConfirmationCall,
  getIntelligentResponse,
  getCallSummary,
  startLiveCall,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type ConversationTurn = {
  speaker: 'agent' | 'customer';
  text: string;
};

type Summary = {
  summary: string;
  sentiment: 'مثبت' | 'منفی' | 'غیر جانبدار';
};

const CONFIRMATION_SCRIPT = "Assalamualaikum! Kya main {customerName} se baat kar raha hoon? Aap ne hamari website se {productName} order kiya tha, jiski price {productPrice} Rupees hai. Kya aap apna order confirm karte hain?";

export function CallSimulation({ order }: { order: Order }) {
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [isLiveCalling, setIsLiveCalling] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [customerQuery, setCustomerQuery] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation]);

  const handleStartCall = async () => {
    setIsCalling(true);
    setSummary(null);
    setConversation([]);
    
    const result = await startOrderConfirmationCall({
      customerName: order.customerName,
      productName: order.productName,
      productPrice: order.productPrice,
      script: CONFIRMATION_SCRIPT,
    });

    if ('error' in result || !result.spokenGreetingAudioUri) {
      toast({
        variant: 'destructive',
        title: 'Error Starting Call',
        description:
          result.error || 'Failed to generate greeting audio. Please try again.',
      });
      setIsCalling(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = result.spokenGreetingAudioUri;
      audioRef.current.play().catch((e) => console.error('Audio play error:', e));
    }
    
    const greetingText = CONFIRMATION_SCRIPT
        .replace('{customerName}', order.customerName)
        .replace('{productName}', order.productName)
        .replace('{productPrice}', order.productPrice);

    setConversation([{ speaker: 'agent', text: greetingText }]);

    setIsCalling(false);
    setCallStarted(true);
  };

  const handleStartLiveCall = async () => {
    setIsLiveCalling(true);
    const result = await startLiveCall({
      to: order.customerPhone,
      order: {
        customerName: order.customerName,
        productName: order.productName,
        productPrice: order.productPrice,
        script: CONFIRMATION_SCRIPT,
      },
    });

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Starting Live Call',
        description: result.error,
      });
    } else {
      toast({
        title: 'Live Call Initiated',
        description: `Call SID: ${result.callSid}. Your phone should be ringing shortly.`,
      });
    }

    setIsLiveCalling(false);
  };


  const handleSendQuery = async () => {
    if (!customerQuery.trim()) return;

    setIsAnswering(true);
    const newConversation: ConversationTurn[] = [
      ...conversation,
      { speaker: 'customer', text: customerQuery },
    ];
    setConversation(newConversation);
    const queryToSubmit = customerQuery;
    setCustomerQuery('');

    const result = await getIntelligentResponse({
      customerQuery: queryToSubmit,
      productId: order.productId,
    });
    
    if ('error' in result || !result.answer) {
      toast({
        variant: 'destructive',
        title: 'Error Getting Response',
        description:
          result.error || 'The AI failed to generate a response.',
      });
       setConversation([
        ...newConversation,
        { speaker: 'agent', text: "معافی چاہتا ہوں، میں ابھی آپ کے سوال کا جواب نہیں دے سکتا۔" },
      ]);
    } else {
       setConversation([
        ...newConversation,
        { speaker: 'agent', text: result.answer },
      ]);
    }
    setIsAnswering(false);
  };
  
  const handleEndCall = async () => {
    setIsSummarizing(true);
    const transcript = conversation.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
    const result = await getCallSummary({ transcript });
    
    if ('error' in result || !result.summary) {
       toast({
        variant: 'destructive',
        title: 'Error Summarizing Call',
        description:
          result.error || 'The AI failed to generate a summary.',
      });
    } else {
      setSummary({ summary: result.summary, sentiment: result.sentiment });
    }
    
    setIsSummarizing(false);
    setCallStarted(false);
  };

  const handleDownloadSummary = () => {
    if (!summary) return;

    const summaryContent = `
Order ID: ${order.id}
Customer: ${order.customerName}
Product: ${order.productName}
Date: ${new Date().toLocaleDateString()}

Sentiment: ${summary.sentiment === 'مثبت' ? 'Positive' : summary.sentiment === 'منفی' ? 'Negative' : 'Neutral'}

Summary (Urdu):
${summary.summary}

Conversation Transcript:
${conversation.map(turn => `${turn.speaker}: ${turn.text}`).join('\n')}
    `;

    const blob = new Blob([summaryContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary-order-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Summary Downloading',
      description: 'Your file will be downloaded shortly.',
    });
  };

  const getSentimentBadge = (sentiment: Summary['sentiment']) => {
    switch (sentiment) {
      case 'مثبت':
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case 'منفی':
        return <Badge variant="destructive">Negative</Badge>;
      case 'غیر جانبدار':
        return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone /> Call Simulation
        </CardTitle>
        <CardDescription>
          Simulate an AI-powered verification call for this order.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        {!callStarted && !summary && (
          <div className="flex-grow flex items-center justify-center">
            <Button size="lg" onClick={handleStartCall} disabled={isCalling}>
              {isCalling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Phone className="mr-2 h-4 w-4" />
              )}
              Start Simulation
            </Button>
          </div>
        )}

        {(callStarted || summary) && (
          <div className="flex flex-col gap-4 h-full">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversation.map((turn, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      turn.speaker === 'agent' ? '' : 'justify-end'
                    }`}
                  >
                    {turn.speaker === 'agent' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-5 h-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs rounded-lg p-3 text-sm ${
                        turn.speaker === 'agent'
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground'
                      }`}
                      style={{ direction: 'rtl' }}
                    >
                      {turn.text}
                    </div>
                     {turn.speaker === 'customer' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isAnswering && (
                  <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-5 h-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                       <span className="text-sm text-muted-foreground">سوچ رہا ہوں...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
             {callStarted && (
              <div className="flex gap-2">
                <Textarea
                  placeholder="کسٹمر کا جواب یہاں ٹائپ کریں..."
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  disabled={isAnswering}
                  className="flex-grow"
                  style={{ direction: 'rtl' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendQuery();
                    }
                  }}
                />
                <Button onClick={handleSendQuery} disabled={!customerQuery.trim() || isAnswering}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {summary && (
           <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-primary" /> Call Summary</CardTitle>
               <Button variant="outline" size="sm" onClick={handleDownloadSummary}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent className="space-y-4" style={{direction: 'rtl'}}>
              <p className="text-sm">{summary.summary}</p>
              <div className="flex items-center gap-2">
                 <HeartPulse className="h-4 w-4 text-muted-foreground"/>
                 <span className="text-sm font-medium">Sentiment:</span>
                 {getSentimentBadge(summary.sentiment)}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="w-full flex justify-end gap-2">
         {callStarted ? (
            <Button variant="destructive" onClick={handleEndCall} disabled={isSummarizing}>
              {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PhoneOff className="mr-2 h-4 w-4" />
              )}
              End Simulation
            </Button>
          ) : (
             <>
              <Button variant="outline" onClick={handleStartLiveCall} disabled={isCalling || isLiveCalling}>
                  {isLiveCalling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PhoneForwarded className="mr-2 h-4 w-4" />}
                  Live Call
              </Button>
              <Button onClick={handleStartCall} disabled={isCalling || isLiveCalling}>
                {isCalling ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Phone className="mr-2 h-4 w-4" />
                )}
                {summary ? 'New Simulation' : 'Simulate Call'}
              </Button>
             </>
          )}
        </div>
      </CardFooter>
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
}
