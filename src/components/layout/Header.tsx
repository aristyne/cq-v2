'use client';

import { Star, Terminal } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

type HeaderProps = {
  xp: number;
  className?: string;
};

const ranks = [
    { name: 'Beginner', minXp: 0 },
    { name: 'Apprentice', minXp: 150 },
    { name: 'Adept', minXp: 400 },
    { name: 'Expert', minXp: 800 },
    { name: 'Master', minXp: 1500 },
];

export default function Header({ xp, className }: HeaderProps) {
    const currentRank = ranks.slice().reverse().find(rank => xp >= rank.minXp) || ranks[0];
    const nextRankIndex = ranks.findIndex(rank => rank.name === currentRank.name) + 1;
    const nextRank = nextRankIndex < ranks.length ? ranks[nextRankIndex] : null;

    let progress = 0;
    if (nextRank) {
        const rankXpRange = nextRank.minXp - currentRank.minXp;
        const xpIntoRank = xp - currentRank.minXp;
        progress = (xpIntoRank / rankXpRange) * 100;
    } else {
        progress = 100;
    }

  return (
    <header className={cn("h-20 w-full shrink-0 border-b-2", className)}>
      <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center gap-12 px-4">
        <div>
            <div className="mb-1 flex justify-between">
                <span className="text-sm font-bold text-primary">{currentRank.name}</span>
                {nextRank && <span className="text-sm font-bold text-muted-foreground">Next: {nextRank.minXp} XP</span>}
            </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <div className="text-center">
          <h1 className="inline-flex items-center gap-3 text-2xl font-bold text-foreground">
            <div className="rounded-lg border-2 border-primary p-1">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            CodeQuest
          </h1>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-yellow-400">
          <Star className="h-6 w-6 fill-current" />
          <span className="text-lg font-bold">{xp}</span>
        </div>
      </div>
    </header>
  );
}
