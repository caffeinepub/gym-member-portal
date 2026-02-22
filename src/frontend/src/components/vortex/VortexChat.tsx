import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAskVortex } from '../../hooks/useQueries';
import VortexMessage from './VortexMessage';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVortex: boolean;
}

interface VortexChatProps {
  mode?: 'modal' | 'fullPage';
}

// Helper function to preprocess response from backend
function preprocessVortexResponse(response: string): string {
  // Remove any wrapping quotes
  let cleaned = response.replace(/^["']|["']$/g, '');
  
  // Remove code fences
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Remove JSON-like wrapping
  cleaned = cleaned.replace(/^\s*\{[\s\S]*?"(?:message|content|text)":\s*"([^"]+)"[\s\S]*\}\s*$/g, '$1');
  
  // Clean up escape sequences
  cleaned = cleaned.replace(/\\n/g, '\n');
  cleaned = cleaned.replace(/\\"/g, '"');
  
  return cleaned.trim();
}

export default function VortexChat({ mode = 'modal' }: VortexChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: askVortex, isPending } = useAskVortex();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      isVortex: false,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    askVortex(
      input.trim(),
      {
        onSuccess: (response) => {
          // Preprocess the response to remove code artifacts
          const cleanedResponse = preprocessVortexResponse(response);
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleanedResponse,
            timestamp: new Date(),
            isVortex: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: (error: any) => {
          console.error('Vortex AI error:', error);
          toast.error(error.message || 'Failed to get response from Vortex AI. Please try again.');
          // Remove the user message if the request failed
          setMessages((prev) => prev.slice(0, -1));
        },
      }
    );
  };

  const handleClearConversation = () => {
    setMessages([]);
    toast.success('Conversation cleared');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col ${mode === 'fullPage' ? 'h-full' : 'h-[600px]'} bg-zinc-950`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-volt-green to-electric-blue">
            <Sparkles className="h-5 w-5 text-zinc-950" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">VORTEX AI 0.2</h3>
            <p className="text-xs text-zinc-400">Enhanced Intelligence • Fitness Coaching</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            className="h-8 gap-2 text-zinc-400 hover:text-volt-green"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-volt-green/20 to-electric-blue/20">
              <Sparkles className="h-8 w-8 text-volt-green" />
            </div>
            <div>
              <h4 className="mb-2 text-xl font-black text-white">
                VORTEX AI 0.2 Ready
              </h4>
              <p className="text-sm text-zinc-400">
                Ask me anything about fitness, nutrition, or training!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <VortexMessage key={message.id} message={message} />
            ))}
            {isPending && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-volt-green to-electric-blue">
                  <Sparkles className="h-4 w-4 text-zinc-950" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-volt-green" />
                  <span className="text-sm text-zinc-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask VORTEX AI anything..."
            disabled={isPending}
            className="h-12 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-volt-green"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            className="h-12 w-12 bg-gradient-to-br from-volt-green to-electric-blue text-zinc-950 hover:opacity-90"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
