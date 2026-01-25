"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Level } from "@/lib/levels";
import { Gem, SkipForward, Star, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import useSound from 'use-sound';
import ReactConfetti from 'react-confetti';

type CompletionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level;
  xpGained: number;
  gemsGained: number;
  onNextLevel: () => void;
  hasNextLevel: boolean;
};

const partyHornUrl = 'https://s3.amazonaws.com/freecodecamp/drums/Party-Horn.mp3';

export default function CompletionDialog({
  open,
  onOpenChange,
  level,
  xpGained,
  gemsGained,
  onNextLevel,
  hasNextLevel,
}: CompletionDialogProps) {
  const [isClient, setIsClient] = useState(false);
  const [playPartyHorn] = useSound(partyHornUrl, { volume: 0.5 });
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasRewards = xpGained > 0 || gemsGained > 0;

  useEffect(() => {
    if (open && hasRewards) {
      setIsCelebrating(true);
      playPartyHorn();
      const timer = setTimeout(() => setIsCelebrating(false), 5000); // Let confetti fall for 5s
      return () => clearTimeout(timer);
    }
  }, [open, playPartyHorn, hasRewards]);
  
  const handleContinue = () => {
    onOpenChange(false);
    if(hasNextLevel) {
        onNextLevel();
    }
  }

  return (
    <>
      {isClient && isCelebrating && (
        <>
          <ReactConfetti
            style={{ pointerEvents: 'none', zIndex: 1000 }}
            numberOfPieces={400}
            recycle={false}
            confettiSource={{
              x: 0,
              y: window.innerHeight,
              w: 0,
              h: 0,
            }}
          />
          <ReactConfetti
            style={{ pointerEvents: 'none', zIndex: 1000 }}
            numberOfPieces={400}
            recycle={false}
            confettiSource={{
              x: window.innerWidth,
              y: window.innerHeight,
              w: 0,
              h: 0,
            }}
          />
        </>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            <DialogTitle className="text-2xl font-bold">
              Task Complete!
            </DialogTitle>
            <DialogDescription>
              You successfully completed "{level.title}".
            </DialogDescription>
          </DialogHeader>
          {hasRewards && (
              <div className="flex justify-center items-center gap-4 my-4">
                  <div className="flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-2 text-yellow-400">
                      <Star className="h-5 w-5" />
                      <span className="font-bold">+{xpGained} XP</span>
                  </div>
                   <div className="flex items-center gap-2 rounded-full bg-blue-400/10 px-4 py-2 text-blue-400">
                      <Gem className="h-5 w-5" />
                      <span className="font-bold">+{gemsGained} Gems</span>
                  </div>
              </div>
          )}
          <DialogFooter className="sm:justify-center">
            {hasNextLevel ? (
              <Button onClick={handleContinue}>
                <SkipForward className="mr-2 h-4 w-4" />
                Continue to Next Task
              </Button>
            ) : (
               <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Finish Quest
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
