"use client";

import { useState, useEffect } from "react";
import { levels } from "@/lib/levels";
import Header from "@/components/layout/Header";
import GameView from "@/components/game/GameView";
import CodeConsole from "@/components/console/CodeConsole";
import CompletionDialog from "@/components/game/CompletionDialog";
import { Home as HomeIcon, Trophy, Scroll, Star, CodeXml, ChevronLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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

const BottomNav = () => (
    <footer className="h-20 w-full shrink-0 border-t-2">
      <nav className="grid h-full grid-cols-3 items-center">
        <a href="#" className="flex flex-col items-center justify-center gap-1 text-primary">
          <HomeIcon className="h-7 w-7" />
          <span className="text-xs font-bold">LEARN</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center gap-1 text-muted-foreground/50 hover:text-primary">
          <Trophy className="h-7 w-7" />
          <span className="text-xs font-bold">LEADERBOARD</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center gap-1 text-muted-foreground/50 hover:text-primary">
          <Scroll className="h-7 w-7" />
          <span className="text-xs font-bold">QUESTS</span>
        </a>
      </nav>
    </footer>
)

const LearnPath = ({ levels, highestLevelUnlocked, onSelectLevel, currentLevel }) => {
    const topics = levels.reduce((acc, level) => {
        if (!acc[level.topicId]) {
            acc[level.topicId] = [];
        }
        acc[level.topicId].push(level);
        return acc;
    }, {});

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="relative flex flex-col items-center gap-8">
                {Object.values(topics).map((topicLevels: any, index) => (
                    <div key={index} className="flex flex-col items-center gap-4 w-full">
                        <div
                            className="topic-card w-full text-center"
                            style={{ backgroundColor: `var(--topic-color-${topicLevels[0].topicId})` }}
                        >
                            <h2 className="text-xl">{topicLevels[0].topicTitle}</h2>
                            <p className="text-sm opacity-80">{topicLevels[0].description}</p>
                        </div>
                        {topicLevels.map((level, taskIndex) => {
                            const isUnlocked = level.id <= highestLevelUnlocked;
                            const isCurrent = level.id === highestLevelUnlocked;
                            const isCompleted = level.id < highestLevelUnlocked;
                            const isCurrentTopic = level.topicId === currentLevel.topicId;

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => isUnlocked && onSelectLevel(level.id)}
                                    disabled={!isUnlocked}
                                    className={cn("lesson-bubble",
                                        !isUnlocked && "bg-lesson-locked-bg border-lesson-locked-border text-lesson-locked-fg cursor-not-allowed",
                                        isCompleted && "bg-lesson-completed-bg border-lesson-completed-border text-white",
                                        isCurrent && "bg-lesson-current-bg border-lesson-current-border text-lesson-current-border animate-pulse",
                                        isUnlocked && !isCurrent && !isCompleted && "bg-lesson-current-bg border-lesson-completed-border text-primary"
                                    )}
                                >
                                    {isUnlocked ? <Star className="h-10 w-10" /> : <Lock className="h-10 w-10" />}
                                    {isCurrent && (
                                        <div className="absolute -bottom-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                                            Start
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

const LessonView = ({ level, code, setCode, output, onRunCode, isRunning, onExit }) => {
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
                <GameView level={level} />
            </main>
            <CodeConsole
                code={code}
                setCode={setCode}
                output={output}
                onRunCode={onRunCode}
                isRunning={isRunning}
            />
        </div>
    )
}

export default function Page() {
  const [view, setView] = useState<'path' | 'lesson'>('path');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [highestLevelUnlocked, setHighestLevelUnlocked] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [code, setCode] = useState(levels[0].starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const currentLevel = levels[currentLevelIndex];
  const completedLevels = highestLevelUnlocked > 1 ? highestLevelUnlocked - 1 : 0;

  useEffect(() => {
    if (open && (xpGained > 0)) {
        setShowCompletionDialog(true);
    }
  }, [xpGained]);

  const handleRunCode = async () => {
    setIsRunning(true);
    const initialOutput = [`> Running code for: ${currentLevel.title}`];
    setConsoleOutput(initialOutput);

    const result = simplePythonInterpreter(code);

    let finalOutput = [...initialOutput];
    if (result.output) {
      finalOutput.push(...result.output);
    }
    if (result.error) {
      finalOutput.push(`Error: ${result.error}`);
    }

    let success = false;
    const cleanOutput = result.output.map(s => s.trim()).filter(Boolean).join('\n');

    if (currentLevel.expectedOutput) {
        success = cleanOutput === currentLevel.expectedOutput;
    }

    if (success) {
      finalOutput.push("\n✅ Success! You solved the challenge.");
      
      let earnedXp = 0;

      if (currentLevel.id >= highestLevelUnlocked) {
        earnedXp = currentLevel.xp;
        setXp((prevXp) => prevXp + earnedXp);

        if (highestLevelUnlocked <= levels.length) {
          setHighestLevelUnlocked(prev => prev + 1);
        }
      }
      
      setXpGained(earnedXp);
      setShowCompletionDialog(true);
      
      setConsoleOutput(finalOutput);
    } else {
      finalOutput.push(
        "\n❌ Almost there! Your code didn't produce the correct result. Try again."
      );
      setConsoleOutput(finalOutput);
    }
    setIsRunning(false);
  };

  const handleSelectLevel = (levelId: number) => {
    const levelIndex = levels.findIndex(l => l.id === levelId);
    if (levelIndex !== -1 && levelId <= highestLevelUnlocked) {
      setCurrentLevelIndex(levelIndex);
      setCode(levels[levelIndex].starterCode);
      setConsoleOutput([]);
      setXpGained(0);
      setView('lesson');
    }
  };
  
  const handleExitLesson = () => {
    setView('path');
    setXpGained(0);
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

  return (
    <div className="h-dvh w-dvh bg-background text-foreground flex flex-col">
      <CompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        level={currentLevel}
        xpGained={xpGained}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
      />
      {view === 'path' && (
        <>
            <Header streak={streak} xp={xp} />
            <main className="flex-1 overflow-y-auto">
                <LearnPath 
                    levels={levels}
                    highestLevelUnlocked={highestLevelUnlocked}
                    onSelectLevel={handleSelectLevel}
                    currentLevel={currentLevel}
                />
            </main>
            <BottomNav />
        </>
      )}
      {view === 'lesson' && (
        <LessonView 
            level={currentLevel}
            code={code}
            setCode={setCode}
            output={consoleOutput}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            onExit={handleExitLesson}
        />
      )}
    </div>
  );
}
