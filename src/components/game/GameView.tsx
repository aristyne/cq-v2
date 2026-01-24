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

type GameViewProps = {
  level: Level;
};

export default function GameView({
  level,
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
        <CardFooter className="flex justify-center pt-6">
          <p className="text-sm text-muted-foreground italic">Your journey is laid out before you. Choose your path wisely.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
