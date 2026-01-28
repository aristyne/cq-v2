"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Level } from "@/lib/levels";
import { Gem, SkipForward, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import useSound from 'use-sound';
import ReactConfetti from 'react-confetti';

type CompletionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level;
  xpGained: number;
  onNextLevel: () => void;
  hasNextLevel: boolean;
};

const partyHornUrl = 'https://www.myinstants.com/media/sounds/yaaaaaaaay.mp3';

export default function CompletionDialog({
  open,
  onOpenChange,
  level,
  xpGained,
  onNextLevel,
  hasNextLevel,
}: CompletionDialogProps) {
  const [isClient, setIsClient] = useState(false);
  const [playPartyHorn] = useSound(partyHornUrl, { volume: 0.5 });
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const hasRewards = xpGained > 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && hasRewards) {
      setIsCelebrating(true);
      playPartyHorn();
      const timer = setTimeout(() => setIsCelebrating(false), 5000); // Let confetti fall for 5s
      return () => clearTimeout(timer);
    } else {
        setIsCelebrating(false);
    }
  }, [open, hasRewards, playPartyHorn]);
  
  const handleContinue = () => {
    onOpenChange(false);
    onNextLevel();
  }

  return (
    <>
      {isClient && isCelebrating && (
        <ReactConfetti
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, pointerEvents: 'none' }}
            numberOfPieces={400}
            recycle={false}
          />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-none w-full h-full flex flex-col items-center justify-between p-8 bg-background text-foreground">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Lesson Complete!</h1>
            <p className="text-lg text-muted-foreground">You are one step closer to mastering Python.</p>
          </div>
          
          <div className="flex flex-col items-center gap-4 my-8">
              <div className="flex items-center gap-2 rounded-full border-2 border-yellow-400 px-6 py-2 text-yellow-500">
                  <Star className="h-7 w-7 fill-current" />
                  <span className="text-2xl font-bold">+{xpGained} XP</span>
              </div>
          </div>

          <Button onClick={handleContinue} size="lg" className="w-full text-lg font-bold uppercase tracking-wider">
            <SkipForward className="mr-2 h-5 w-5" />
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
