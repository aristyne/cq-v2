"use client";

import { useState, useEffect } from "react";
import { levels } from "@/lib/levels";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import Header from "@/components/layout/Header";
import GameView from "@/components/game/GameView";
import AiAssistant from "@/components/assistant/AiAssistant";
import CodeConsole from "@/components/console/CodeConsole";
import CompletionDialog from "@/components/game/CompletionDialog";
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });
const successSound = typeof Audio !== "undefined" ? new Audio('https://actions.google.com/sounds/v1/human_voices/party_horn.ogg') : undefined;

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

export default function Home() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [highestLevelUnlocked, setHighestLevelUnlocked] = useState(1);
  const [xp, setXp] = useState(0);
  const [code, setCode] = useState(levels[0].starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [playerName, setPlayerName] = useState("Adventurer");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // This effect runs only on the client
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      if (successSound) {
        successSound.currentTime = 0;
        successSound.play();
      }
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const currentLevel = levels[currentLevelIndex];
  const completedLevels = highestLevelUnlocked > 1 ? highestLevelUnlocked - 1 : 0;

  const handleRunCode = async () => {
    setIsRunning(true);
    const initialOutput = [`> Running code for: ${currentLevel.title}`];
    setConsoleOutput(initialOutput);

    // A simple timeout to simulate code execution
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
      setShowConfetti(true);
      setShowCompletionDialog(true);
      
      if (currentLevel.id >= highestLevelUnlocked) {
        setXp((prevXp) => prevXp + currentLevel.xp);
        finalOutput.push(`✨ You gained ${currentLevel.xp} XP!`);

        if (highestLevelUnlocked <= levels.length) {
          setHighestLevelUnlocked(highestLevelUnlocked + 1);
          if (currentLevel.id < levels.length) {
            finalOutput.push("✨ New task unlocked!");
          }
        }
      }
      
      setConsoleOutput(finalOutput);
    } else {
      finalOutput.push(
        "\n❌ Almost there! Your code didn't produce the correct result. Try again or ask the AI assistant for a hint."
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
    }
  };

  const handleNextLevel = () => {
    setShowCompletionDialog(false);
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < levels.length) {
      handleSelectLevel(levels[nextLevelIndex].id);
    }
  };

  const hasNextLevel = currentLevelIndex < levels.length - 1;

  return (
    <div className="h-dvh w-dvh bg-background text-foreground">
      {showConfetti && windowSize.width > 0 && <Confetti
        width={windowSize.width}
        height={windowSize.height}
        confettiSource={{
          x: windowSize.width / 2,
          y: windowSize.height / 2,
          w: 0,
          h: 0,
        }}
        recycle={false}
        numberOfPieces={400}
      />}
      <CompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        level={currentLevel}
        xpGained={currentLevel.xp}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
      />
      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={25} minSize={20} className="h-full bg-sidebar">
          <AiAssistant code={code} level={currentLevel} />
        </Panel>
        <PanelResizeHandle className="w-2 bg-border transition-colors hover:bg-primary" />
        <Panel minSize={50}>
          <div className="flex h-dvh flex-col">
            <Header
              playerName={playerName}
              onPlayerNameChange={setPlayerName}
              xp={xp}
              completedLevels={completedLevels}
              totalLevels={levels.length}
              levels={levels}
              currentLevel={currentLevel}
              highestLevelUnlocked={highestLevelUnlocked}
              onSelectLevel={handleSelectLevel}
            />
            <PanelGroup direction="vertical">
              <Panel defaultSize={40} minSize={25}>
                <main className="h-full overflow-auto p-4 md:p-6">
                  <GameView
                    level={currentLevel}
                  />
                </main>
              </Panel>
              <PanelResizeHandle className="h-2 w-full bg-border transition-colors hover:bg-primary" />
              <Panel defaultSize={60} minSize={25} className="bg-card">
                <CodeConsole
                  code={code}
                  setCode={setCode}
                  output={consoleOutput}
                  onRunCode={handleRunCode}
                  isRunning={isRunning}
                />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
