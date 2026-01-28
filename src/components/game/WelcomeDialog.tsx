"use client";

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

export default function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to CodeQuest!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your journey to Python mastery starts now. Here’s a quick tour.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            <HomeIcon className="h-8 w-8 text-primary mt-1 shrink-0" />
            <div>
              <h3 className="font-bold">The Learn Path</h3>
              <p className="text-sm text-muted-foreground">
                This is your main map. Follow the path, complete challenges, and unlock new topics. Click the pulsing <span className="font-bold text-primary">Start</span> bubble to begin a lesson.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Star className="h-8 w-8 text-yellow-400 mt-1 shrink-0" />
            <div>
              <h3 className="font-bold">XP and Ranks</h3>
              <p className="text-sm text-muted-foreground">
                See your total XP and current Rank in the header. Solving challenges earns you XP and helps you advance from a Beginner to a Master.
              </p>
            </div>
          </div>
           <div className="flex items-start gap-4">
            <LayoutGrid className="h-8 w-8 text-primary mt-1 shrink-0" />
            <div>
              <h3 className="font-bold">The Overview Tab</h3>
              <p className="text-sm text-muted-foreground">
                Feeling stuck or need a refresher? The <strong>OVERVIEW</strong> tab contains a handy glossary of all the Python concepts you'll encounter.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">Let's Go!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
