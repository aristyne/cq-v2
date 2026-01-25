import React from 'react';
import type { Level } from "@/lib/levels";
import { Badge } from '@/components/ui/badge';
import { Star, Home, Trees, Gem, GitMerge, TowerControl, CodeXml } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type GameViewProps = {
  level: Level;
};

const getIconForTopic = (topicId: number) => {
  const iconProps = {
    className: 'h-24 w-24 text-primary/10',
    strokeWidth: 1.5,
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

export default function GameView({
  level,
}: GameViewProps) {
  const TopicIcon = getIconForTopic(level.topicId);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden bg-card/50">
        <div className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-6 -top-6">
                {TopicIcon}
            </div>
            <h2 className="text-2xl font-bold text-foreground font-headline md:text-3xl">{level.title}</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-prose">{level.description}</p>
        </div>

        <CardContent className="p-6 md:p-8 pt-0">
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
