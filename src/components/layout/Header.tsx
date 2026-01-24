import { CodeXml, User, Star, Lock, Check, Gem, Home, Trees, Flame, GitMerge, Infinity } from "lucide-react";
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
  const getIconForLevel = (levelId: number) => {
    const iconProps = { className: "h-8 w-8 group-hover:scale-110 transition-transform" };
    switch (levelId) {
      case 1:
        return <Home {...iconProps} />;
      case 2:
        return <Trees {...iconProps} />;
      case 3:
        return <Flame {...iconProps} />;
      case 4:
        return <GitMerge {...iconProps} />;
      case 5:
        return <Infinity {...iconProps} />;
      default:
        return <Gem {...iconProps} />;
    }
  };
  
  const topics = levels.filter(level => level.isFirstInTopic);
  const currentTopicTasks = levels.filter(l => l.topicId === currentLevel.topicId);

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
            <span className="font-medium">{Math.floor(xp / 100) + 1}</span>
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
        <p className="text-center text-xs font-bold tracking-wider text-primary/80 uppercase mb-4">World Map</p>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="mx-auto flex w-max items-start gap-4 px-4 pb-4">
            {topics.map((topic, index) => {
              const isUnlocked = topic.id <= highestLevelUnlocked;
              const topicLevels = levels.filter(l => l.topicId === topic.topicId);
              const completedTasksInTopic = topicLevels.filter(l => l.id < highestLevelUnlocked).length;
              const isCompleted = completedTasksInTopic === topicLevels.length;
              const isCurrent = topic.topicId === currentLevel.topicId;

              return (
                <React.Fragment key={topic.id}>
                  <div className="flex w-28 flex-col items-center gap-2 text-center">
                    <button
                      onClick={() => isUnlocked && onSelectLevel(topic.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "group relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all",
                        !isUnlocked
                          ? "cursor-not-allowed border-muted-foreground/20 bg-muted/50 text-muted-foreground"
                          : [
                              "cursor-pointer",
                              isCurrent
                                ? "scale-105 border-primary shadow-lg shadow-primary/30"
                                : isCompleted
                                ? "border-green-500/50 bg-green-500/10 text-foreground hover:border-green-500"
                                : "border-border bg-card hover:border-primary",
                            ]
                      )}
                      aria-label={`Topic: ${topic.topicTitle}`}
                    >
                      {isUnlocked ? getIconForLevel(topic.topicId) : <Lock className="h-8 w-8"/>}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-4 border-card bg-green-500 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                    <p className={cn(
                      "w-full truncate text-xs font-semibold", 
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {topic.topicTitle}
                    </p>
                     <p className="text-xs text-muted-foreground">{completedTasksInTopic}/{topicLevels.length}</p>
                  </div>
                  {index < topics.length - 1 && (
                    <div className="flex h-20 items-center">
                      <div className="h-px w-12 border-t-2 border-dashed border-border" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-4 border-t border-border pt-4">
            <div className="mb-6 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">{currentLevel.topicTitle}</p>
                <h2 className="font-headline text-2xl font-bold text-foreground">{currentLevel.title}</h2>
                <p className="mx-auto mt-1 max-w-2xl text-sm text-muted-foreground">{currentLevel.description}</p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
                {currentTopicTasks.map((task, index) => {
                    const isTaskUnlocked = task.id <= highestLevelUnlocked;
                    const isTaskCurrent = task.id === currentLevel.id;
                    const isTaskCompleted = task.id < highestLevelUnlocked;

                    return (
                        <React.Fragment key={task.id}>
                           <div className="flex flex-col items-center gap-2">
                             <button onClick={() => isTaskUnlocked && onSelectLevel(task.id)}
                                     disabled={!isTaskUnlocked}
                                     className={cn(
                                        "flex h-12 w-16 items-center justify-center rounded-lg border-2 transition-all",
                                        !isTaskUnlocked && "cursor-not-allowed border-muted-foreground/20 bg-muted/50 text-muted-foreground",
                                        isTaskUnlocked && (
                                            isTaskCurrent ? "scale-110 border-primary shadow-lg" :
                                            isTaskCompleted ? "border-green-500/50 bg-green-500/20 text-foreground hover:border-green-500" :
                                            "border-border bg-card hover:border-primary"
                                        )
                                     )}
                             >
                               {isTaskCompleted ? <Check className="h-6 w-6 text-green-500" /> : <p className="text-lg font-bold">{index + 1}</p>}
                             </button>
                             <p className="w-16 truncate text-center text-xs font-medium">{task.title}</p>
                           </div>
                           {index < currentTopicTasks.length - 1 && (
                               <div className="h-px w-8 bg-border" />
                           )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
      </div>
    </header>
  );
}
