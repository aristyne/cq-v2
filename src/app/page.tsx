"use client";

import { useState } from "react";
import { levels, type Level } from "@/lib/levels";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
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
    <SidebarProvider
      style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      className="bg-background text-foreground"
    >
      <Sidebar collapsible="icon">
        <AiAssistant code={code} />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-dvh flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <GameView
              level={currentLevel}
              onNextLevel={handleNextLevel}
              onPrevLevel={handlePrevLevel}
              isFirstLevel={currentLevelIndex === 0}
              isLastLevel={currentLevelIndex === levels.length - 1}
            />
          </main>
          <div className="h-[40%] min-h-[300px] flex-shrink-0 border-t border-border bg-card">
            <CodeConsole
              code={code}
              setCode={setCode}
              output={consoleOutput}
              onRunCode={handleRunCode}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
