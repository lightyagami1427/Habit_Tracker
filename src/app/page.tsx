"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flame, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Target, title: "Track Any Habit", desc: "Daily, weekly, or custom schedules" },
  { icon: Flame, title: "Build Streaks", desc: "Stay motivated with streak tracking" },
  { icon: BarChart3, title: "See Progress", desc: "Visual stats and completion rates" },
  { icon: CheckCircle2, title: "Stay Consistent", desc: "Log progress with a single tap" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
            <Flame className="w-4 h-4 text-background" />
          </div>
          <span className="font-semibold text-lg tracking-tight">HabitFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started <ArrowRight className="ml-1 w-4 h-4" /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground mb-8 border border-border/50">
            <Flame className="w-3.5 h-3.5" />
            Build better habits, one day at a time
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Track habits.
            <br />
            <span className="text-muted-foreground">Build consistency.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            A clean, minimal habit tracker that helps you stay on top of your goals.
            Create custom plans, track daily progress, and watch your streaks grow.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="shadow-lg shadow-primary/10">
                Start Tracking <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Log In</Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-24 max-w-4xl w-full"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-6 text-center text-sm text-muted-foreground">
        © 2026 HabitFlow. Built for focus.
      </footer>
    </div>
  );
}
