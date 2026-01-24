"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lightbulb, LoaderCircle, BookOpen } from "lucide-react";
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
  const [state, setState] = useState<HintState>({ hint: null, error: null });
  const [isThinking, setIsThinking] = useState(false);

  const handleGetHint = () => {
    setIsThinking(true);
    const newAttempts = attempts + 1;
    
    let hint;
    if (newAttempts <= level.hints.length) {
      hint = level.hints[newAttempts - 1];
    } else {
      hint = `You've asked for a lot of hints! Here is the solution:\n\n${'```python'}
${level.solution}
${'```'}`;
    }
    
    // Simulate thinking so the user sees the loading state
    setTimeout(() => {
        setAttempts(newAttempts);
        setState({ hint, error: null });
        setIsThinking(false);
    }, 300);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-sm text-sidebar-foreground/80">
        Stuck on a problem? Get a hint. The more hints you request, the more specific they become.
      </p>

      <Button onClick={handleGetHint} disabled={isThinking} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {isThinking ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin shrink-0" />
            Thinking...
          </>
        ) : (
          <>
            <Lightbulb className="mr-2 h-4 w-4 shrink-0" />
            Get a Hint
          </>
        )}
      </Button>

      {attempts > 0 && (
        <p className="text-xs text-center text-sidebar-foreground/60">Hint attempts: {attempts}</p>
      )}

      {(state.hint || state.error) && (
        <Card className="flex-1 bg-sidebar-accent text-sidebar-accent-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Hint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-full max-h-[40vh] pr-4">
              {state.hint && (
                <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap font-body text-sidebar-accent-foreground">
                   {state.hint.includes('```') ? (
                    <Editor
                      value={state.hint.replace(/```python\n|```/g, '')}
                      onValueChange={() => {}}
                      highlight={(code) => highlight(code, languages.python, 'python')}
                      padding={8}
                      readOnly
                      className="!bg-card rounded-md"
                    />
                  ) : (
                    state.hint
                  )}
                </div>
              )}
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
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
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 p-4 pb-0">
        <Bot className="h-8 w-8 text-sidebar-primary shrink-0" />
        <h2 className="font-headline text-2xl font-bold">Code Guide</h2>
      </div>

      <Tabs defaultValue="assistant" className="flex-1 flex flex-col p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant">
            <Bot className="mr-2 h-4 w-4 shrink-0" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="glossary">
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
