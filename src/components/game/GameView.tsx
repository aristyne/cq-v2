import Image from "next/image";
import React from 'react';
import type { Level } from "@/lib/levels";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type GameViewProps = {
  level: Level;
  levels: Level[];
  highestLevelUnlocked: number;
  onSelectLevel: (levelId: number) => void;
};

export default function GameView({
  level,
  levels,
  highestLevelUnlocked,
  onSelectLevel,
}: GameViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">
            Level {level.id}: {level.title}
          </CardTitle>
          <CardDescription>{level.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 font-headline">World Map</h3>
            <div className="bg-card-foreground/5 p-4 rounded-lg">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max items-center gap-4 pb-4">
                  {levels.map((mapLevel, index) => {
                    const isUnlocked = mapLevel.id <= highestLevelUnlocked;
                    const isCurrent = mapLevel.id === level.id;
                    return (
                      <React.Fragment key={mapLevel.id}>
                        <div className="flex flex-col items-center gap-2 w-28">
                          <button
                            onClick={() => isUnlocked && onSelectLevel(mapLevel.id)}
                            disabled={!isUnlocked}
                            className={cn(
                              "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all border-4",
                              isCurrent 
                                ? "bg-primary text-primary-foreground border-primary-foreground/50 scale-110 shadow-lg" 
                                : "bg-card border-border",
                              isUnlocked 
                                ? "cursor-pointer hover:bg-accent hover:border-accent-foreground" 
                                : "cursor-not-allowed bg-muted text-muted-foreground border-muted-foreground/20",
                            )}
                            aria-label={`Level ${mapLevel.id}: ${mapLevel.title}`}
                          >
                            {isUnlocked ? mapLevel.id : <Lock className="h-6 w-6 shrink-0" />}
                          </button>
                          <p className={cn(
                            "text-xs font-semibold truncate w-full text-center",
                            isUnlocked ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {mapLevel.title}
                          </p>
                        </div>
                        {index < levels.length - 1 && (
                          <div className="w-16 h-1 bg-border rounded-full -translate-y-3" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={level.image.imageUrl}
              alt={level.image.description}
              fill
              className="object-cover"
              data-ai-hint={level.image.imageHint}
            />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Your Challenge:</h3>
            <p className="rounded-md bg-muted p-4 font-code text-muted-foreground">
              {level.challenge}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <p className="text-sm text-muted-foreground italic">Your journey is laid out before you. Choose your path wisely.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
