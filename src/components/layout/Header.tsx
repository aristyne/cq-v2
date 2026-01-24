import { CodeXml } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <CodeXml className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          Code Odyssey
        </h1>
      </div>
    </header>
  );
}
