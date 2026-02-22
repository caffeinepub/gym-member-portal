import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VortexChat from '../components/vortex/VortexChat';

export default function VortexAIPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900 p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/client-dashboard' })}
            className="gap-2 text-zinc-400 hover:text-volt-green"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-black text-white">VORTEX AI 0.2</h1>
            <p className="text-sm text-zinc-400">Your AI Fitness Coach</p>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <VortexChat mode="fullPage" />
      </div>
    </div>
  );
}
