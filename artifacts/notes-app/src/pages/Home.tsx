import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, FileText, ListTree, HelpCircle, Sparkles,
  Image as ImageIcon, X, ArrowRight, Loader2, Camera,
  RefreshCw, ZapIcon, ClipboardPaste, AlertCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProcessNoteMutation, useProcessNoteTextMutation } from "@/hooks/use-notes";
import { ProcessNoteRequestMode } from "@workspace/api-client-react";

const MODES = [
  {
    id: ProcessNoteRequestMode.simplify,
    title: "Simplify",
    description: "Distill complex notes into clear, easy-to-read bullet points.",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: ProcessNoteRequestMode.organize,
    title: "Organize",
    description: "Structure your thoughts into logical sections and headings.",
    icon: ListTree,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: ProcessNoteRequestMode.quiz,
    title: "Quiz Me",
    description: "Generate practice questions based on your material.",
    icon: HelpCircle,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

type InputTab = "upload" | "camera" | "text";

export default function Home() {
  const [, setLocation] = useLocation();
  const [inputTab, setInputTab] = useState<InputTab>("upload");
  const [mode, setMode] = useState<typeof ProcessNoteRequestMode[keyof typeof ProcessNoteRequestMode]>(ProcessNoteRequestMode.simplify);
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Image state (upload + camera)
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  // Text state
  const [pastedText, setPastedText] = useState("");

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const processMutation = useProcessNoteMutation();
  const processTextMutation = useProcessNoteTextMutation();

  const hasImage = !!preview;
  const hasText = pastedText.trim().length > 0;
  const canProcess = (inputTab === "text" ? hasText : hasImage);

  const clearImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPreview(null);
    setCapturedBlob(null);
  };

  // --- Upload tab ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      setCapturedBlob(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: hasImage,
  });

  // --- Camera tab ---
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setCameraError(
        msg.includes("Permission") || msg.includes("NotAllowed")
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : "Could not start camera. Make sure your device has a camera."
      );
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const flipCamera = useCallback(() => {
    stopCamera();
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  }, [stopCamera]);

  useEffect(() => {
    if (inputTab === "camera" && !hasImage) startCamera();
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setPreview(URL.createObjectURL(blob));
      setCapturedBlob(blob);
      if (!title) setTitle(`Camera Note - ${new Date().toLocaleDateString()}`);
      stopCamera();
    }, "image/jpeg", 0.95);
  }, [title, stopCamera]);

  const switchTab = (tab: InputTab) => {
    if (tab === inputTab) return;
    clearImage();
    stopCamera();
    setInputTab(tab);
    if (tab === "camera") startCamera();
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  // --- Process ---
  const handleProcess = () => {
    setIsProcessing(true);

    if (inputTab === "text") {
      processTextMutation.mutate(
        { text: pastedText, mode, title: title || "Untitled Note" },
        {
          onSuccess: (data) => setLocation(`/note/${data.id}`),
          onError: () => setIsProcessing(false),
        }
      );
      return;
    }

    if (!preview || !capturedBlob) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      const mimeType = capturedBlob instanceof File ? capturedBlob.type : "image/jpeg";
      processMutation.mutate(
        { imageBase64: base64, mimeType, mode, title: title || "Untitled Note" },
        {
          onSuccess: (data) => setLocation(`/note/${data.id}`),
          onError: () => setIsProcessing(false),
        }
      );
    };
    reader.readAsDataURL(capturedBlob);
  };

  const TABS: { id: InputTab; label: string; icon: typeof UploadCloud }[] = [
    { id: "upload", label: "Upload Photo", icon: UploadCloud },
    { id: "camera", label: "Use Camera", icon: Camera },
    { id: "text", label: "Paste Text", icon: ClipboardPaste },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="" className="w-full h-full object-cover opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-6 mx-auto bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
            <Sparkles className="h-3 w-3 mr-1.5" /> Note Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Transform your notes <br /> into <span className="text-accent italic">understanding.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Upload a photo, use your camera, or paste text. AI will simplify, organize, or quiz you instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tab toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-xl w-fit">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => switchTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    inputTab === id
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            {/* Input area */}
            <Card className="overflow-hidden border-2 border-border/60 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-1">
                <AnimatePresence mode="wait">

                  {/* UPLOAD TAB */}
                  {inputTab === "upload" && (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div
                        {...getRootProps()}
                        className={`relative flex flex-col items-center justify-center w-full aspect-video min-h-[320px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                          isDragActive ? "border-accent bg-accent/5"
                          : hasImage ? "border-transparent cursor-default"
                          : "border-border hover:border-accent/50 hover:bg-secondary/50"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <AnimatePresence mode="wait">
                          {hasImage ? (
                            <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 group">
                              <img src={preview!} alt="Note preview" className="w-full h-full object-cover rounded-lg" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="destructive" size="sm" onClick={clearImage} className="rounded-full shadow-xl">
                                  <X className="h-4 w-4 mr-2" /> Remove Image
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                <UploadCloud className="h-10 w-10 text-primary/40" />
                              </div>
                              <h3 className="text-xl font-medium text-foreground mb-2">Upload Note Image</h3>
                              <p className="text-sm text-muted-foreground max-w-sm mb-6">Drag and drop an image of your notes here, or click to browse.</p>
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60">
                                <ImageIcon className="h-4 w-4" /> Supports JPG, PNG, WEBP
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* CAMERA TAB */}
                  {inputTab === "camera" && (
                    <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="relative w-full aspect-video min-h-[320px] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        <canvas ref={canvasRef} className="hidden" />
                        <AnimatePresence mode="wait">
                          {hasImage ? (
                            <motion.div key="captured" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 group">
                              <img src={preview!} alt="Captured note" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button variant="secondary" size="sm" onClick={() => { clearImage(); startCamera(); }} className="rounded-full shadow-xl">
                                  <RefreshCw className="h-4 w-4 mr-2" /> Retake
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => { clearImage(); startCamera(); }} className="rounded-full shadow-xl">
                                  <X className="h-4 w-4 mr-2" /> Remove
                                </Button>
                              </div>
                            </motion.div>
                          ) : cameraError ? (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-destructive/60" />
                              </div>
                              <p className="text-sm text-muted-foreground max-w-xs mb-4">{cameraError}</p>
                              <Button variant="outline" size="sm" onClick={startCamera}>
                                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                              </Button>
                            </motion.div>
                          ) : cameraActive ? (
                            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                              <div className="absolute inset-4 pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/70 rounded-tl" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/70 rounded-tr" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/70 rounded-bl" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/70 rounded-br" />
                              </div>
                              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                                <button onClick={flipCamera} title="Flip camera" className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button onClick={capturePhoto} className="h-16 w-16 rounded-full bg-white border-4 border-white/30 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                                  <div className="h-12 w-12 rounded-full bg-white border-2 border-gray-200" />
                                </button>
                                <div className="h-10 w-10" />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 text-white/60">
                              <Loader2 className="h-8 w-8 animate-spin" />
                              <p className="text-sm">Starting camera…</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {cameraActive && !hasImage && (
                        <p className="text-center text-xs text-muted-foreground mt-2 pb-1">
                          Position your notes clearly, then press the white button to capture.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* PASTE TEXT TAB */}
                  {inputTab === "text" && (
                    <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="relative w-full min-h-[320px] rounded-xl overflow-hidden">
                        <textarea
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                          placeholder="Paste or type your notes here…&#10;&#10;You can paste directly from your clipboard using Ctrl+V (or ⌘+V on Mac)."
                          className="w-full min-h-[320px] resize-none rounded-xl border-0 bg-secondary/30 p-5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow font-mono"
                          spellCheck={false}
                        />
                        {pastedText.length > 0 && (
                          <button
                            onClick={() => setPastedText("")}
                            className="absolute top-3 right-3 h-7 w-7 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {pastedText.length === 0 && (
                          <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs text-muted-foreground/40 pointer-events-none">
                            <ClipboardPaste className="h-4 w-4" />
                            <span>Ctrl+V / ⌘+V to paste</span>
                          </div>
                        )}
                      </div>
                      {pastedText.length > 0 && (
                        <p className="text-right text-xs text-muted-foreground pr-1 pt-1">
                          {pastedText.trim().split(/\s+/).filter(Boolean).length} words
                        </p>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Title input */}
            <AnimatePresence>
              {canProcess && (
                <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">Note Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Biology Chapter 4"
                      className="text-lg py-6"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Mode + Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground ml-1">Choose Processing Mode</label>
              <div className="grid gap-3">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`relative flex items-start p-4 w-full rounded-xl border-2 text-left transition-all duration-200 ${
                        isActive
                          ? "border-accent bg-accent/5 shadow-md shadow-accent/5"
                          : "border-border bg-card hover:border-accent/40 hover:bg-secondary/30"
                      }`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${isActive ? m.bg : "bg-secondary"} ${isActive ? m.color : "text-muted-foreground"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isActive ? "text-foreground" : "text-foreground/80"}`}>{m.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">{m.description}</p>
                      </div>
                      {isActive && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-accent animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              size="lg"
              variant="accent"
              className="w-full h-16 text-lg"
              disabled={!canProcess || isProcessing}
              onClick={handleProcess}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Analyzing Note…
                </>
              ) : (
                <>
                  <ZapIcon className="mr-2 h-5 w-5" />
                  Transform Note <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="text-center text-sm text-muted-foreground animate-pulse">
                {inputTab === "text" ? "Processing your notes with AI…" : "Applying advanced AI vision to read your handwriting…"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
