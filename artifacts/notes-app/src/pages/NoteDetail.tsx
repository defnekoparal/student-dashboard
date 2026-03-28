import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Loader2, Sparkles, Image as ImageIcon, FileText } from "lucide-react";
import { useNoteDetail } from "@/hooks/use-notes";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NoteDetail() {
  const [, params] = useRoute("/note/:id");
  const noteId = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: note, isLoading, error } = useNoteDetail(noteId);
  const [activeTab, setActiveTab] = useState<"result" | "original">("result");

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-accent" />
          <p className="font-medium">Loading note details...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="bg-destructive/10 text-destructive p-8 rounded-2xl inline-block">
          <h2 className="text-2xl font-serif font-bold mb-2">Note not found</h2>
          <p className="mb-6 opacity-90">The note you're looking for doesn't exist or couldn't be loaded.</p>
          <Link href="/history" className="inline-flex items-center font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="accent" className="capitalize text-sm px-3 py-1 shadow-sm shadow-accent/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {note.mode}
          </Badge>
          <div className="flex items-center text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            {format(new Date(note.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight leading-tight">
          {note.title || "Untitled Note"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 mb-8">
        <button
          onClick={() => setActiveTab("result")}
          className={cn(
            "pb-3 px-1 mr-8 text-sm font-medium transition-colors relative",
            activeTab === "result" ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Processed Result
          </div>
          {activeTab === "result" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("original")}
          className={cn(
            "pb-3 px-1 text-sm font-medium transition-colors relative",
            activeTab === "original" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Original Note
          </div>
          {activeTab === "original" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden min-h-[500px]">
        {activeTab === "result" ? (
          <div className="p-6 md:p-10 bg-white dark:bg-card">
            <Markdown content={note.result} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50 h-full">
            <div className="p-6 md:p-8 flex flex-col items-center bg-secondary/10">
              <h3 className="text-sm font-semibold text-muted-foreground tracking-widest uppercase w-full mb-4 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" /> Uploaded Image
              </h3>
              {note.imageBase64 && note.mimeType ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-inner bg-black/5">
                  <img 
                    src={`data:${note.mimeType};base64,${note.imageBase64}`} 
                    alt="Original note" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-secondary/30">
                  No image available
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground tracking-widest uppercase w-full mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Extracted Text
              </h3>
              <div className="prose prose-sm prose-slate max-w-none text-muted-foreground font-mono text-[13px] leading-relaxed whitespace-pre-wrap bg-secondary/30 p-4 rounded-lg border border-border/40">
                {note.extractedText || "No text could be extracted from this image."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
