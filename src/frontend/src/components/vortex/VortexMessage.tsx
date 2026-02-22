import React from 'react';
import { Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isVortex: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface VortexMessageProps {
  message: Message;
}

// Helper function to clean and parse message content
function cleanMessageContent(content: string): string {
  // Remove code blocks (```...```)
  let cleaned = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code backticks
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Remove JSON brackets and technical metadata
  cleaned = cleaned.replace(/^\s*[\{\[]\s*/g, '');
  cleaned = cleaned.replace(/\s*[\}\]]\s*$/g, '');
  
  // Remove script tags and HTML
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Remove common technical prefixes
  cleaned = cleaned.replace(/^(response|data|result|output):\s*/gi, '');
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Helper function to parse and format message content
function formatMessageContent(content: string): React.ReactNode {
  // First clean the content
  const cleanedContent = cleanMessageContent(content);
  
  // Split by double newlines for paragraphs
  const paragraphs = cleanedContent.split(/\n\n+/);
  
  return paragraphs.map((paragraph, pIndex) => {
    const lines = paragraph.split('\n');
    
    // Check if this is a list (numbered or bulleted)
    const isNumberedList = lines.every(line => 
      line.trim() === '' || /^\d+\.\s/.test(line.trim()) || line.trim().startsWith('-')
    );
    const isBulletList = lines.every(line => 
      line.trim() === '' || /^[-*•]\s/.test(line.trim())
    );
    
    if (isNumberedList && lines.some(line => /^\d+\.\s/.test(line.trim()))) {
      // Render as numbered list
      return (
        <ol key={pIndex} className="list-decimal list-inside space-y-1 my-2">
          {lines.filter(line => line.trim()).map((line, lIndex) => {
            const cleanedLine = line.replace(/^\d+\.\s*/, '').trim();
            return cleanedLine ? (
              <li key={lIndex} className="text-sm leading-relaxed">
                {cleanedLine}
              </li>
            ) : null;
          })}
        </ol>
      );
    }
    
    if (isBulletList && lines.some(line => /^[-*•]\s/.test(line.trim()))) {
      // Render as bullet list
      return (
        <ul key={pIndex} className="list-disc list-inside space-y-1 my-2">
          {lines.filter(line => line.trim()).map((line, lIndex) => {
            const cleanedLine = line.replace(/^[-*•]\s*/, '').trim();
            return cleanedLine ? (
              <li key={lIndex} className="text-sm leading-relaxed">
                {cleanedLine}
              </li>
            ) : null;
          })}
        </ul>
      );
    }
    
    // Check if paragraph contains inline list items (mixed content)
    const hasInlineListItems = lines.some(line => 
      /^[-*•]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())
    );
    
    if (hasInlineListItems) {
      return (
        <div key={pIndex} className="space-y-1 my-2">
          {lines.map((line, lIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Check if it's a list item
            if (/^[-*•]\s/.test(trimmedLine)) {
              const cleanedLine = trimmedLine.replace(/^[-*•]\s*/, '');
              return (
                <div key={lIndex} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-primary">•</span>
                  <span className="flex-1">{cleanedLine}</span>
                </div>
              );
            } else if (/^\d+\.\s/.test(trimmedLine)) {
              const match = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
              if (match) {
                return (
                  <div key={lIndex} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-primary font-medium">{match[1]}.</span>
                    <span className="flex-1">{match[2]}</span>
                  </div>
                );
              }
            }
            
            // Regular line
            return (
              <p key={lIndex} className="text-sm leading-relaxed">
                {trimmedLine}
              </p>
            );
          })}
        </div>
      );
    }
    
    // Regular paragraph - preserve line breaks within it
    return (
      <p key={pIndex} className="text-sm leading-relaxed my-2 whitespace-pre-wrap break-words">
        {paragraph.trim()}
      </p>
    );
  });
}

export default function VortexMessage({ message }: VortexMessageProps) {
  if (message.isTyping) {
    return (
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="inline-block rounded-lg bg-muted px-4 py-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          className={`inline-block rounded-lg px-4 py-3 max-w-full ${
            message.isVortex ? 'bg-muted text-left' : 'bg-primary text-primary-foreground'
          }`}
        >
          <div className="overflow-hidden break-words">
            {message.isVortex ? formatMessageContent(message.content) : (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
