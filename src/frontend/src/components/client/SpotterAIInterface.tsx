import React, { useState } from 'react';
import { Eye, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllFormAnalysisTips } from '../../hooks/useQueries';

// Utility function to convert YouTube URLs to embed format
function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Standard YouTube watch URL
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Shortened youtu.be URL
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  
  return url;
}

export default function SpotterAIInterface() {
  const { data: formTips = [], isLoading } = useGetAllFormAnalysisTips();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedTip = formTips.find(
    (tip) => tip.exerciseId.toString() === selectedExerciseId
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-volt-green border-t-transparent"></div>
          <p className="text-zinc-400">Loading form analysis tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-volt-green to-electric-blue">
          <Eye className="h-6 w-6 text-zinc-950" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Spotter AI</h2>
          <p className="text-sm text-zinc-400">
            AI-powered form analysis and correction tips
          </p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Select Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger className="h-12 border-zinc-800 bg-zinc-950 text-white">
              <SelectValue placeholder="Choose an exercise for form tips" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-950 text-white">
              {formTips.map((tip) => (
                <SelectItem
                  key={tip.exerciseId.toString()}
                  value={tip.exerciseId.toString()}
                  className="focus:bg-zinc-800 focus:text-white"
                >
                  Exercise #{tip.exerciseId.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTip && (
        <div className="space-y-6">
          {/* Video Demonstration */}
          {selectedTip.videoUrl && (
            <Card className="overflow-hidden border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Play className="h-5 w-5 text-volt-green" />
                  Video Demonstration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video w-full bg-zinc-950">
                  <iframe
                    src={convertToEmbedUrl(selectedTip.videoUrl)}
                    className="absolute inset-0 h-full w-full"
                    title="Exercise demonstration"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Checkpoints */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle className="h-5 w-5 text-volt-green" />
                Form Checkpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedTip.formCheckpoints.map((checkpoint, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Badge className="mt-1 bg-volt-green text-zinc-950">
                      {idx + 1}
                    </Badge>
                    <span className="text-zinc-300">{checkpoint}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Common Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedTip.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Badge
                      variant="outline"
                      className="mt-1 border-red-500 text-red-500"
                    >
                      {idx + 1}
                    </Badge>
                    <span className="text-zinc-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Correction Steps */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5 text-electric-blue" />
                Correction Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedTip.correctionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Badge className="mt-1 bg-electric-blue text-zinc-950">
                      {idx + 1}
                    </Badge>
                    <span className="text-zinc-300">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedTip && formTips.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-zinc-500">
              Select an exercise to view form analysis tips
            </p>
          </CardContent>
        </Card>
      )}

      {formTips.length === 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-zinc-500">No form analysis tips available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
