import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Info, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
type FitnessGoal = 'weight_loss' | 'maintenance' | 'muscle_gain';

interface TDEEResults {
  tdee: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function TDEECalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('maintenance');
  const [results, setResults] = useState<TDEEResults | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const calculateTDEE = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (!weightNum || !heightNum || !ageNum) {
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    let tdee = bmr * activityMultipliers[activityLevel];

    // Adjust for fitness goal
    let adjustedCalories = tdee;
    let proteinPercent = 0.3;
    let carbsPercent = 0.4;
    let fatsPercent = 0.3;

    switch (fitnessGoal) {
      case 'weight_loss':
        adjustedCalories = tdee - 500;
        proteinPercent = 0.4;
        carbsPercent = 0.3;
        fatsPercent = 0.3;
        break;
      case 'muscle_gain':
        adjustedCalories = tdee + 300;
        proteinPercent = 0.35;
        carbsPercent = 0.45;
        fatsPercent = 0.2;
        break;
      default:
        adjustedCalories = tdee;
        proteinPercent = 0.3;
        carbsPercent = 0.4;
        fatsPercent = 0.3;
    }

    // Calculate macros in grams
    const protein = (adjustedCalories * proteinPercent) / 4; // 4 calories per gram
    const carbs = (adjustedCalories * carbsPercent) / 4; // 4 calories per gram
    const fats = (adjustedCalories * fatsPercent) / 9; // 9 calories per gram

    setResults({
      tdee: Math.round(adjustedCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-2 border-primary/30 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <Calculator className="h-6 w-6 text-primary" />
            TDEE Calculator
          </CardTitle>
          <CardDescription className="font-semibold">
            Calculate your Total Daily Energy Expenditure and macro targets
          </CardDescription>
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
            <Label htmlFor="gender" className="font-extrabold uppercase">
              Gender
            </Label>
            <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity" className="font-extrabold uppercase">
              Activity Level
            </Label>
            <Select value={activityLevel} onValueChange={(value) => setActivityLevel(value as ActivityLevel)}>
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extremely_active">Extremely Active (athlete, 2x/day)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="font-extrabold uppercase">
              Fitness Goal
            </Label>
            <Select value={fitnessGoal} onValueChange={(value) => setFitnessGoal(value as FitnessGoal)}>
              <SelectTrigger className="border-2 border-primary/30 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateTDEE}
            className="w-full gap-2 border-2 border-primary font-black uppercase shadow-neon-volt transition-all hover:scale-105"
          >
            <Zap className="h-5 w-5" />
            Calculate TDEE
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-secondary/30 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
            <Zap className="h-6 w-6 text-secondary" />
            Your Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
                <p className="mb-1 text-sm font-extrabold uppercase text-muted-foreground">Daily Calories</p>
                <p className="text-4xl font-black text-primary">{results.tdee} kcal</p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-black uppercase text-secondary">Macro Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-foreground">Protein</span>
                    <span className="text-xl font-black text-primary">{results.protein}g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-secondary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-foreground">Carbs</span>
                    <span className="text-xl font-black text-secondary">{results.carbs}g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-background/50 p-3">
                    <span className="font-extrabold uppercase text-foreground">Fats</span>
                    <span className="text-xl font-black text-primary">{results.fats}g</span>
                  </div>
                </div>
              </div>

              <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 font-bold">
                    <Info className="h-4 w-4" />
                    {showExplanation ? 'Hide' : 'Show'} Calculation Details
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-3 rounded-lg border-2 border-muted bg-muted/20 p-4">
                  <div>
                    <h4 className="mb-2 font-extrabold uppercase text-foreground">Formula Used</h4>
                    <p className="text-sm font-semibold text-muted-foreground">
                      <strong>Mifflin-St Jeor Equation:</strong>
                      <br />
                      Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
                      <br />
                      Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-extrabold uppercase text-foreground">Activity Multipliers</h4>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Sedentary: 1.2 | Lightly Active: 1.375 | Moderately Active: 1.55 | Very Active: 1.725 | Extremely Active: 1.9
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-extrabold uppercase text-foreground">Macro Distribution</h4>
                    <p className="text-sm font-semibold text-muted-foreground">
                      <strong>Weight Loss:</strong> 40% Protein, 30% Carbs, 30% Fats
                      <br />
                      <strong>Maintenance:</strong> 30% Protein, 40% Carbs, 30% Fats
                      <br />
                      <strong>Muscle Gain:</strong> 35% Protein, 45% Carbs, 20% Fats
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-center text-lg font-semibold text-muted-foreground">
                Enter your details and click Calculate to see your personalized TDEE and macro targets
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
