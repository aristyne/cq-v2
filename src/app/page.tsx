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

export default function Home() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState(levels[0].starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const currentLevel = levels[currentLevelIndex];

  const handleRunCode = () => {
    // This is a mock execution.
    // In a real app, you would use a Python execution environment.
    const newOutput = [`> Running code for: ${currentLevel.title}`];
    if (code.includes(currentLevel.solution)) {
      newOutput.push("✅ Success! You solved the challenge.");
      // Add a small delay before moving to the next level for better UX
      setTimeout(() => {
        if (currentLevelIndex < levels.length - 1) {
          handleNextLevel();
          newOutput.push("🚀 Moving to the next level...");
        } else {
          newOutput.push("🎉 Congratulations! You have completed all levels!");
        }
        setConsoleOutput(newOutput);
      }, 1000);
    } else {
      newOutput.push(
        "❌ Almost there! Your code didn't produce the correct result. Try again or ask the AI assistant for a hint."
      );
    }
    setConsoleOutput(newOutput);
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
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15}>
          <div className="h-full bg-sidebar">
            <AiAssistant code={code} />
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-border transition-colors hover:bg-primary" />
        <Panel>
          <div className="flex h-dvh flex-col">
            <Header />
            <PanelGroup direction="vertical">
              <Panel>
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
              <Panel defaultSize={40} minSize={20} className="bg-card">
                <CodeConsole
                  code={code}
                  setCode={setCode}
                  output={consoleOutput}
                  onRunCode={handleRunCode}
                />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
