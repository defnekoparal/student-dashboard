import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, ChevronRight, FileText, HelpCircle, ListTree, Trash2 } from "lucide-react";
import { useNotesHistory, useDeleteNoteMutation } from "@/hooks/use-notes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProcessNoteRequestMode } from "@workspace/api-client-react";

export default function History() {
  const { data, isLoading, error } = useNotesHistory();
  const deleteMutation = useDeleteNoteMutation();

  const getModeIcon = (mode: string) => {
    switch(mode) {
      case ProcessNoteRequestMode.simplify: return <FileText className="h-3 w-3 mr-1" />;
      case ProcessNoteRequestMode.organize: return <ListTree className="h-3 w-3 mr-1" />;
      case ProcessNoteRequestMode.quiz: return <HelpCircle className="h-3 w-3 mr-1" />;
      default: return <FileText className="h-3 w-3 mr-1" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch(mode) {
      case ProcessNoteRequestMode.simplify: return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300";
      case ProcessNoteRequestMode.organize: return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300";
      case ProcessNoteRequestMode.quiz: return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "";
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigating to detail
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Your Notebook</h1>
          <p className="mt-2 text-muted-foreground">Access your previously transformed notes.</p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-8 text-center bg-destructive/10 rounded-2xl border border-destructive/20 text-destructive">
          <p className="font-medium">Failed to load history.</p>
          <p className="text-sm mt-1 opacity-80">Please check your connection and try again.</p>
        </div>
      )}

      {data?.notes && data.notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <img 
            src={`${import.meta.env.BASE_URL}images/empty-history.png`} 
            alt="Empty desk with notebook" 
            className="w-64 h-64 object-cover mb-8 rounded-full shadow-2xl shadow-primary/5"
          />
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">No notes yet</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't processed any notes yet. Upload your first photo to start transforming your study material.
          </p>
          <Link href="/">
            <Button size="lg" variant="accent">Upload a Note</Button>
          </Link>
        </div>
      )}

      {data?.notes && data.notes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.notes.map((note) => (
            <Link key={note.id} href={`/note/${note.id}`} className="group block">
              <Card className="h-full flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-accent/40 cursor-pointer overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <Badge variant="outline" className={`capitalize ${getModeColor(note.mode)}`}>
                      {getModeIcon(note.mode)}
                      {note.mode}
                    </Badge>
                    <button 
                      onClick={(e) => handleDelete(e, note.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CardTitle className="line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {note.title || "Untitled Note"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {note.extractedText || "No text extracted."}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 bg-secondary/20 flex justify-between items-center text-xs font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    {format(new Date(note.createdAt), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    View <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
