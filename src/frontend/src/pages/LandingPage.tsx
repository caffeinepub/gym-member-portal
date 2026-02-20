import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Users, TrendingUp, Zap, Target, Award } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate({ to: '/client-dashboard' });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden border-b-4 border-primary"
        style={{
          backgroundImage: 'url(/assets/generated/hero-gym.dim_1920x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="container relative py-32 md:py-48">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 text-6xl font-black tracking-tighter text-primary drop-shadow-[0_0_30px_rgba(204,255,0,0.5)] sm:text-7xl md:text-8xl">
              IRON TEMPLE
            </h1>
            <p className="mb-4 text-3xl font-extrabold uppercase tracking-wide text-secondary drop-shadow-[0_0_20px_rgba(0,212,255,0.5)] md:text-4xl">
              Where Legends Are Forged
            </p>
            <p className="mb-12 text-xl font-bold text-foreground/90 md:text-2xl">
              Track your gains. Share your PRs. Dominate the grind.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-3 border-2 border-primary bg-primary px-12 py-8 text-2xl font-black uppercase tracking-wider shadow-neon-volt-lg transition-all hover:scale-105 hover:shadow-neon-volt-lg"
            >
              <Zap className="h-8 w-8" />
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-2 border-primary/20 bg-card/50 py-24 md:py-32">
        <div className="container">
          <h2 className="mb-16 text-center text-5xl font-black uppercase tracking-tighter text-primary">
            Unleash Your Potential
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 border-primary/30 bg-card transition-all hover:border-primary hover:shadow-neon-volt">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">Personalized Tracking</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Custom workout splits and macro goals calculated from your metrics. Science-backed gains.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/30 bg-card transition-all hover:border-secondary hover:shadow-neon-blue">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/20">
                  <Users className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">The Flex Wall</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Share progress pics, post PRs, and get motivated by the community. Show the world your grind.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-card transition-all hover:border-primary hover:shadow-neon-volt">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">Progress Analytics</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Visualize your strength gains and body weight changes. Data-driven domination.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/30 bg-card transition-all hover:border-secondary hover:shadow-neon-blue">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/20">
                  <Dumbbell className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">Workout Logs</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Track every rep, every set, every session. Your complete training history at your fingertips.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-card transition-all hover:border-primary hover:shadow-neon-volt">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">Supplement Stack</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Build your perfect stack. Categorized by goals: Bulking, Cutting, Endurance. Fuel your fire.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/30 bg-card transition-all hover:border-secondary hover:shadow-neon-blue">
              <CardContent className="pt-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/20">
                  <Zap className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase">VORTEX AI</h3>
                <p className="text-lg font-semibold text-muted-foreground">
                  Your AI training partner. Get instant advice, form tips, and motivation 24/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background to-card py-24 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-black uppercase tracking-tighter text-primary">
              No Excuses. No Limits.
            </h2>
            <p className="mb-12 text-2xl font-bold text-foreground/90">
              Join the Iron Temple. Start crushing your goals today.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-3 border-2 border-primary bg-primary px-12 py-8 text-2xl font-black uppercase tracking-wider shadow-neon-volt-lg transition-all hover:scale-105"
            >
              <Dumbbell className="h-8 w-8" />
              Enter The Temple
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
