'use client';

import { Flame, Star } from 'lucide-react';

type HeaderProps = {
  streak: number;
  xp: number;
};

export default function Header({ streak, xp }: HeaderProps) {
  return (
    <header className="h-16 w-full shrink-0 border-b-2">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <div className="flex w-24 items-center gap-2 text-orange-500">
          <Flame className="h-7 w-7" />
          <span className="text-lg font-bold">{streak}</span>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-foreground">CodeQuest</h1>
        </div>
        <div className="flex w-24 items-center justify-end gap-2 text-yellow-400">
          <Star className="h-6 w-6 fill-current" />
          <span className="text-lg font-bold">{xp}</span>
        </div>
      </div>
    </header>
  );
}
