import { CodeXml, User, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  xp: number;
  completedLevels: number;
  totalLevels: number;
};

export default function Header({
  playerName,
  onPlayerNameChange,
  xp,
  completedLevels,
  totalLevels,
}: HeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
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
            className="h-auto w-32 border-none bg-transparent p-0 font-medium shadow-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
    </header>
  );
}
