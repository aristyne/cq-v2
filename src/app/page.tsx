"use client";

import { useState } from "react";
import { levels, type Level } from "@/lib/levels";
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
  const [code, setCode] = useState(levels[0].starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const currentLevel = levels[currentLevelIndex];

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

    if (code.includes(currentLevel.solution)) {
      finalOutput.push("\n✅ Success! You solved the challenge.");
      setConsoleOutput(finalOutput);

      setTimeout(() => {
        const nextLevelOutput = [...finalOutput];
        if (currentLevelIndex < levels.length - 1) {
          handleNextLevel();
          nextLevelOutput.push("🚀 Moving to the next level...");
        } else {
          nextLevelOutput.push(
            "🎉 Congratulations! You have completed all levels!"
          );
        }
        setConsoleOutput(nextLevelOutput);
      }, 1000);
    } else {
      finalOutput.push(
        "\n❌ Almost there! Your code didn't produce the correct result. Try again or ask the AI assistant for a hint."
      );
      setConsoleOutput(finalOutput);
    }
    setIsRunning(false);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
      setCode(levels[nextIndex].starterCode);
      setConsoleOutput([]);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      const prevIndex = currentLevelIndex - 1;
      setCurrentLevelIndex(prevIndex);
      setCode(levels[prevIndex].starterCode);
      setConsoleOutput([]);
    }
  };

  return (
    <div className="h-dvh w-dvw bg-background text-foreground">
      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={20} minSize={15} className="h-full bg-sidebar">
          <AiAssistant code={code} />
        </Panel>
        <PanelResizeHandle className="w-2 bg-border transition-colors hover:bg-primary" />
        <Panel minSize={30}>
          <div className="flex h-dvh flex-col">
            <Header />
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <main className="h-full overflow-auto p-4 md:p-6">
                  <GameView
                    level={currentLevel}
                    onNextLevel={handleNextLevel}
                    onPrevLevel={handlePrevLevel}
                    isFirstLevel={currentLevelIndex === 0}
                    isLastLevel={currentLevelIndex === levels.length - 1}
                  />
                </main>
              </Panel>
              <PanelResizeHandle className="h-2 w-full bg-border transition-colors hover:bg-primary" />
              <Panel defaultSize={50} minSize={20} className="bg-card">
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
