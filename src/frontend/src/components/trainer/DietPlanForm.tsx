import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Utensils } from 'lucide-react';
import { useCreateDietPlan } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import type { Meal } from '../../backend';

interface DietPlanFormProps {
  trainerId: Principal;
  clientId: Principal;
  onSuccess?: () => void;
}

interface FoodItemForm {
  name: string;
  portion: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

interface MealForm {
  name: string;
  time: string;
  foodItems: FoodItemForm[];
}

export default function DietPlanForm({ trainerId, clientId, onSuccess }: DietPlanFormProps) {
  const [planName, setPlanName] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [meals, setMeals] = useState<MealForm[]>([
    { name: 'Breakfast', time: '08:00', foodItems: [{ name: '', portion: '', calories: '', protein: '', carbs: '', fats: '' }] },
  ]);

  const createDietPlan = useCreateDietPlan();

  const addMeal = () => {
    setMeals([
      ...meals,
      { name: '', time: '', foodItems: [{ name: '', portion: '', calories: '', protein: '', carbs: '', fats: '' }] },
    ]);
  };

  const removeMeal = (mealIndex: number) => {
    setMeals(meals.filter((_, idx) => idx !== mealIndex));
  };

  const addFoodItem = (mealIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foodItems.push({ name: '', portion: '', calories: '', protein: '', carbs: '', fats: '' });
    setMeals(newMeals);
  };

  const removeFoodItem = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foodItems = newMeals[mealIndex].foodItems.filter((_, idx) => idx !== foodIndex);
    setMeals(newMeals);
  };

  const updateMeal = (mealIndex: number, field: keyof MealForm, value: string) => {
    const newMeals = [...meals];
    (newMeals[mealIndex] as any)[field] = value;
    setMeals(newMeals);
  };

  const updateFoodItem = (mealIndex: number, foodIndex: number, field: keyof FoodItemForm, value: string) => {
    const newMeals = [...meals];
    (newMeals[mealIndex].foodItems[foodIndex] as any)[field] = value;
    setMeals(newMeals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }

    try {
      const formattedMeals: Meal[] = meals.map((meal, idx) => {
        const foodItems = meal.foodItems.map((item) => ({
          name: item.name,
          portion: item.portion,
          calories: BigInt(parseInt(item.calories) || 0),
          protein: parseFloat(item.protein) || 0,
          carbs: parseFloat(item.carbs) || 0,
          fats: parseFloat(item.fats) || 0,
        }));

        const totalCalories = foodItems.reduce((sum, item) => sum + Number(item.calories), 0);
        const totalProtein = foodItems.reduce((sum, item) => sum + item.protein, 0);
        const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs, 0);
        const totalFats = foodItems.reduce((sum, item) => sum + item.fats, 0);

        return {
          id: `meal-${idx}`,
          name: meal.name,
          time: meal.time,
          foodItems,
          totalCalories: BigInt(totalCalories),
          protein: totalProtein,
          carbs: totalCarbs,
          fats: totalFats,
        };
      });

      const dietPlanId = `diet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await createDietPlan.mutateAsync({
        id: dietPlanId,
        trainerId,
        clientId,
        name: planName,
        meals: formattedMeals,
        dietaryNotes,
      });

      toast.success('Diet plan created successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating diet plan:', error);
      toast.error('Failed to create diet plan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diet Plan Details</CardTitle>
          <CardDescription>Create a comprehensive nutrition plan for your client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              placeholder="e.g., Muscle Building Diet"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryNotes">Dietary Notes & Guidelines</Label>
            <Textarea
              id="dietaryNotes"
              placeholder="Add any dietary guidelines, restrictions, or general notes..."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {meals.map((meal, mealIndex) => (
          <Card key={mealIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Meal {mealIndex + 1}</CardTitle>
                </div>
                {meals.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMeal(mealIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meal Name</Label>
                  <Input
                    placeholder="e.g., Breakfast"
                    value={meal.name}
                    onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={meal.time}
                    onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Food Items</Label>
                {meal.foodItems.map((item, foodIndex) => (
                  <div key={foodIndex} className="space-y-3 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Item {foodIndex + 1}</span>
                      {meal.foodItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFoodItem(mealIndex, foodIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        placeholder="Food name"
                        value={item.name}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'name', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Portion (e.g., 100g)"
                        value={item.portion}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'portion', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                      <Input
                        type="number"
                        placeholder="Calories"
                        value={item.calories}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'calories', e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Protein (g)"
                        value={item.protein}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'protein', e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Carbs (g)"
                        value={item.carbs}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'carbs', e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Fats (g)"
                        value={item.fats}
                        onChange={(e) => updateFoodItem(mealIndex, foodIndex, 'fats', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addFoodItem(mealIndex)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Food Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addMeal} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Meal
      </Button>

      <Button type="submit" className="w-full" disabled={createDietPlan.isPending}>
        {createDietPlan.isPending ? 'Creating...' : 'Create Diet Plan'}
      </Button>
    </form>
  );
}
