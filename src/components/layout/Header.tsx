'use client';

import { useState } from 'react';
import {
  CodeXml,
  User,
  Star,
  Lock,
  Check,
  Gem,
  Home,
  Trees,
  TowerControl,
  GitMerge,
  Map,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import type { Level } from '@/lib/levels';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';
import { Badge } from '@/components/ui/badge';

type HeaderProps = {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  xp: number;
  gems: number;
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
  gems,
  completedLevels,
  totalLevels,
  levels,
  currentLevel,
  highestLevelUnlocked,
  onSelectLevel,
}: HeaderProps) {
  const [isMapOpen, setIsMapOpen] = useState(true);

  const getIconForTopic = (topicId: number) => {
    const iconProps = {
      className: 'h-8 w-8 text-white',
    };
    switch (topicId) {
      case 1:
        return <Home {...iconProps} />;
      case 2:
        return <Trees {...iconProps} />;
      case 3:
        return <Gem {...iconProps} />;
      case 4:
        return <GitMerge {...iconProps} />;
      case 5:
        return <TowerControl {...iconProps} />;
      default:
        return <CodeXml {...iconProps} />;
    }
  };

  const topics = levels.filter((level) => level.isFirstInTopic);
  const currentTopicTasks = levels.filter(
    (l) => l.topicId === currentLevel.topicId
  );

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
            <span className="font-medium">{gems}</span>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {playerName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{playerName}</span>
          </div>
        </div>
      </div>
      <div className="border-t">
        <button
          onClick={() => setIsMapOpen(!isMapOpen)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors bg-map-bg text-white hover:bg-map-bg/90"
          aria-expanded={isMapOpen}
        >
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              World Map
            </p>
          </div>
          {isMapOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {isMapOpen && (
          <div className="border-t border-map-path/20 map-pattern">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="mx-auto flex w-max items-center justify-center gap-x-2 p-6 sm:w-full sm:gap-x-4">
                {topics.map((topic, index) => {
                  const isUnlocked = topic.id <= highestLevelUnlocked;
                  const topicLevels = levels.filter(
                    (l) => l.topicId === topic.topicId
                  );
                  const completedTasksInTopic = topicLevels.filter(
                    (l) => l.id < highestLevelUnlocked
                  ).length;
                  const isCompleted =
                    completedTasksInTopic === topicLevels.length;
                  const isCurrent =
                    !isCompleted && topic.topicId === currentLevel.topicId;
                  const isEven = index % 2 === 0;

                  return (
                    <React.Fragment key={topic.id}>
                      <div
                        className={cn(
                          'flex flex-col items-center gap-2 text-center w-24',
                          isEven ? 'sm:pt-10' : 'sm:pb-10'
                        )}
                      >
                        <button
                          onClick={() =>
                            isUnlocked && onSelectLevel(topic.id)
                          }
                          disabled={!isUnlocked}
                          className={cn(
                            'group relative flex h-16 w-16 items-center justify-center rounded-xl transition-all',
                            !isUnlocked
                              ? 'cursor-not-allowed bg-map-node-locked'
                              : [
                                  'cursor-pointer',
                                  isCurrent
                                    ? 'bg-map-node-current shadow-lg shadow-map-node-current/30'
                                    : 'bg-map-node-completed',
                                ]
                          )}
                          aria-label={`Topic: ${topic.topicTitle}`}
                        >
                          {!isUnlocked ? (
                            <HelpCircle className="h-7 w-7 text-white/70" />
                          ) : isCompleted ? (
                            <Star className="h-7 w-7 fill-white text-white" />
                          ) : isCurrent ? (
                            <>
                              {getIconForTopic(topic.topicId)}
                              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-white" />
                            </>
                          ) : (
                            getIconForTopic(topic.topicId)
                          )}
                        </button>
                        <p
                          className={cn(
                            'text-xs font-semibold h-8 flex items-center justify-center',
                            isUnlocked ? 'text-white/90' : 'text-white/40'
                          )}
                        >
                          {topic.topicTitle}
                        </p>
                      </div>
                      {index < topics.length - 1 && (
                        <svg
                          className="hidden h-12 w-8 flex-shrink-0 sm:block"
                          viewBox="0 0 32 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={isEven ? "M2 34 C 16 14, 16 14, 30 14" : "M2 14 C 16 34, 16 34, 30 34"}
                            stroke="hsl(var(--map-path))"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <div className="border-t border-border bg-card px-4 pt-2 pb-3 text-foreground">
              <div className="flex items-center justify-between gap-8">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {currentLevel.topicTitle}
                  </p>
                  <h2 className="truncate font-headline text-lg font-bold">
                    {currentLevel.title}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {currentLevel.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center">
                  {currentTopicTasks.map((task, index) => {
                    const isTaskUnlocked = task.id <= highestLevelUnlocked;
                    const isTaskCurrent = task.id === currentLevel.id;
                    const isTaskCompleted = task.id < highestLevelUnlocked;

                    return (
                      <React.Fragment key={task.id}>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() =>
                              isTaskUnlocked && onSelectLevel(task.id)
                            }
                            disabled={!isTaskUnlocked}
                            title={task.title}
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                              !isTaskUnlocked &&
                                'cursor-not-allowed border-muted-foreground/20 bg-muted/50 text-muted-foreground',
                              isTaskUnlocked &&
                                (isTaskCurrent
                                  ? 'scale-105 border-primary shadow-md'
                                  : isTaskCompleted
                                  ? 'border-green-500/50 bg-green-500/20 text-foreground hover:border-green-500'
                                  : 'border-border bg-card hover:border-primary')
                            )}
                          >
                            {isTaskCompleted ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <p className="text-base font-bold">{index + 1}</p>
                            )}
                          </button>
                        </div>
                        {index < currentTopicTasks.length - 1 && (
                          <div className="h-px w-4 bg-border" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
