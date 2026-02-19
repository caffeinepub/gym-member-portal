import React, { useState, useEffect, useRef } from 'react';
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
      const response = await askVortex.mutateAsync(currentInput);
      
      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping);
        const vortexMessage: Message = {
          id: Date.now().toString(),
          content: response,
          isVortex: true,
          timestamp: new Date(),
        };
        return [...withoutTyping, vortexMessage];
      });
    } catch (error) {
      console.error('Failed to get VORTEX response:', error);
      
      // Remove typing indicator and add error message
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: 'I apologize, but I encountered an error processing your request. Please try again, and I\'ll do my best to help you!',
          isVortex: true,
          timestamp: new Date(),
        };
        return [...withoutTyping, errorMessage];
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
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            VORTEX AI Assistant
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <VortexMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 border-t pt-4">
          <Input
            placeholder="Ask VORTEX anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={askVortex.isPending}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={askVortex.isPending || !input.trim()} 
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
