"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Play, SkipForward, Terminal, Code, Send } from "lucide-react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex h-12 flex-shrink-0 items-center justify-end border-b px-4 gap-2">
        <Button onClick={onRunCode} variant="outline" size="sm" disabled={isRunning}>
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
      <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="shrink-0 rounded-none bg-transparent border-b justify-start px-4">
            <TabsTrigger value="editor" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
                <Code className="mr-2"/>
                Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
                <Terminal className="mr-2"/>
                Output
            </TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="flex-1 overflow-hidden m-0">
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
        </TabsContent>
        <TabsContent value="output" className="flex-1 overflow-hidden m-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
```