import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Save } from 'lucide-react';
import { useGetTrainingPartnerPreference, useSaveTrainingPartnerPreference } from '../../hooks/useQueries';

const FITNESS_GOALS = ['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'General Fitness', 'Athletic Performance'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const WORKOUT_TIMES = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];

export default function TrainingPartnerPreferenceForm() {
  const { data: currentPreference, isLoading } = useGetTrainingPartnerPreference();
  const savePreference = useSaveTrainingPartnerPreference();

  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [preferredWorkoutTimes, setPreferredWorkoutTimes] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (currentPreference) {
      setFitnessGoals(currentPreference.fitnessGoals);
      setExperienceLevel(currentPreference.experienceLevel);
      setPreferredWorkoutTimes(currentPreference.preferredWorkoutTimes);
      setBio(currentPreference.bio);
    }
  }, [currentPreference]);

  const handleGoalToggle = (goal: string) => {
    setFitnessGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleTimeToggle = (time: string) => {
    setPreferredWorkoutTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePreference.mutateAsync({
        fitnessGoals,
        experienceLevel,
        preferredWorkoutTimes,
        bio,
      });
    } catch (error) {
      console.error('Failed to save training partner preference:', error);
    }
  };

  return (
    <Card className="border-2 border-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
          <Target className="h-5 w-5 text-secondary" />
          Training Partner Preferences
        </CardTitle>
        <CardDescription className="font-semibold">
          Tell others about your fitness goals and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="font-bold uppercase text-sm">Fitness Goals</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {FITNESS_GOALS.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={fitnessGoals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <label
                    htmlFor={`goal-${goal}`}
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {goal}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="font-bold uppercase text-sm">
              Experience Level
            </Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="border-2 font-semibold">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="font-bold uppercase text-sm">Preferred Workout Times</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {WORKOUT_TIMES.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={`time-${time}`}
                    checked={preferredWorkoutTimes.includes(time)}
                    onCheckedChange={() => handleTimeToggle(time)}
                  />
                  <label
                    htmlFor={`time-${time}`}
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="font-bold uppercase text-sm">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential training partners about yourself, your workout style, and what you're looking for..."
              rows={4}
              className="resize-none border-2 font-semibold"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold"
            disabled={savePreference.isPending || isLoading || !experienceLevel || fitnessGoals.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            {savePreference.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
