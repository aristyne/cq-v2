"use client";

import React, { useState, useEffect } from "react";
import { levels, type Level } from "@/lib/levels";
import Header from "@/components/layout/Header";
import GameView from "@/components/game/GameView";
import CodeConsole from "@/components/console/CodeConsole";
import CompletionDialog from "@/components/game/CompletionDialog";
import WelcomeDialog from "@/components/game/WelcomeDialog";
import { Home as HomeIcon, LayoutGrid, Scroll, Star, ChevronLeft, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { glossary } from "@/lib/glossary";

// WARNING: This is a VERY simplified Python interpreter for educational purposes.
// It is NOT safe, secure, or complete. It only supports a tiny subset of Python
// needed for the Code Odyssey game.
function simplePythonInterpreter(code: string): { output: string[], error: string | null } {
  const output: string[] = [];
  const globalScope: Record<string, any> = {};

  const lines = code.split('\n');
  
  const evalExpression = (expression: string, currentScope: Record<string, any>): any => {
    expression = expression.trim();
    if ((expression.startsWith("'") && expression.endsWith("'")) || (expression.startsWith('"') && expression.endsWith('"'))) {
      return expression.slice(1, -1);
    }
    if (expression in currentScope) {
      return currentScope[expression];
    }
    if (!isNaN(Number(expression))) {
      return Number(expression);
    }
    if (expression.includes('+')) {
      const parts = expression.split('+').map(p => p.trim());
      const values = parts.map(p => evalExpression(p, currentScope));
      if (values.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v))))) {
        return values.reduce((a, b) => Number(a) + Number(b), 0);
      }
      return values.join('');
    }
    if (expression.includes('-')) {
      const parts = expression.split('-').map(p => p.trim());
      const values = parts.map(p => evalExpression(p, currentScope));
      if (values.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v))))) {
        return values.map(Number).reduce((a, b) => a - b);
      }
      throw new Error(`TypeError: unsupported operand type(s) for -`);
    }
     if (expression.includes('*')) {
      const parts = expression.split('*').map(p => p.trim());
      const values = parts.map(p => evalExpression(p, currentScope));
      return values.reduce((a, b) => Number(a) * Number(b), 1);
    }
    if (expression.includes('/')) {
      const parts = expression.split('/').map(p => p.trim());
      const values = parts.map(p => evalExpression(p, currentScope));
      if(values[1] === 0) throw new Error("ZeroDivisionError: division by zero");
      return values.reduce((a, b) => Number(a) / Number(b));
    }
    throw new Error(`NameError: name '${expression}' is not defined`);
  };

  const executeBlock = (blockLines: string[], blockScope: Record<string, any> = {}) => {
      for (let i = 0; i < blockLines.length; i++) {
        let line = blockLines[i];
        const trimmedLine = line.trim();
        const lineIndent = line.length - line.trimStart().length;

        // The current scope needs to be recalculated on each line to get the latest variable values.
        let currentScope = {...globalScope, ...blockScope};

        if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;

        // print()
        const printMatch = trimmedLine.match(/^print\((.*)\)$/);
        if (printMatch) {
            output.push(String(evalExpression(printMatch[1], currentScope)));
            continue;
        }

        // variable assignment
        const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.*)$/);
        if (assignMatch) {
            const varName = assignMatch[1];
            const varValue = evalExpression(assignMatch[2], currentScope);
            if (Object.prototype.hasOwnProperty.call(blockScope, varName)) {
              blockScope[varName] = varValue;
            } else {
              globalScope[varName] = varValue;
            }
            // Update scope for immediate use
            currentScope = {...globalScope, ...blockScope};
            continue;
        }

        // for loop
        const forMatch = trimmedLine.match(/^for\s+(\w+)\s+in\s+range\((.*)\):$/);
        if(forMatch) {
            const loopVar = forMatch[1];
            const rangeArgs = forMatch[2].split(',').map(s => parseInt(s.trim(), 10));
            let start = 0;
            let end = 0;
            if (rangeArgs.length === 1) {
              end = rangeArgs[0];
            } else if (rangeArgs.length === 2) {
              start = rangeArgs[0];
              end = rangeArgs[1];
            } else {
              throw new Error("SyntaxError: Invalid range() arguments");
            }
            
            const bodyLines = [];
            i++;
            while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                bodyLines.push(blockLines[i]);
                i++;
            }
            i--;

            for(let j=start; j<end; j++) {
                executeBlock(bodyLines, {...blockScope, [loopVar]: j});
            }
            continue;
        }

        // if statement
        const ifMatch = trimmedLine.match(/^if\s+(.*):$/);
        if (ifMatch) {
            const condition = ifMatch[1];
            const condParts = condition.split(/\s*(>=|<=|==|!=|>|<)\s*/);
            if (condParts.length < 3) throw new Error("Invalid if condition");

            const varValue = evalExpression(condParts[0], currentScope);
            const operator = condParts[1];
            const value = evalExpression(condParts[2], currentScope);

            let conditionResult = false;
            if (operator === '>=') conditionResult = varValue >= value;
            else if (operator === '<=') conditionResult = varValue <= value;
            else if (operator === '>') conditionResult = varValue > value;
            else if (operator === '<') conditionResult = varValue < value;
            else if (operator === '==') conditionResult = varValue == value;
            else if (operator === '!=') conditionResult = varValue != value;
            
            const ifBody: string[] = [];
            const elseBody: string[] = [];
            let currentBody: string[] = ifBody;
            
            i++;
            while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                currentBody.push(blockLines[i]);
                i++;
            }

            if (i < blockLines.length && blockLines[i].trim().startsWith('else:')) {
                currentBody = elseBody;
                i++;
                while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                    currentBody.push(blockLines[i]);
                    i++;
                }
            }
            i--;

            if (conditionResult) {
                executeBlock(ifBody, blockScope);
            } else {
                executeBlock(elseBody, blockScope);
            }
            continue;
        }

        throw new Error(`SyntaxError: Unsupported syntax on line: "${trimmedLine}"`);
    }
  }

  try {
    executeBlock(lines, {});
    return { output, error: null };
  } catch(e: any) {
    return { output: [], error: e.message };
  }
}

const OverviewView = () => {
    return (
        <div className="p-4 md:p-6 space-y-4">
            <h1 className="text-2xl font-bold">Python Overview</h1>
            <p className="text-muted-foreground">A quick introduction to the major concepts you'll learn in CodeQuest.</p>
            <Accordion type="single" collapsible className="w-full">
                {glossary.map((topic) => (
                    <AccordionItem value={topic.term} key={topic.term}>
                        <AccordionTrigger>{topic.term}</AccordionTrigger>
                        <AccordionContent>
                            <p className="mb-2">{topic.definition}</p>
                            <Editor
                              value={topic.example}
                              onValueChange={() => {}}
                              highlight={(code) => highlight(code, languages.python, 'python')}
                              padding={8}
                              readOnly
                              className="!bg-card rounded-md text-sm font-code"
                              style={{
                                backgroundColor: 'hsl(var(--card))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
  }

type BottomNavProps = {
    activeView: 'path' | 'lesson' | 'overview';
    setView: React.Dispatch<React.SetStateAction<'path' | 'lesson' | 'overview'>>;
};

const BottomNav = ({ activeView, setView }: BottomNavProps) => (
    <footer className="h-20 w-full shrink-0 border-t-2">
      <nav className="grid h-full grid-cols-2 items-center">
        <button onClick={() => setView('path')} className={cn("flex flex-col items-center justify-center gap-1 h-full", activeView === 'path' ? 'text-primary' : 'text-muted-foreground/50 hover:text-primary')}>
          <HomeIcon className="h-7 w-7" />
          <span className="text-xs font-bold">LEARN</span>
        </button>
        <button onClick={() => setView('overview')} className={cn("flex flex-col items-center justify-center gap-1 h-full", activeView === 'overview' ? 'text-primary' : 'text-muted-foreground/50 hover:text-primary')}>
          <LayoutGrid className="h-7 w-7" />
          <span className="text-xs font-bold">OVERVIEW</span>
        </button>
      </nav>
    </footer>
)

type LearnPathProps = {
    levels: Level[];
    highestLevelUnlocked: number;
    onSelectLevel: (levelId: number) => void;
    currentLevel: Level;
};

const LearnPath = ({ levels, highestLevelUnlocked, onSelectLevel, currentLevel }: LearnPathProps) => {
    const topics = levels.reduce((acc, level) => {
        if (!acc[level.topicId]) {
            acc[level.topicId] = [];
        }
        acc[level.topicId].push(level);
        return acc;
    }, {} as Record<number, Level[]>);

    return (
        <div className="mx-auto max-w-sm px-4 py-8">
            <div className="relative flex flex-col items-center gap-8">
                {Object.values(topics).map((topicLevels: Level[], index) => (
                    <div key={index} className="flex flex-col items-center gap-4 w-full">
                        <div
                            className="topic-card w-full text-center"
                            style={{ backgroundColor: `var(--topic-color-${topicLevels[0].topicId})` }}
                        >
                            <h2 className="text-xl">{topicLevels[0].topicTitle}</h2>
                            <p className="text-sm opacity-80">{topicLevels[0].description}</p>
                        </div>
                        {topicLevels.map((level: Level) => {
                            const isUnlocked = level.id <= highestLevelUnlocked;
                            const isCurrent = level.id === highestLevelUnlocked;
                            const isCompleted = level.id < highestLevelUnlocked;

                            return (
                                <div key={level.id} className="grid grid-cols-3 items-center w-full">
                                    <div className="flex justify-end pr-4">
                                        {isCurrent && (
                                            <ChevronRight className="h-8 w-8 text-primary animate-pulse" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => isUnlocked && onSelectLevel(level.id)}
                                        disabled={!isUnlocked}
                                        className={cn("lesson-bubble mx-auto",
                                            !isUnlocked && "bg-muted border-border text-muted-foreground cursor-not-allowed",
                                            isCompleted && "bg-primary border-primary text-primary-foreground",
                                            isCurrent && "bg-card border-primary text-primary animate-pulse"
                                        )}
                                    >
                                        {isUnlocked ? <Star className={cn("h-10 w-10", isCompleted && "fill-current", isCurrent && "fill-primary")} /> : <Lock className="h-10 w-10" />}
                                        {isCurrent && (
                                            <div className="absolute -bottom-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                                                Start
                                            </div>
                                        )}
                                    </button>
                                    <div />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

type LessonViewProps = {
    level: Level;
    code: string;
    setCode: (code: string) => void;
    output: string[];
    onSubmit: () => void;
    isRunning: boolean;
    onExit: () => void;
    showOutput: boolean;
    setShowOutput: (show: boolean) => void;
    // For interactive questions
    selectedAnswer?: number | null;
    setSelectedAnswer?: (index: number) => void;
    blankValue?: string;
    setBlankValue?: (value: string) => void;
    isAnswerChecked?: boolean;
};

const LessonView = ({ 
  level, 
  code, setCode, 
  output, onSubmit, 
  isRunning, 
  onExit, 
  showOutput, 
  setShowOutput,
  selectedAnswer,
  setSelectedAnswer,
  blankValue,
  setBlankValue,
  isAnswerChecked,
}: LessonViewProps) => {
    return (
        <div className="flex h-full flex-col">
             <header className="flex h-16 shrink-0 items-center justify-between border-b-2 px-4">
                <button onClick={onExit} className="p-2 rounded-xl hover:bg-muted">
                    <ChevronLeft className="h-7 w-7 text-muted-foreground" />
                </button>
                <div className="flex-1">
                    <div className="mx-auto h-4 w-full max-w-sm rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: '50%' }}></div>
                    </div>
                </div>
                 <div className="w-10"></div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <GameView 
                  level={level}
                  selectedAnswer={selectedAnswer}
                  onSelectAnswer={setSelectedAnswer}
                  blankValue={blankValue}
                  onBlankValueChange={setBlankValue}
                  isAnswerChecked={isAnswerChecked}
                />
            </main>
            <CodeConsole
                level={level}
                code={code}
                setCode={setCode}
                output={output}
                onRunCode={onSubmit}
                isRunning={isRunning}
                showOutput={showOutput}
                setShowOutput={setShowOutput}
            />
        </div>
    )
}

export default function Page() {
  const [view, setView] = useState<'path' | 'lesson' | 'overview'>('path');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [highestLevelUnlocked, setHighestLevelUnlocked] = useState(1);
  const [xp, setXp] = useState(0);
  const [code, setCode] = useState(levels[0].type === 'code' ? levels[0].starterCode : '');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  
  // State for new question types
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [blankValue, setBlankValue] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [tourStep, setTourStep] = useState(-1);
  const [showConsoleOutput, setShowConsoleOutput] = useState(false);

  useEffect(() => {
    if (xp === 0 && !hasShownWelcome) {
      setShowWelcomeDialog(true);
      setTourStep(0);
      setHasShownWelcome(true);
    }
  }, [xp, hasShownWelcome]);

  const handleWelcomeChange = (open: boolean) => {
    setShowWelcomeDialog(open);
    if (!open) {
      setTourStep(-1); // Deactivate tour highlights
    }
  };

  const currentLevel = levels[currentLevelIndex];

  const handleSubmitAnswer = async () => {
    setIsRunning(true);
    let success = false;
    let feedback = [];

    setShowConsoleOutput(true);

    if (currentLevel.type === 'code') {
        feedback.push(`> Running code for: ${currentLevel.title}`);
        const result = simplePythonInterpreter(code);
        if (result.output) feedback.push(...result.output);
        if (result.error) feedback.push(`Error: ${result.error}`);

        const cleanOutput = result.output.map(s => s.trim()).filter(Boolean).join('\n');
        success = cleanOutput === currentLevel.expectedOutput;

    } else if (currentLevel.type === 'multiple-choice') {
        success = selectedAnswer === currentLevel.correctAnswer;
        
    } else if (currentLevel.type === 'fill-in-the-blank') {
        success = blankValue.trim() === currentLevel.solution;
    }
    
    setIsAnswerChecked(true);

    if (success) {
      feedback.push("\n✅ Success! You solved the challenge.");
      let earnedXp = 0;

      if (currentLevel.id >= highestLevelUnlocked) {
        earnedXp = currentLevel.xp;
        setXp((prevXp) => prevXp + earnedXp);

        if (highestLevelUnlocked <= levels.length) {
          setHighestLevelUnlocked(prev => prev + 1);
        }
      }
      
      setXpGained(earnedXp);
      
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 1000);
      
    } else {
      feedback.push(
        "\n❌ Almost there! That's not quite right. Try again."
      );
    }

    setConsoleOutput(feedback);
    setIsRunning(false);
  };

  const handleSelectLevel = (levelId: number) => {
    const levelIndex = levels.findIndex(l => l.id === levelId);
    if (levelIndex !== -1 && levelId <= highestLevelUnlocked) {
      setCurrentLevelIndex(levelIndex);
      const newLevel = levels[levelIndex];

      if (newLevel.type === 'code') {
        setCode(newLevel.starterCode);
      } else {
        setCode('');
      }

      setSelectedAnswer(null);
      setBlankValue('');
      setIsAnswerChecked(false);
      setConsoleOutput([]);
      setXpGained(0);
      setView('lesson');
      setShowConsoleOutput(false);
    }
  };
  
  const handleExitLesson = () => {
    setView('path');
    setXpGained(0);
    setShowConsoleOutput(false);
  }

  const handleNextLevel = () => {
    setShowCompletionDialog(false);
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < levels.length) {
      handleSelectLevel(levels[nextLevelIndex].id);
    } else {
        setView('path');
    }
  };

  const hasNextLevel = currentLevelIndex < levels.length - 1;

  const MainContent = () => (
    <>
      <Header xp={xp} className={cn({'tour-highlight rounded-none': tourStep === 0})} />
      <main className="flex-1 overflow-y-scroll scrollbar-gutter-stable">
        {view === 'path' && (
          <div className={cn({'tour-highlight': tourStep === 2})}>
            <LearnPath 
              levels={levels}
              highestLevelUnlocked={highestLevelUnlocked}
              onSelectLevel={handleSelectLevel}
              currentLevel={currentLevel}
            />
          </div>
        )}
        {view === 'overview' && (
          <OverviewView />
        )}
      </main>
      <div className={cn({'tour-highlight rounded-none': tourStep === 1})}>
        <BottomNav activeView={view} setView={setView} />
      </div>
    </>
  );

  return (
    <div className="h-dvh w-dvh bg-background text-foreground flex flex-col">
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={handleWelcomeChange}
        step={tourStep}
        setStep={setTourStep}
      />
      <CompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        level={currentLevel}
        xpGained={xpGained}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
      />
      {view === 'lesson' ? (
        <LessonView 
            level={currentLevel}
            code={code}
            setCode={setCode}
            output={consoleOutput}
            onSubmit={handleSubmitAnswer}
            isRunning={isRunning}
            onExit={handleExitLesson}
            showOutput={showConsoleOutput}
            setShowOutput={setShowConsoleOutput}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            blankValue={blankValue}
            setBlankValue={setBlankValue}
            isAnswerChecked={isAnswerChecked}
        />
      ) : (
        <MainContent />
      )}
    </div>
  );
}

    