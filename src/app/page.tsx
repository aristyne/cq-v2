"use client";

import { useState } from "react";
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
import { runPythonCode } from "@/app/actions";

export default function Home() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [highestLevelUnlocked, setHighestLevelUnlocked] = useState(1);
  const [xp, setXp] = useState(0);
  const [code, setCode] = useState(levels[0].starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const currentLevel = levels[currentLevelIndex];
  const completedLevels = highestLevelUnlocked > 1 ? highestLevelUnlocked - 1 : 0;

  const handleRunCode = async () => {
    setIsRunning(true);
    const initialOutput = [`> Running code for: ${currentLevel.title}`];
    setConsoleOutput(initialOutput);

    const result = await runPythonCode(code);

    let finalOutput = [...initialOutput];
    if (result.output) {
      finalOutput.push(...result.output);
    }
    if (result.error) {
      finalOutput.push(`Error: ${result.error}`);
    }

    let success = false;
    const cleanOutput = result.output.map(s => s.trim()).filter(Boolean).join('\\n');

    if (currentLevel.expectedOutput) {
        success = cleanOutput === currentLevel.expectedOutput;
    } else if (currentLevel.id === 2) {
        const nameIsSet = !code.includes('player_name = ""');
        const outputIsNotBlank = cleanOutput !== '';
        const printsVariable = code.includes(currentLevel.solution);
        success = nameIsSet && outputIsNotBlank && printsVariable;
    }

    if (success) {
      finalOutput.push("\n✅ Success! You solved the challenge.");
      
      if (currentLevel.id >= highestLevelUnlocked) {
        setXp((prevXp) => prevXp + currentLevel.xp);
        finalOutput.push(`✨ You gained ${currentLevel.xp} XP!`);

        if (highestLevelUnlocked <= levels.length) {
          setHighestLevelUnlocked(highestLevelUnlocked + 1);
          if (currentLevel.id < levels.length) {
            finalOutput.push("✨ New level unlocked!");
          }
        }
      }
      
      setConsoleOutput(finalOutput);

      setTimeout(() => {
        const nextLevelOutput = [...finalOutput];
        if (currentLevelIndex < levels.length - 1) {
          nextLevelOutput.push("\n🚀 Select the next level from the map to continue your journey!");
        } else {
          nextLevelOutput.push(
            "\n🎉 Congratulations! You have completed all levels!"
          );
        }
        setConsoleOutput(nextLevelOutput);
      }, 500);
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
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < levels.length) {
      handleSelectLevel(levels[nextLevelIndex].id);
    }
  };

  const hasNextLevel = currentLevelIndex < levels.length - 1;
  const isNextLevelUnlocked =
    hasNextLevel && (levels[currentLevelIndex + 1].id <= highestLevelUnlocked || highestLevelUnlocked > levels.length) ;

  return (
    <div className="h-dvh w-dvw bg-background text-foreground">
      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={25} minSize={25} className="h-full bg-sidebar">
          <AiAssistant code={code} />
        </Panel>
        <PanelResizeHandle className="w-2 bg-border transition-colors hover:bg-primary" />
        <Panel minSize={40}>
          <div className="flex h-dvh flex-col">
            <Header xp={xp} completedLevels={completedLevels} totalLevels={levels.length} />
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={25}>
                <main className="h-full overflow-auto p-4 md:p-6">
                  <GameView
                    level={currentLevel}
                    levels={levels}
                    highestLevelUnlocked={highestLevelUnlocked}
                    onSelectLevel={handleSelectLevel}
                  />
                </main>
              </Panel>
              <PanelResizeHandle className="h-2 w-full bg-border transition-colors hover:bg-primary" />
              <Panel defaultSize={50} minSize={25} className="bg-card">
                <CodeConsole
                  code={code}
                  setCode={setCode}
                  output={consoleOutput}
                  onRunCode={handleRunCode}
                  isRunning={isRunning}
                  onNextLevel={handleNextLevel}
                  hasNextLevel={hasNextLevel}
                  isNextLevelUnlocked={isNextLevelUnlocked}
                />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
