import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { useAskVortex, VortexMessage as VortexMessageType } from '../../hooks/useQueries';
import VortexMessage from './VortexMessage';

interface Message {
  id: string;
  content: string;
  isVortex: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface VortexChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VortexChat({ open, onOpenChange }: VortexChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! 👋 I\'m VORTEX, your AI fitness assistant. How can I help you with your fitness journey today? Would you like to create a workout plan, check your progress, or need motivation?',
      isVortex: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const askVortex = useAskVortex();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || askVortex.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isVortex: false,
      timestamp: new Date(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');

    // Add typing indicator
    const typingIndicator: Message = {
      id: 'typing-' + Date.now(),
      content: '',
      isVortex: true,
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      // Call the mutation with just the message string
      const response = await askVortex.mutateAsync(currentInput);

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            content: response,
            isVortex: true,
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error('Error getting VORTEX response:', error);
      // Remove typing indicator and show error
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            content: 'Sorry, I encountered an error. Please try again.',
            isVortex: true,
            timestamp: new Date(),
          },
        ];
      });
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            VORTEX AI Assistant
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 pt-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <VortexMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Ask VORTEX anything about fitness..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={askVortex.isPending}
            />
            <Button onClick={handleSend} disabled={!input.trim() || askVortex.isPending} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
