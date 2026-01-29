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
      <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:gap-8 md:px-6">
        <div className="min-w-0 flex justify-end">
          <div className="w-2/3">
            <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-bold text-primary">{currentRank.name}</span>
                {nextRank && <span className="hidden shrink-0 text-xs font-bold text-muted-foreground sm:inline">Next: {nextRank.minXp} XP</span>}
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <div className="rounded-lg border-2 border-primary p-1">
            <Terminal className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">CodeQuest</h1>
        </div>
        
        <div className="flex items-center justify-end gap-1 text-yellow-400 sm:gap-2">
          <Star className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
          <span className="text-base font-bold sm:text-lg">{xp}</span>
        </div>
      </div>
    </header>
  );
}
