'use client';

import { Flame } from 'lucide-react';

type HeaderProps = {};

export default function Header({}: HeaderProps) {
  return (
    <header className="h-16 w-full shrink-0 border-b-2">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4 sm:gap-6 text-muted-foreground">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="h-7 w-7" />
            <span className="text-lg font-bold">0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
