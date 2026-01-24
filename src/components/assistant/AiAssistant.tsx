"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, LoaderCircle, BookOpen, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { glossary } from "@/lib/glossary";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import React from "react";
import { Level } from "@/lib/levels";
import { useToast } from "@/hooks/use-toast";

type AiAssistantProps = {
  code: string;
  level: Level;
};

type HintState = {
  hint: string | null;
  error: string | null;
};

function AssistantTab({ code, level }: AiAssistantProps) {
  const [attempts, setAttempts] = useState(0);
  const [displayedHints, setDisplayedHints] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const solutionShown = attempts > level.hints.length;

  const handleGetHint = () => {
    if (solutionShown) return;

    setIsThinking(true);
    const newAttempts = attempts + 1;
    
    let hint;
    if (newAttempts <= level.hints.length) {
      hint = level.hints[newAttempts - 1];
    } else {
      hint = `You've asked for a lot of hints! Here is the solution:\n\n\`\`\`python\n${level.solution}\n\`\`\``;
    }
    
    setTimeout(() => {
        setAttempts(newAttempts);
        setDisplayedHints(prev => [...prev, hint]);
        setIsThinking(false);
    }, 300);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-sidebar-foreground/80">
          Hints Used: {attempts}/{level.hints.length}
        </p>
        <Button onClick={handleGetHint} disabled={isThinking || solutionShown} variant="outline" size="sm" className="bg-sidebar-accent hover:bg-sidebar-accent/80">
          {isThinking ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin shrink-0" />
              Thinking...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4 shrink-0" />
              Get Hint
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 -mx-4">
        <div className="space-y-2 px-4">
          {displayedHints.map((hint, index) => (
             <div key={index} className="rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-sidebar-accent-foreground">Hint {index + 1}</span>
                <ChevronRight className="h-4 w-4 text-sidebar-accent-foreground/50"/>
              </div>
              {hint.includes('```') ? (
                <Editor
                  value={hint.replace(/```python\n|```/g, '')}
                  onValueChange={() => {}}
                  highlight={(code) => highlight(code, languages.python, 'python')}
                  padding={8}
                  readOnly
                  className="!bg-card rounded-md text-sm"
                />
              ) : (
                <p className="text-sm text-sidebar-accent-foreground/90">{hint}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function GlossaryTab() {
  const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the code in the editor.",
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-sm text-sidebar-foreground/80">
        A quick reference for common Python terms and concepts.
      </p>
      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4 pb-4">
          <Accordion type="single" collapsible className="w-full">
            {glossary.map((item) => (
              <AccordionItem value={item.term} key={item.term}>
                <AccordionTrigger>{item.term}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">{item.definition}</p>
                  <div className="rounded-md bg-card p-2 font-code text-sm text-card-foreground">
                    <Editor
                      value={item.example}
                      onValueChange={() => {}}
                      highlight={(code) => highlight(code, languages.python, 'python')}
                      padding={8}
                      readOnly
                      onClick={() => copyToClipboard(item.example)}
                      className="!bg-card cursor-copy"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AiAssistant({ code, level }: AiAssistantProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-sidebar-primary shrink-0" />
        <div>
          <h2 className="font-headline text-xl font-bold">AI Assistant</h2>
          <p className="text-sm text-sidebar-foreground/80">Here to help you learn</p>
        </div>
      </div>

      <Tabs defaultValue="assistant" className="flex-1 flex flex-col mt-4">
        <TabsList className="grid w-full grid-cols-2 bg-sidebar-accent">
          <TabsTrigger value="assistant" className="data-[state=active]:bg-background">
            <Lightbulb className="mr-2 h-4 w-4 shrink-0" />
            Hints
          </TabsTrigger>
          <TabsTrigger value="glossary" className="data-[state=active]:bg-background">
            <BookOpen className="mr-2 h-4 w-4 shrink-0" />
            Glossary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="flex-1 overflow-y-auto mt-4">
          <AssistantTab code={code} level={level} key={level.id} />
        </TabsContent>
        <TabsContent value="glossary" className="flex-1 overflow-y-auto mt-4">
          <GlossaryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
