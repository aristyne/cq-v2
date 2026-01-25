import React from 'react';
import type { Level } from "@/lib/levels";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type GameViewProps = {
  level: Level;
};

export default function GameView({
  level,
}: GameViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="relative h-48 w-full md:h-64">
          <Image
            src={level.image.imageUrl}
            alt={level.image.description}
            fill
            className="object-cover"
            data-ai-hint={level.image.imageHint}
            priority={level.id === 1}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h2 className="text-2xl font-bold text-white font-headline md:text-3xl">{level.title}</h2>
            <p className="text-white/90 text-sm mt-1 max-w-prose">{level.description}</p>
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
                <h3 className="text-lg font-semibold text-card-foreground">Guardian's Challenge</h3>
                <p className="text-sm text-muted-foreground">Follow the instructions to complete the task.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
                <Badge variant={level.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} className="px-3 py-1 text-sm">
                    {level.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="h-5 w-5 fill-current"/>
                    <span className="font-bold text-base text-foreground">{level.xp} XP</span>
                </div>
            </div>
          </div>
          
          <div className="rounded-md border border-input bg-background p-4 font-code text-base text-card-foreground">
            <p>{level.challenge}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
