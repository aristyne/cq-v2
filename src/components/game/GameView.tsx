import Image from "next/image";
import type { Level } from "@/lib/levels";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type GameViewProps = {
  level: Level;
  onNextLevel: () => void;
  onPrevLevel: () => void;
  isFirstLevel: boolean;
  isLastLevel: boolean;
};

export default function GameView({
  level,
  onNextLevel,
  onPrevLevel,
  isFirstLevel,
  isLastLevel,
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
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevLevel}
            disabled={isFirstLevel}
            aria-label="Previous Level"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNextLevel}
            disabled={isLastLevel}
            aria-label="Next Level"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
