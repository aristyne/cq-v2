import { CodeXml, User, Star, Lock, Check, Gem } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { Level } from "@/lib/levels";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

type HeaderProps = {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  xp: number;
  completedLevels: number;
  totalLevels: number;
  levels: Level[];
  currentLevel: Level;
  highestLevelUnlocked: number;
  onSelectLevel: (levelId: number) => void;
};

export default function Header({
  playerName,
  onPlayerNameChange,
  xp,
  completedLevels,
  totalLevels,
  levels,
  currentLevel,
  highestLevelUnlocked,
  onSelectLevel,
}: HeaderProps) {
  return (
    <header className="flex-shrink-0 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <CodeXml className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            CodeQuest
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1">
            <span className="font-bold text-primary">Lvl</span>
            <span className="font-medium">{Math.floor(xp / 200) + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-blue-400" />
            <span className="font-medium">140</span>
          </div>
          <div className="flex w-32 flex-col gap-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Quests Completed</span>
              <span>
                {completedLevels}/{totalLevels}
              </span>
            </div>
            <Progress
              value={(completedLevels / totalLevels) * 100}
              className="h-2"
            />
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {playerName.charAt(0).toUpperCase()}
             </div>
            <span className="font-medium">{playerName}</span>
          </div>
        </div>
      </div>
      <div className="bg-background/50 border-t p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max items-start gap-4 pb-4">
            {levels.map((mapLevel, index) => {
              const isUnlocked = mapLevel.id <= highestLevelUnlocked;
              const isCurrent = mapLevel.id === currentLevel.id;
              const isCompleted = mapLevel.id < highestLevelUnlocked;

              return (
                <React.Fragment key={mapLevel.id}>
                  <button
                    onClick={() => isUnlocked && onSelectLevel(mapLevel.id)}
                    disabled={!isUnlocked}
                    className={cn(
                      "flex w-40 flex-col items-start gap-2 rounded-lg border-2 p-3 text-left transition-all",
                      !isUnlocked
                        ? "cursor-not-allowed border-muted-foreground/20 bg-muted/50 text-muted-foreground"
                        : [
                            "cursor-pointer",
                            isCurrent
                              ? "scale-105 border-primary/80 bg-primary/20 shadow-lg"
                              : isCompleted
                              ? "border-completed-foreground/30 bg-completed/80 text-completed-foreground hover:bg-completed"
                              : "border-border bg-card hover:border-accent hover:bg-accent/20",
                          ]
                    )}
                    aria-label={`Level ${mapLevel.id}: ${mapLevel.title}`}
                  >
                    <div className="flex w-full items-center justify-between">
                       <p className={cn("text-sm font-semibold", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                        {mapLevel.title}
                       </p>
                      {isCompleted && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                       {!isUnlocked && (
                          <Lock className="h-4 w-4" />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500/50"/>
                        <span className="text-xs text-muted-foreground">0/5</span>
                    </div>
                  </button>
                  {index < levels.length - 1 && (
                    <div className="h-px w-8 translate-y-8 rounded-full bg-border" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </header>
  );
}
