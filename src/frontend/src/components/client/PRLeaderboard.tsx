import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Plus, TrendingUp } from 'lucide-react';
import { useGetPRLeaderboard, useSubmitPersonalRecord } from '../../hooks/useQueries';
import { PrType } from '../../backend';
import { toast } from 'sonner';

const PR_TYPES = [
  { value: PrType.squat, label: 'Squat' },
  { value: PrType.benchPress, label: 'Bench Press' },
  { value: PrType.deadlift, label: 'Deadlift' },
  { value: PrType.shoulderPress, label: 'Shoulder Press' },
  { value: PrType.barbellRow, label: 'Barbell Row' },
];

export default function PRLeaderboard() {
  const [selectedPrType, setSelectedPrType] = useState<PrType>(PrType.squat);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const { data: leaderboard, isLoading } = useGetPRLeaderboard(selectedPrType);
  const submitPrMutation = useSubmitPersonalRecord();

  const selectedExercise = PR_TYPES.find((type) => type.value === selectedPrType);

  const handleSubmitPR = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !reps || !selectedExercise) {
      toast.error('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      toast.error('Please enter valid reps');
      return;
    }

    try {
      await submitPrMutation.mutateAsync({
        prType: selectedPrType,
        weight: weightNum,
        reps: BigInt(repsNum),
      });

      toast.success('PR submitted successfully! 💪');
      setWeight('');
      setReps('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting PR:', error);
      toast.error('Failed to submit PR. Please try again.');
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-lg font-black text-muted-foreground">#{rank}</span>;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black uppercase">PR Leaderboard</CardTitle>
                <CardDescription className="text-base font-semibold">
                  Compete with the community. Track your personal records.
                </CardDescription>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit PR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Log Your PR</DialogTitle>
                  <DialogDescription className="font-semibold">
                    Submit your personal record for {selectedExercise?.label}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPR} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise" className="font-bold">
                      Exercise
                    </Label>
                    <Select value={selectedPrType} onValueChange={(value) => setSelectedPrType(value as PrType)}>
                      <SelectTrigger id="exercise" className="font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PR_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="font-semibold">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="font-bold">
                      Weight (lbs)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.5"
                      placeholder="Enter weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps" className="font-bold">
                      Reps
                    </Label>
                    <Input
                      id="reps"
                      type="number"
                      placeholder="Enter reps"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="font-semibold"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold" disabled={submitPrMutation.isPending}>
                    {submitPrMutation.isPending ? 'Submitting...' : 'Submit PR'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="font-bold text-base">Exercise:</Label>
            <Select value={selectedPrType} onValueChange={(value) => setSelectedPrType(value as PrType)}>
              <SelectTrigger className="w-[200px] font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PR_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="font-semibold">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="border-2 border-primary/30">
          <CardContent className="py-12">
            <p className="text-center text-lg font-semibold text-muted-foreground">Loading leaderboard...</p>
          </CardContent>
        </Card>
      ) : !leaderboard || leaderboard.entries.length === 0 ? (
        <Card className="border-2 border-primary/30">
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No PRs logged yet</p>
              <p className="text-sm text-muted-foreground">Be the first to set a record!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-primary/30">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20">
                  <TableHead className="font-black uppercase">Rank</TableHead>
                  <TableHead className="font-black uppercase">Athlete</TableHead>
                  <TableHead className="font-black uppercase">Weight</TableHead>
                  <TableHead className="font-black uppercase">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.entries.map((entry) => (
                  <TableRow
                    key={entry.userId.toString()}
                    className={`border-primary/10 ${
                      Number(entry.ranking) <= 3 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">{getRankIcon(Number(entry.ranking))}</div>
                    </TableCell>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {entry.name}
                        {Number(entry.ranking) === 1 && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold">
                            Champion
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-primary text-lg">
                      {entry.weight.toFixed(1)} lbs
                    </TableCell>
                    <TableCell className="font-semibold text-muted-foreground">
                      {formatDate(entry.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
