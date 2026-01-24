"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Play, SkipForward, Terminal } from "lucide-react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import React from 'react';

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
  const lines = code.split('\n').length;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h2 className="font-headline text-lg font-bold">Console</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onRunCode} size="sm" disabled={isRunning}>
            {isRunning ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isRunning ? "Running..." : "Run Code"}
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
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r">
          <ScrollArea className="h-full">
            <div className="flex h-full font-code text-base">
              <div className="select-none bg-card p-4 pr-3 text-right text-muted-foreground">
                {Array.from({ length: lines }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) => highlight(code, languages.python, 'python')}
                padding={16}
                className="flex-grow bg-card !ring-0"
                style={{
                  minHeight: '100%',
                }}
              />
            </div>
          </ScrollArea>
        </div>
        <div className="w-1/2">
          <ScrollArea className="h-full">
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
                  Click "Run Code" to see the output.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
