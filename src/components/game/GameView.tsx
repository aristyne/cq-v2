import React from 'react';
import type { Level } from "@/lib/levels";
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

type GameViewProps = {
  level: Level;
};

export default function GameView({
  level,
}: GameViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground font-headline md:text-3xl">{level.title}</h1>
        
        <div className="space-y-2">
            <h2 className="text-xl font-bold">Challenge:</h2>
            <div className="rounded-xl border-2 bg-card p-4 font-code text-base text-card-foreground">
                <p>{level.challenge}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
             <Badge variant={level.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} className="px-3 py-1 text-sm">
                {level.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current"/>
                <span className="font-bold text-base text-foreground">{level.xp} XP</span>
            </div>
        </div>
    </div>
  );
}
