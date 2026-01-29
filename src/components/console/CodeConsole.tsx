"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Terminal, Send } from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import React from "react";
import { Level } from "@/lib/levels";

type CodeConsoleProps = {
  level: Level;
  code?: string;
  setCode?: (code: string) => void;
  output: string[];
  onRunCode: () => void;
  isRunning: boolean;
  showOutput: boolean;
  setShowOutput: (show: boolean) => void;
};

export default function CodeConsole({
  level,
  code = '',
  setCode = () => {},
  output,
  onRunCode,
  isRunning,
  showOutput,
  setShowOutput,
}: CodeConsoleProps) {
  const lines = code.split("\n").length;

  const showEditor = level.type === 'code';

  return (
    <div className="flex flex-col border-t-2">
      {showOutput && (
        <div className="flex h-48 flex-col bg-secondary">
          <div className="flex h-12 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Terminal className="mr-2 h-5 w-5 text-secondary-foreground" />
              <span className="font-bold text-secondary-foreground">Output</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowOutput(false)}>
              Close
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0 font-code text-sm">
              {output.map((line, index) => (
                <p
                  key={index}
                  className={`whitespace-pre-wrap ${
                    line.includes("✅") ? "text-green-500" : ""
                  } ${line.includes("❌") ? "text-red-500" : ""}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {showEditor && (
        <div className="flex-1">
          <ScrollArea className="h-64">
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
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </div>
          </ScrollArea>
        </div>
      )}


      <div className="flex h-24 items-center justify-center border-t-2 px-4">
        <Button
          onClick={onRunCode}
          size="lg"
          className="w-full max-w-xs text-lg font-bold uppercase tracking-wider"
          disabled={isRunning}
        >
          {isRunning ? (
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isRunning ? "Checking..." : "Check"}
        </Button>
      </div>
    </div>
  );
}

    