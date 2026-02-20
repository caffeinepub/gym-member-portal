import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, Target, Clock, Lightbulb } from 'lucide-react';
import { useGetSupplementStack } from '../../hooks/useQueries';

const GOAL_OPTIONS = [
  { value: 'Muscle Gain', label: 'Muscle Gain', icon: '💪', color: 'primary' },
  { value: 'Fat Loss', label: 'Fat Loss', icon: '🔥', color: 'destructive' },
  { value: 'Strength', label: 'Strength', icon: '⚡', color: 'secondary' },
  { value: 'Endurance', label: 'Endurance', icon: '🏃', color: 'default' },
];

export default function SupplementStackOptimizer() {
  const [selectedGoal, setSelectedGoal] = useState('Muscle Gain');
  const { data: stack, isLoading } = useGetSupplementStack(selectedGoal);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-secondary/30 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-secondary/20 p-3">
              <Pill className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black uppercase tracking-tight">
                SUPPLEMENT STACK OPTIMIZER
              </CardTitle>
              <CardDescription className="text-base font-semibold">
                Curated supplement bundles for your specific goals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Select Your Goal</h3>
            <div className="grid gap-3 md:grid-cols-4">
              {GOAL_OPTIONS.map((goal) => (
                <Card
                  key={goal.value}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedGoal === goal.value
                      ? 'border-2 border-primary bg-primary/10 shadow-lg'
                      : 'border-2 border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedGoal(goal.value)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 text-4xl">{goal.icon}</div>
                    <p className="font-black uppercase text-sm">{goal.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Card className="border-2 border-muted">
              <CardContent className="py-8">
                <p className="text-center font-semibold text-muted-foreground">Loading supplement stack...</p>
              </CardContent>
            </Card>
          ) : stack ? (
            <Tabs defaultValue="products" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products" className="font-bold">
                  Products
                </TabsTrigger>
                <TabsTrigger value="dosage" className="font-bold">
                  Dosage
                </TabsTrigger>
                <TabsTrigger value="timing" className="font-bold">
                  Timing
                </TabsTrigger>
                <TabsTrigger value="benefits" className="font-bold">
                  Benefits
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  {stack.products.map((product, idx) => (
                    <Card key={idx} className="border-2 border-primary/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-black uppercase">{product.name}</CardTitle>
                            <Badge variant="outline" className="mt-2 font-bold">
                              {product.productType}
                            </Badge>
                          </div>
                          <img
                            src="/assets/generated/supplement-bottle.dim_256x256.png"
                            alt="Supplement"
                            className="h-12 w-12 opacity-50"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-semibold text-muted-foreground">{product.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="dosage" className="space-y-3">
                <Card className="border-2 border-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                      <Target className="h-5 w-5 text-secondary" />
                      Recommended Dosages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stack.dosageRecommendations.map((dosage, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg border-2 border-muted p-4">
                          <span className="font-bold text-foreground">{dosage.productName}</span>
                          <Badge className="font-bold">{dosage.recommendedDosage}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timing" className="space-y-3">
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                      <Clock className="h-5 w-5 text-primary" />
                      Timing Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stack.timingGuidelines.map((timing, idx) => (
                        <div key={idx} className="rounded-lg border-2 border-muted p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-bold text-foreground">{timing.productName}</span>
                            <Badge variant="secondary" className="font-bold">
                              {timing.timing}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-muted-foreground">{timing.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-3">
                <Card className="border-2 border-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                      <Lightbulb className="h-5 w-5 text-secondary" />
                      Scientific Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {stack.benefitDescriptions.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20 font-black text-secondary text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-2 border-muted">
              <CardContent className="py-8">
                <p className="text-center font-semibold text-muted-foreground">
                  No supplement stack available for this goal yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
