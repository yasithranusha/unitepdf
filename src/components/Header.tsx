import { Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              UnitePDF
            </h1>
            <p className="text-xs text-muted-foreground">Merge PDFs with ease</p>
          </div>
        </div>

        {/* GitHub Link */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 hover:bg-primary/10"
        >
          <a
            href="https://github.com/yasithranusha/unitepdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub"
          >
            <Github className="h-5 w-5" />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
