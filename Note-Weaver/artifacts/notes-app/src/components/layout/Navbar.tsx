import { Link, useRoute } from "wouter";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
export function Navbar() {
  const [isHome] = useRoute("/");
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Notes<span className="text-accent italic">AI</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="https://defnekoparal.github.io/lada-student-dashboard/dashboard.html"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            🎯 <span className="hidden sm:inline">Dashboard</span>
          </a>
          <a
            href="https://defnekoparal.github.io/lada-student-dashboard/calendar.html"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            📅 <span className="hidden sm:inline">Calendar</span>
          </a>
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors",
              isHome
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            📝 <span className="hidden sm:inline">Notes</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            📌 <span className="hidden sm:inline">Planning</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          >
            ⚙️ <span className="hidden sm:inline">Settings</span>
          </a>
        </nav>
      </div>
    </header>
  );
}