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
import { Star, HomeIcon, LayoutGrid, ArrowUp, ArrowDown } from "lucide-react";

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
            <div className="flex-shrink-0 pt-1 flex items-center gap-1">
              <HomeIcon className="h-8 w-8 text-primary" />
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">The Learn Path (Below)</h3>
              <p className="text-sm text-muted-foreground">
                This is your main map. Follow the path to complete challenges, and click the pulsing <span className="font-bold text-primary">Start</span> bubble to begin a lesson.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1 flex items-center gap-1">
              <Star className="h-8 w-8 text-yellow-400" />
              <ArrowUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">XP & Rank (Above)</h3>
              <p className="text-sm text-muted-foreground">
                Look up at the header to track your Rank and total XP. Solving challenges helps you advance from a Beginner to a Master.
              </p>
            </div>
          </div>
           <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1 flex items-center gap-1">
                <LayoutGrid className="h-8 w-8 text-primary" />
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">The Overview Tab (Below)</h3>
              <p className="text-sm text-muted-foreground">
                At the bottom, you'll find the <strong>OVERVIEW</strong> tab. Use it for a handy glossary of all the Python concepts you'll encounter.
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
