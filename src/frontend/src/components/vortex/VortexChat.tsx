import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { useAskVortex } from '../../hooks/useQueries';
import VortexMessage from './VortexMessage';

interface Message {
  id: string;
  content: string;
  isVortex: boolean;
  timestamp: Date;
}

interface VortexChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VortexChat({ open, onOpenChange }: VortexChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m VORTEX, your AI fitness assistant. How can I help you today?',
      isVortex: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const askVortex = useAskVortex();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isVortex: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await askVortex.mutateAsync(input);
      
      const vortexMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isVortex: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, vortexMessage]);
    } catch (error) {
      console.error('Failed to get VORTEX response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isVortex: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            VORTEX AI Assistant
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <VortexMessage key={message.id} message={message} />
            ))}
            {askVortex.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>VORTEX is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 border-t pt-4">
          <Input
            placeholder="Ask VORTEX anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={askVortex.isPending}
          />
          <Button onClick={handleSend} disabled={askVortex.isPending || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
