"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Mic, MicOff, Play, SkipForward, Terminal } from "lucide-react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import React, { useState, useEffect, useRef } from 'react';
import { dictateCodeAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  const { toast } = useToast();
  const [isDictating, setIsDictating] = useState(false);
  const [isDictationAvailable, setIsDictationAvailable] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsDictationAvailable(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          variant: 'destructive',
          title: 'Dictation Error',
          description: `An error occurred: ${event.error}`,
        });
        setIsDictating(false);
      };

      recognition.onend = () => {
        // If recognition ends for any reason, make sure we update the state
        setIsDictating(false);
      };
    }
  }, [toast]);

  const handleDictation = async () => {
    if (!isDictationAvailable) {
      toast({
        variant: 'destructive',
        title: 'Dictation Not Supported',
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }

    if (isDictating) {
      // Stop dictation
      recognitionRef.current?.stop();
      setIsDictating(false); // onend will also set this, but we do it here for immediate UI feedback

      // Process the final transcript
      if (finalTranscriptRef.current.trim()) {
        toast({
          title: 'Processing dictation...',
          description: 'Your dictated code is being formatted by AI.',
        });
        const result = await dictateCodeAction(finalTranscriptRef.current);
        if (result.formattedCode) {
          setCode(currentCode => {
            const separator = currentCode.trim() ? '\n' : '';
            return `${currentCode}${separator}${result.formattedCode}`;
          });
          toast({
            title: 'Code Added!',
            description: 'The dictated code has been added to the editor.',
          });
        } else if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Dictation Failed',
            description: result.error,
          });
        }
        finalTranscriptRef.current = ''; // Clear for next time
      }
    } else {
      // Start dictation
      finalTranscriptRef.current = ''; // Reset transcript
      recognitionRef.current?.start();
      setIsDictating(true);
    }
  };

  const lines = code.split('\n').length;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h2 className="font-headline text-lg font-bold">Console</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDictation}
            size="sm"
            variant={isDictating ? "destructive" : "outline"}
            disabled={!isDictationAvailable}
            title={isDictationAvailable ? "Start/Stop Dictation" : "Dictation not available"}
          >
            {isDictating ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {isDictating ? "Stop" : "Dictate"}
          </Button>
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
