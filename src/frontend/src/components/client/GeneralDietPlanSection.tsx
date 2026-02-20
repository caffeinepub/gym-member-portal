import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils } from 'lucide-react';

interface MealPeriod {
  time: string;
  option1: string;
  option2: string;
}

const mealPlan: MealPeriod[] = [
  {
    time: 'Breakfast',
    option1: '3 Boiled Eggs + Brown Bread / Roti',
    option2: 'Oats with Milk + 1 Banana',
  },
  {
    time: 'Mid-Morning',
    option1: '1 bowl Roasted Chana (Sasta & High Protein)',
    option2: 'Handful of Peanuts + 1 Apple',
  },
  {
    time: 'Lunch',
    option1: 'Dal + Rice + Curd (Dahi) + Salad',
    option2: 'Soya Chunks Curry + 2 Roti + Salad',
  },
  {
    time: 'Pre-Workout',
    option1: '1 Banana + Black Coffee (for energy)',
    option2: '1 Sweet Potato (Shakarkandi)',
  },
  {
    time: 'Post-Workout',
    option1: '4 Egg Whites or Paneer (50g)',
    option2: 'Sattu Drink (3-4 spoons in water/milk)',
  },
  {
    time: 'Dinner',
    option1: 'Paneer Bhurji / Chicken + 2 Roti',
    option2: 'Moong Dal Khichdi + Omelette',
  },
];

export default function GeneralDietPlanSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            General Diet Plan
          </CardTitle>
          <CardDescription>
            Complete daily meal plan with two options for each meal period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mealPlan.map((meal, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{meal.time}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Meal {index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          Option 1
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{meal.option1}</p>
                    </div>
                    <div className="rounded-lg border-2 border-secondary/20 bg-secondary/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Option 2
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{meal.option2}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
