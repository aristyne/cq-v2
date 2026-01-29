"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, HomeIcon, LayoutGrid } from "lucide-react";

type WelcomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const tourSteps = [
    {
        icon: <HomeIcon className="h-10 w-10 text-primary" />,
        title: "The Learn Path",
        description: "This is your main map. Follow the path downwards to complete challenges. Click the pulsing 'Start' bubble to begin a lesson.",
    },
    {
        icon: <Star className="h-10 w-10 text-yellow-400" />,
        title: "XP & Rank",
        description: "Look up! The header shows your Rank and XP. Solving challenges helps you advance from a Beginner to a Master.",
    },
    {
        icon: <LayoutGrid className="h-10 w-10 text-primary" />,
        title: "The Overview Tab",
        description: "Look down! At the bottom, you'll find the 'OVERVIEW' tab. Use it for a handy glossary of all the Python concepts you'll encounter.",
    }
];


export default function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const [step, setStep] = useState(0);

  // Reset step if dialog is reopened
  useEffect(() => {
    if (open) {
        setStep(0);
    }
  }, [open]);

  const currentStepData = tourSteps[step];
  const isLastStep = step === tourSteps.length - 1;

  const handleNext = () => {
      if(isLastStep) {
          onOpenChange(false);
      } else {
          setStep(s => s + 1);
      }
  }
  
  const handleOpenChange = (isOpen: boolean) => {
      onOpenChange(isOpen);
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{currentStepData.title}</DialogTitle>
          {step === 0 && 
            <DialogDescription className="text-center pt-2">
              Welcome to CodeQuest! Here’s a quick tour.
            </DialogDescription>
          }
        </DialogHeader>
        <div className="grid gap-4 py-6">
          <div className="flex items-center gap-6 text-center flex-col">
            <div className="flex-shrink-0">
                {currentStepData.icon}
            </div>
            <p className="text-muted-foreground text-center">
              {currentStepData.description}
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 !items-center">
            <Button onClick={handleNext} className="w-full">
                {isLastStep ? "Let's Go!" : "Next"}
            </Button>
            <div className="flex justify-center gap-2 mt-2">
                {tourSteps.map((_, index) => (
                    <button 
                        key={index} 
                        className={`h-2 rounded-full transition-all duration-300 ${index === step ? 'bg-primary w-4' : 'bg-muted w-2'}`} 
                        onClick={() => setStep(index)}
                        aria-label={`Go to step ${index + 1}`}
                    />
                ))}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
