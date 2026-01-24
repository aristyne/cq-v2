"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getAiSuggestionAction } from "@/app/actions";
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

type AiAssistantProps = {
  code: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get a Hint
        </>
      )}
    </Button>
  );
}

function AssistantTab({ code }: AiAssistantProps) {
  const initialState = { suggestion: null, error: null };
  const [state, formAction] = useActionState(getAiSuggestionAction, initialState);

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-sm text-sidebar-foreground/80">
        Stuck on a problem? Submit your code to get a hint, debugging help, or
        suggestions for improvement from your AI companion.
      </p>

      <form action={formAction}>
        <input type="hidden" name="code" value={code} />
        <SubmitButton />
      </form>

      {(state.suggestion || state.error) && (
        <Card className="flex-1 bg-sidebar-accent text-sidebar-accent-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-full max-h-[40vh] pr-4">
              {state.suggestion && (
                <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap font-body text-sidebar-accent-foreground">
                  {state.suggestion}
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
                      className="!bg-card"
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

export default function AiAssistant({ code }: AiAssistantProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 p-4 pb-0">
        <Bot className="h-8 w-8 text-sidebar-primary" />
        <h2 className="font-headline text-2xl font-bold">Code Guide</h2>
      </div>

      <Tabs defaultValue="assistant" className="flex-1 flex flex-col p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant">
            <Bot className="mr-2 h-4 w-4" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="glossary">
            <BookOpen className="mr-2 h-4 w-4" />
            Glossary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="flex-1 overflow-y-auto mt-4">
          <AssistantTab code={code} />
        </TabsContent>
        <TabsContent value="glossary" className="flex-1 overflow-y-auto mt-4">
          <GlossaryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
