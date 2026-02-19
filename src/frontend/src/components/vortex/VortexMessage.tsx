import React from 'react';
import { Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isVortex: boolean;
  timestamp: Date;
}

interface VortexMessageProps {
  message: Message;
}

export default function VortexMessage({ message }: VortexMessageProps) {
  return (
    <div className={`flex gap-3 ${message.isVortex ? '' : 'flex-row-reverse'}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          message.isVortex ? 'bg-primary/10' : 'bg-muted'
        }`}
      >
        {message.isVortex ? (
          <Sparkles className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className={`flex-1 space-y-1 ${message.isVortex ? '' : 'text-right'}`}>
        <div
          className={`inline-block rounded-lg px-4 py-2 ${
            message.isVortex ? 'bg-muted' : 'bg-primary text-primary-foreground'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
