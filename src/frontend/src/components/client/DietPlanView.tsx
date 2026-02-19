import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Utensils, Flame, Info } from 'lucide-react';
import { useGetDietPlanForClient, useGetDietPlanTemplate } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import type { DietOption } from '../../backend';

interface DietPlanViewProps {
  userId: Principal;
}

export default function DietPlanView({ userId }: DietPlanViewProps) {
  const { data: dietPlan, isLoading: planLoading } = useGetDietPlanForClient(userId);
  const { data: template = [], isLoading: templateLoading } = useGetDietPlanTemplate();

  const isLoading = planLoading || templateLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading diet plan...</p>
        </CardContent>
      </Card>
    );
  }

  // If there's a custom diet plan, show it
  if (dietPlan) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{dietPlan.name}</CardTitle>
            {dietPlan.dietaryNotes && <CardDescription>{dietPlan.dietaryNotes}</CardDescription>}
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {dietPlan.meals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{meal.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {meal.time}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {meal.foodItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.portion}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Flame className="h-3 w-3" />
                          {Number(item.calories)} cal
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{Number(meal.totalCalories)}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{meal.protein.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{meal.carbs.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{meal.fats.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Fats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show template diet plan if no custom plan exists
  if (template.length > 0) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <CardTitle>Recommended Diet Plan</CardTitle>
                <CardDescription>
                  This is a general nutrition guide. Contact your trainer for a personalized plan.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {template.map((mealOption) => (
            <Card key={mealOption.mealType}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{mealOption.mealType}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mealOption.options.map((option: DietOption, optionIdx: number) => (
                  <div key={optionIdx} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Option {optionIdx + 1}</Badge>
                      <p className="text-sm font-medium text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      {option.foodItems.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between py-1.5">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.portion}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Flame className="h-3 w-3" />
                              {Number(item.calories)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              P: {item.protein.toFixed(0)}g
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              C: {item.carbs.toFixed(0)}g
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              F: {item.fats.toFixed(0)}g
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {optionIdx < mealOption.options.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="py-8">
        <p className="text-center text-muted-foreground">
          No diet plan available. Contact your trainer to get a personalized nutrition plan!
        </p>
      </CardContent>
    </Card>
  );
}
