"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getAiSuggestionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lightbulb, LoaderCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

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

export default function AiAssistant({ code }: AiAssistantProps) {
  const initialState = { suggestion: null, error: null };
  const [state, formAction] = useFormState(getAiSuggestionAction, initialState);

  return (
    <div className="flex h-full flex-col gap-4 p-4 text-sidebar-foreground">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-sidebar-primary" />
        <h2 className="font-headline text-2xl font-bold">AI Assistant</h2>
      </div>

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
