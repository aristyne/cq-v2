import React from 'react';
import type { Level } from "@/lib/levels";
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';

type GameViewProps = {
  level: Level;
  selectedAnswer?: number | null;
  onSelectAnswer?: (index: number) => void;
  blankValue?: string;
  onBlankValueChange?: (value: string) => void;
  isAnswerChecked?: boolean;
};

export default function GameView({
  level,
  selectedAnswer,
  onSelectAnswer,
  blankValue,
  onBlankValueChange,
  isAnswerChecked,
}: GameViewProps) {

  const isCorrect = () => {
    if (!isAnswerChecked) return false;
    if (level.type === 'multiple-choice') {
      return selectedAnswer === level.correctAnswer;
    }
    if (level.type === 'fill-in-the-blank') {
      return blankValue?.trim() === level.solution;
    }
    return false;
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground font-headline md:text-3xl">{level.title}</h1>
        
        <div className="space-y-2">
            <h2 className="text-xl font-bold">Challenge:</h2>
            <div className="rounded-xl border-2 bg-card p-4 text-base text-card-foreground">
                <p>{level.challenge}</p>
            </div>
        </div>

        {level.type === 'multiple-choice' && onSelectAnswer && (
          <div className="space-y-3 pt-4">
            {level.choices.map((choice, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectChoice = isAnswerChecked && index === level.correctAnswer;
              const isIncorrectChoice = isAnswerChecked && isSelected && !isCorrectChoice;

              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => onSelectAnswer(index)}
                  disabled={isAnswerChecked}
                  className={cn("w-full justify-start text-left h-auto py-3 whitespace-normal", {
                      "border-primary ring-2 ring-primary": isSelected && !isAnswerChecked,
                      "bg-green-100 border-green-400 text-green-800 hover:bg-green-100": isCorrectChoice,
                      "bg-red-100 border-red-400 text-red-800 hover:bg-red-100": isIncorrectChoice,
                      "hover:bg-accent": !isAnswerChecked,
                  })}
                >
                  {choice}
                </Button>
              )
            })}
          </div>
        )}

        {level.type === 'fill-in-the-blank' && onBlankValueChange && (
          <div className="space-y-4 pt-4">
              <Editor
                value={level.starterCode}
                onValueChange={() => {}}
                highlight={(code) => highlight(code, languages.python, 'python')}
                padding={16}
                readOnly
                className="!bg-card rounded-md font-code text-base"
                style={{
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <div className="flex items-center gap-2">
                <span className="font-bold shrink-0">Fill the blank:</span>
                <Input 
                  value={blankValue} 
                  onChange={(e) => onBlankValueChange(e.target.value)} 
                  placeholder="Your answer" 
                  readOnly={isAnswerChecked}
                  className={cn({
                    "border-green-500 ring-green-400 ring-2": isAnswerChecked && isCorrect(),
                    "border-red-500 ring-red-400 ring-2": isAnswerChecked && !isCorrect(),
                  })}
                />
              </div>
          </div>
        )}


        <div className="flex items-center gap-4">
             <Badge variant={level.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} className="px-3 py-1 text-sm">
                {level.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current"/>
                <span className="font-bold text-base text-foreground">{level.xp} XP</span>
            </div>
        </div>
    </div>
  );
}

    