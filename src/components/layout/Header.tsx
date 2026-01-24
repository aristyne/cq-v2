import { CodeXml, User, Star, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { Level } from "@/lib/levels";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";

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
    <header className="flex-shrink-0 border-b border-border bg-card px-4 md:px-6">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <CodeXml className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            Code Odyssey
          </h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              className="h-9 w-32 font-medium"
              aria-label="Player name"
            />
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">{xp} XP</span>
          </div>
          <div className="flex w-32 flex-col gap-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tasks Completed</span>
              <span>
                {completedLevels}/{totalLevels}
              </span>
            </div>
            <Progress
              value={(completedLevels / totalLevels) * 100}
              className="h-2"
            />
          </div>
        </div>
      </div>
      <div className="py-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max items-center gap-4 pb-4">
            {levels.map((mapLevel, index) => {
              const isUnlocked = mapLevel.id <= highestLevelUnlocked;
              const isCurrent = mapLevel.id === currentLevel.id;
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
                          : "cursor-not-allowed bg-muted text-muted-foreground border-muted-foreground/20"
                      )}
                      aria-label={`Level ${mapLevel.id}: ${mapLevel.title}`}
                    >
                      {isUnlocked ? (
                        mapLevel.id
                      ) : (
                        <Lock className="h-6 w-6 shrink-0" />
                      )}
                    </button>
                    <p
                      className={cn(
                        "text-xs font-semibold truncate w-full text-center",
                        isUnlocked ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
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
    </header>
  );
}
