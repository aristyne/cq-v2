"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LoaderCircle,
  Play,
  SkipForward,
  Terminal,
  Code,
  Send,
} from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import React from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

type CodeConsoleProps = {
  code: string;
  setCode: (code: string) => void;
  output: string[];
  onRunCode: () => void;
  isRunning: boolean;
  onNextLevel: () => void;
  hasNextLevel: boolean;
  isNextLevelUnlocked: boolean;
};

export default function CodeConsole({
  code,
  setCode,
  output,
  onRunCode,
  isRunning,
  onNextLevel,
  hasNextLevel,
  isNextLevelUnlocked,
}: CodeConsoleProps) {
  const lines = code.split("\n").length;

  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex h-12 flex-shrink-0 items-center justify-end gap-2 border-b px-4">
        <Button
          onClick={onRunCode}
          variant="outline"
          size="sm"
          disabled={isRunning}
        >
          {isRunning ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button onClick={onRunCode} size="sm" disabled={isRunning}>
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
        {hasNextLevel && (
          <Button
            onClick={onNextLevel}
            size="sm"
            variant="outline"
            disabled={!isNextLevelUnlocked}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Next Level
          </Button>
        )}
      </div>
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel defaultSize={60} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex h-10 items-center border-b border-t bg-primary/10 px-4">
              <Code className="mr-2 h-4 w-4 text-primary" />
              <span className="font-bold text-primary">Editor</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex h-full font-code text-base">
                <div className="select-none p-4 pr-3 text-right text-muted-foreground">
                  {Array.from({ length: lines }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={(code) =>
                    highlight(code, languages.python, "python")
                  }
                  padding={16}
                  className="flex-grow !ring-0"
                  style={{
                    minHeight: "100%",
                  }}
                />
              </div>
            </ScrollArea>
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-border transition-colors hover:bg-primary" />
        <Panel defaultSize={40} minSize={20}>
          <div className="flex h-full flex-col">
            <div className="flex h-10 items-center border-b border-t bg-primary/10 px-4">
              <Terminal className="mr-2 h-4 w-4 text-primary" />
              <span className="font-bold text-primary">Output</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 font-code text-sm">
                {output.length > 0 ? (
                  output.map((line, index) => (
                    <p
                      key={index}
                      className={`whitespace-pre-wrap ${
                        line.includes("✅") ? "text-green-400" : ""
                      } ${line.includes("❌") ? "text-red-400" : ""}`}
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Click "Run" or "Submit" to see the output.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
