import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate({ to: '/client-dashboard' });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-fitness.dim_1200x400.png)' }}
        />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Transform Your Fitness Journey
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Connect with expert trainers, track your progress in real-time, and achieve your fitness goals with
              personalized workout plans.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg">
              <Dumbbell className="h-5 w-5" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Everything You Need to Succeed</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Expert Trainers</h3>
                <p className="text-muted-foreground">
                  Work with certified trainers who create personalized workout plans tailored to your goals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your performance with detailed analytics and see your improvements over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Custom Workouts</h3>
                <p className="text-muted-foreground">
                  Get workout plans designed specifically for you, updated in real-time by your trainer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">VORTEX AI</h3>
                <p className="text-muted-foreground">
                  Get instant fitness advice and workout recommendations from our intelligent AI assistant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Ready to Start?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of members achieving their fitness goals with personalized training and support.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
