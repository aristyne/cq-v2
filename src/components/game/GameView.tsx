import React from 'react';
import type { Level } from "@/lib/levels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '../ui/badge';
import { Bot } from 'lucide-react';

type GameViewProps = {
  level: Level;
};

export default function GameView({
  level,
}: GameViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="font-bold text-primary">{level.topicTitle}</p>
        <h1 className="font-headline text-3xl font-bold text-foreground">
          {level.title}
        </h1>
        <p className="text-muted-foreground">{level.description}</p>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-card p-6">
        <Bot className="h-10 w-10 shrink-0 text-primary mt-1" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground">Guardian's Challenge</h3>
          <p className="rounded-md bg-background p-4 font-code text-muted-foreground">
            {level.challenge}
          </p>
        </div>
      </div>
    </div>
  );
}
