import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Zap } from 'lucide-react';

type FitnessGoal = 'bulking' | 'cutting' | 'maintenance' | 'endurance';

interface MacroResults {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  trainingSplit: string;
}

export default function PersonalizedTracker() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState<FitnessGoal>('maintenance');
  const [results, setResults] = useState<MacroResults | null>(null);

  const calculateMacros = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (!weightNum || !heightNum || !ageNum) {
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation (assuming male for simplicity)
    const bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;

    // Calculate TDEE (assuming moderate activity level)
    let tdee = bmr * 1.55;

    // Adjust based on goal
    let calories = tdee;
    let trainingSplit = '';

    switch (goal) {
      case 'bulking':
        calories = tdee + 500;
        trainingSplit = 'Push / Pull / Legs (6 days/week)';
        break;
      case 'cutting':
        calories = tdee - 500;
        trainingSplit = 'Full Body Circuits (4 days/week)';
        break;
      case 'endurance':
        calories = tdee + 200;
        trainingSplit = 'Upper / Lower + Cardio (5 days/week)';
        break;
      default:
        calories = tdee;
        trainingSplit = 'Upper / Lower Split (4 days/week)';
    }

    // Calculate macros
    const protein = weightNum * 2.2; // 1g per lb bodyweight
    const fats = (calories * 0.25) / 9; // 25% of calories from fats
    const carbs = (calories - protein * 4 - fats * 9) / 4; // Remaining calories from carbs

    setResults({
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      trainingSplit,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-2 border-primary/30 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <Target className="h-6 w-6 text-primary" />
            Physical Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="font-extrabold uppercase">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border-2 border-primary/30 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="font-extrabold uppercase">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="180"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border-2 border-primary/30 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="font-extrabold uppercase">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border-2 border-primary/30 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="font-extrabold uppercase">
              Fitness Goal
            </Label>
            <Select value={goal} onValueChange={(value) => setGoal(value as FitnessGoal)}>
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulking">Bulking (Muscle Gain)</SelectItem>
                <SelectItem value="cutting">Cutting (Fat Loss)</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateMacros}
            className="w-full gap-2 border-2 border-primary font-black uppercase shadow-neon-volt transition-all hover:scale-105"
          >
            <Zap className="h-5 w-5" />
            Calculate My Plan
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-secondary/30 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <Zap className="h-6 w-6 text-secondary" />
            Your Personalized Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-black uppercase text-primary">Training Split</h3>
                <p className="text-lg font-bold text-foreground">{results.trainingSplit}</p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-black uppercase text-secondary">Nutritional Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-muted-foreground">Daily Calories</span>
                    <span className="text-2xl font-black text-primary">{results.calories}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-secondary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-muted-foreground">Protein</span>
                    <span className="text-2xl font-black text-secondary">{results.protein}g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-muted-foreground">Carbs</span>
                    <span className="text-2xl font-black text-primary">{results.carbs}g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-secondary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-muted-foreground">Fats</span>
                    <span className="text-2xl font-black text-secondary">{results.fats}g</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
                <p className="text-center text-sm font-bold text-foreground">
                  💪 These calculations are based on your metrics and selected goal. Adjust as needed based on your
                  progress!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-12">
              <p className="text-center text-lg font-semibold text-muted-foreground">
                Enter your metrics and calculate to see your personalized training and nutrition plan!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
