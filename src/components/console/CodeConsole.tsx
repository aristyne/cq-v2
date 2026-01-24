import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Play, Terminal } from "lucide-react";

type CodeConsoleProps = {
  code: string;
  setCode: (code: string) => void;
  output: string[];
  onRunCode: () => void;
};

export default function CodeConsole({
  code,
  setCode,
  output,
  onRunCode,
}: CodeConsoleProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h2 className="font-headline text-lg font-bold">Console</h2>
        </div>
        <Button onClick={onRunCode} size="sm">
          <Play className="mr-2 h-4 w-4" />
          Run Code
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r">
          <ScrollArea className="h-full">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your Python code here..."
              className="h-full w-full resize-none rounded-none border-0 bg-card p-4 font-code text-base !ring-0"
            />
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
