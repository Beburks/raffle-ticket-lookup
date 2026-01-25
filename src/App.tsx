import { useState, useRef, useEffect, useCallback } from "react";
import { useKV } from "@github/spark/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Ticket, Anchor, UploadSimple, X, FileText, Compass, Lifebuoy, Link, ArrowsClockwise, Check, Warning } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchBySeller, getTotalTickets, parseCSV, fetchFromGoogleSheet, defaultRaffleData, type RaffleEntry } from "@/lib/raffleData";

function Seagull({ delay, startX, startY }: { delay: number; startX: number; startY: number }) {
  return (
    <motion.svg
      viewBox="0 0 60 30"
      className="absolute w-10 h-5 md:w-12 md:h-6"
      style={{ top: startY }}
      initial={{ x: startX }}
      animate={{ 
        x: [startX, startX + 400, startX + 800],
        y: [startY, startY - 15, startY + 10, startY - 5, startY]
      }}
      transition={{ 
        x: { duration: 20 + delay * 2, repeat: Infinity, ease: "linear" },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <motion.path
        d="M5,15 Q15,5 30,15 Q45,5 55,15"
        fill="none"
        stroke="oklch(0.3 0.02 240)"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ d: ["M5,15 Q15,5 30,15 Q45,5 55,15", "M5,15 Q15,20 30,15 Q45,20 55,15", "M5,15 Q15,5 30,15 Q45,5 55,15"] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="30" cy="16" r="3" fill="oklch(0.3 0.02 240)" />
      <polygon points="24,16 20,15 24,17" fill="oklch(0.65 0.15 50)" />
    </motion.svg>
  );
}



function AnimatedWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-32"
        preserveAspectRatio="none"
        animate={{ x: [0, -100, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1350,50 1440,100 L1440,200 L0,200 Z"
          fill="oklch(0.55 0.15 220)"
          opacity="0.6"
        />
      </motion.svg>
      
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-28"
        preserveAspectRatio="none"
        animate={{ x: [0, 80, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,120 C200,80 400,160 600,120 C800,80 1000,160 1200,120 C1350,90 1400,140 1440,120 L1440,200 L0,200 Z"
          fill="oklch(0.45 0.12 220)"
          opacity="0.7"
        />
      </motion.svg>
      
      <motion.svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-24"
        preserveAspectRatio="none"
        animate={{ x: [0, -60, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,140 C180,180 360,120 540,150 C720,180 900,120 1080,150 C1260,180 1350,130 1440,150 L1440,200 L0,200 Z"
          fill="oklch(0.35 0.1 220)"
          opacity="0.85"
        />
      </motion.svg>

      <Fish delay={0} startX={-50} y={130} />
      <Fish delay={2} startX={-80} y={150} direction={-1} />
      <Fish delay={4} startX={-30} y={165} />
      <Fish delay={1.5} startX={-100} y={140} />
      <Fish delay={3} startX={-60} y={175} direction={-1} />
    </div>
  );
}

function Fish({ delay, startX, y, direction = 1 }: { delay: number; startX: number; y: number; direction?: number }) {
  const fishColors = [
    "oklch(0.7 0.15 40)",
    "oklch(0.75 0.12 60)",
    "oklch(0.65 0.18 30)",
    "oklch(0.8 0.1 180)",
  ];
  const color = fishColors[Math.floor(Math.random() * fishColors.length)];
  
  return (
    <motion.svg
      viewBox="0 0 40 20"
      className="absolute w-8 h-4"
      style={{ top: y, transform: direction === -1 ? "scaleX(-1)" : "none" }}
      initial={{ x: direction === 1 ? startX : window.innerWidth + Math.abs(startX) }}
      animate={{ 
        x: direction === 1 ? window.innerWidth + 100 : -100,
        y: [y, y - 8, y, y + 8, y]
      }}
      transition={{ 
        x: { duration: 12 + delay, repeat: Infinity, delay, ease: "linear" },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <ellipse cx="18" cy="10" rx="14" ry="7" fill={color} />
      <polygon points="32,10 40,3 40,17" fill={color} />
      <polygon points="15,5 20,2 22,6" fill={color} opacity="0.7" />
      <circle cx="8" cy="9" r="2" fill="oklch(0.2 0 0)" />
      <circle cx="7" cy="8" r="0.8" fill="oklch(1 0 0)" />
    </motion.svg>
  );
}

function RopeCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none" preserveAspectRatio="none">
        <defs>
          <pattern id="ropePattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(0)">
            <path
              d="M0,10 Q5,5 10,10 Q15,15 20,10"
              fill="none"
              stroke="oklch(0.6 0.1 70)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M0,10 Q5,15 10,10 Q15,5 20,10"
              fill="none"
              stroke="oklch(0.5 0.08 60)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect
          x="6"
          y="6"
          width="calc(100% - 12px)"
          height="calc(100% - 12px)"
          rx="16"
          ry="16"
          fill="none"
          stroke="url(#ropePattern)"
          strokeWidth="8"
        />
      </svg>
      
      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.7_0.1_70)] to-[oklch(0.5_0.08_60)] border-2 border-[oklch(0.45_0.08_60)] shadow-md z-10" />
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.7_0.1_70)] to-[oklch(0.5_0.08_60)] border-2 border-[oklch(0.45_0.08_60)] shadow-md z-10" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.7_0.1_70)] to-[oklch(0.5_0.08_60)] border-2 border-[oklch(0.45_0.08_60)] shadow-md z-10" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.7_0.1_70)] to-[oklch(0.5_0.08_60)] border-2 border-[oklch(0.45_0.08_60)] shadow-md z-10" />
      
      {children}
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<RaffleEntry[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [raffleData, setRaffleData] = useKV<RaffleEntry[]>("raffle-data", defaultRaffleData);
  const [lastUpdated, setLastUpdated] = useKV<string>("raffle-last-updated", new Date().toLocaleDateString());
  const [googleSheetUrl, setGoogleSheetUrl] = useKV<string>("google-sheet-url", "");
  const [dataSource, setDataSource] = useKV<"csv" | "google">("data-source", "csv");

  const currentData = raffleData ?? defaultRaffleData;

  const refreshFromGoogleSheet = useCallback(async (url?: string) => {
    const sheetUrl = url || googleSheetUrl;
    if (!sheetUrl) return;
    
    setIsRefreshing(true);
    const result = await fetchFromGoogleSheet(sheetUrl);
    setIsRefreshing(false);
    
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    
    setRaffleData(result.data);
    setLastUpdated(new Date().toLocaleString());
    setHasSearched(false);
    setResults(null);
    setSearchQuery("");
    toast.success(`Synced ${getTotalTickets(result.data)} tickets from ${result.data.length} sellers`);
    return true;
  }, [googleSheetUrl, setRaffleData, setLastUpdated]);

  useEffect(() => {
    if (dataSource === "google" && googleSheetUrl) {
      refreshFromGoogleSheet();
    }
  }, []);

  const handleConnectGoogleSheet = async () => {
    if (!sheetUrlInput.trim()) {
      toast.error("Please enter a Google Sheets URL");
      return;
    }
    
    const success = await refreshFromGoogleSheet(sheetUrlInput);
    if (success) {
      setGoogleSheetUrl(sheetUrlInput);
      setDataSource("google");
      setShowUpload(false);
    }
  };

  const handleDisconnectGoogleSheet = () => {
    setGoogleSheetUrl("");
    setDataSource("csv");
    setSheetUrlInput("");
    toast.success("Disconnected from Google Sheets");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const found = searchBySeller(currentData, searchQuery);
    setResults(found);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      
      if (parsed.length === 0) {
        toast.error("No valid data found in CSV");
        return;
      }

      setRaffleData(parsed);
      setLastUpdated(new Date().toLocaleDateString());
      setShowUpload(false);
      setHasSearched(false);
      setResults(null);
      setSearchQuery("");
      toast.success(`Loaded ${getTotalTickets(parsed)} tickets from ${parsed.length} sellers`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const totalTickets = results ? getTotalTickets(results) : 0;

  const [expandedSellers, setExpandedSellers] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedSellers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--color-ocean)] opacity-15 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full bg-[var(--color-seafoam)] opacity-20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-[var(--color-sand)] opacity-25 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/5 w-24 h-24 rounded-full bg-[var(--color-coral)] opacity-15 blur-2xl" />
      </div>

      <Seagull delay={0} startX={100} startY={40} />
      <Seagull delay={3} startX={-50} startY={80} />
      <Seagull delay={6} startX={200} startY={60} />
      <Seagull delay={9} startX={50} startY={100} />
      <Seagull delay={12} startX={150} startY={30} />

      <motion.div 
        className="absolute top-8 left-8 text-[var(--color-ocean)] opacity-20"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Anchor size={48} weight="duotone" />
      </motion.div>
      <motion.div 
        className="absolute top-12 right-12 text-[var(--color-seafoam)] opacity-20"
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Compass size={40} weight="duotone" />
      </motion.div>
      <motion.div 
        className="absolute bottom-44 right-16 text-[var(--color-coral)] opacity-20"
        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lifebuoy size={44} weight="duotone" />
      </motion.div>

      <AnimatedWaves />

      <div className="w-full max-w-lg relative z-10 mb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Anchor className="text-primary" size={36} weight="duotone" />
            <h1 className="font-display text-4xl font-bold text-[var(--color-navy)]">
              2026 Cash Raffle
            </h1>
            <Anchor className="text-primary" size={36} weight="duotone" />
          </div>
          <p className="text-muted-foreground font-body text-lg">
            Look up your raffle tickets by seller name
          </p>
        </motion.div>

        <RopeCard>
          <Card className="shadow-xl border-2 border-[var(--color-ocean)]/30 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="seller-name" className="font-body font-medium text-sm text-foreground">
                    Enter Seller Name
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUpload(!showUpload)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <UploadSimple size={18} weight="bold" className="mr-1" />
                    Update Data
                  </Button>
                </div>

                <AnimatePresence>
                  {showUpload && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Tabs defaultValue={dataSource === "google" ? "google" : "csv"} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="csv" className="flex items-center gap-2">
                            <FileText size={16} />
                            CSV Upload
                          </TabsTrigger>
                          <TabsTrigger value="google" className="flex items-center gap-2">
                            <Link size={16} />
                            Google Sheets
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="csv">
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                              isDragging
                                ? "border-primary bg-primary/10"
                                : "border-[var(--color-ocean)]/40 hover:border-primary/50 hover:bg-[var(--color-sand)]/30"
                            }`}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".csv"
                              onChange={handleFileChange}
                              className="hidden"
                              id="csv-upload"
                            />
                            <FileText className="mx-auto text-[var(--color-ocean)] mb-2" size={32} />
                            <p className="font-body text-sm text-muted-foreground">
                              Drag & drop a CSV file here, or click to browse
                            </p>
                            <p className="font-body text-xs text-muted-foreground/70 mt-1">
                              Expected columns: Ticket Number, Seller
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="google">
                          <div className="space-y-4">
                            {googleSheetUrl ? (
                              <div className="p-4 rounded-lg bg-[var(--color-seafoam)]/20 border border-[var(--color-seafoam)]/40">
                                <div className="flex items-center gap-2 text-[var(--color-navy)] mb-2">
                                  <Check size={20} weight="bold" />
                                  <span className="font-body font-medium">Connected to Google Sheets</span>
                                </div>
                                <p className="font-body text-xs text-muted-foreground truncate mb-3">
                                  {googleSheetUrl}
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => refreshFromGoogleSheet()}
                                    disabled={isRefreshing}
                                    size="sm"
                                    className="bg-[var(--color-ocean)] hover:bg-[var(--color-ocean)]/90"
                                  >
                                    <ArrowsClockwise size={16} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                                    {isRefreshing ? "Syncing..." : "Refresh Now"}
                                  </Button>
                                  <Button
                                    onClick={handleDisconnectGoogleSheet}
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive border-destructive/50 hover:bg-destructive/10"
                                  >
                                    <X size={16} className="mr-1" />
                                    Disconnect
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="p-3 rounded-lg bg-[var(--color-sand)]/50 border border-[var(--color-sand)]">
                                  <div className="flex items-start gap-2">
                                    <Warning size={18} className="text-[var(--color-rope)] mt-0.5 flex-shrink-0" />
                                    <div className="font-body text-xs text-muted-foreground">
                                      <p className="font-medium text-foreground mb-1">How to connect:</p>
                                      <ol className="list-decimal list-inside space-y-0.5">
                                        <li>Open your Google Sheet</li>
                                        <li>Go to File → Share → Publish to web</li>
                                        <li>Select the sheet tab and choose "Comma-separated values (.csv)"</li>
                                        <li>Click Publish, then copy the link below</li>
                                      </ol>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    id="google-sheet-url"
                                    type="url"
                                    placeholder="Paste Google Sheets URL here..."
                                    value={sheetUrlInput}
                                    onChange={(e) => setSheetUrlInput(e.target.value)}
                                    className="flex-1 text-sm"
                                  />
                                  <Button
                                    onClick={handleConnectGoogleSheet}
                                    disabled={!sheetUrlInput.trim() || isRefreshing}
                                    className="bg-[var(--color-navy)] hover:bg-[var(--color-navy)]/90"
                                  >
                                    {isRefreshing ? (
                                      <ArrowsClockwise size={18} className="animate-spin" />
                                    ) : (
                                      <Link size={18} />
                                    )}
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUpload(false);
                        }}
                        className="mt-3 text-muted-foreground"
                      >
                        <X size={16} className="mr-1" />
                        Close
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <Input
                    id="seller-name"
                    type="text"
                    placeholder="e.g., Smith"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 h-12 text-lg border-2 focus:border-primary focus:ring-primary"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-ocean)] hover:from-[var(--color-navy)]/90 hover:to-[var(--color-ocean)]/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <MagnifyingGlass size={20} weight="bold" className="mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RopeCard>

        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              {results && results.length > 0 ? (
                <Card className="shadow-xl border-2 border-[var(--color-seafoam)]/40 bg-gradient-to-br from-card to-[var(--color-seafoam)]/10">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Anchor className="text-[var(--color-ocean)]" size={28} weight="duotone" />
                        <span className="font-body text-muted-foreground">Total Tickets</span>
                        <Anchor className="text-[var(--color-ocean)]" size={28} weight="duotone" />
                      </div>
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <span className="font-display text-6xl font-bold text-primary">
                          {totalTickets}
                        </span>
                      </motion.div>
                      <p className="text-muted-foreground font-body mt-1">
                        ticket{totalTickets !== 1 ? "s" : ""} sold by "{searchQuery}"
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="font-body font-medium text-sm text-muted-foreground mb-3">
                        Breakdown by Seller
                      </p>
                      <div className="space-y-2">
                        {results.map((entry, index) => {
                          const key = `${entry.seller}-${index}`;
                          const isExpanded = expandedSellers.has(key);
                          return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-lg bg-[var(--color-sand)]/30 border border-[var(--color-ocean)]/20 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleExpanded(key)}
                              className="w-full flex items-center justify-between p-3 hover:bg-[var(--color-sand)]/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Ticket className="text-[var(--color-coral)]" size={20} weight="fill" />
                                <div className="flex flex-col text-left">
                                  <span className="font-body font-medium text-foreground">
                                    {entry.firstName} {entry.lastName}
                                  </span>
                                  <span className="font-body text-xs text-muted-foreground">
                                    {entry.ticketCount} ticket{entry.ticketCount !== 1 ? 's' : ''} • Click to {isExpanded ? 'collapse' : 'expand'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-semibold text-lg text-primary">
                                  {entry.ticketCount}
                                </span>
                                <motion.span
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-muted-foreground"
                                >
                                  ▼
                                </motion.span>
                              </div>
                            </button>
                            <AnimatePresence>
                              {isExpanded && entry.ticketNumbers.length > 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-[var(--color-ocean)]/20"
                                >
                                  <div className="p-3 bg-card/50">
                                    <p className="font-body text-xs text-muted-foreground mb-2">
                                      Individual tickets for {entry.firstName} {entry.lastName}:
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {entry.ticketNumbers.map((ticketNum) => (
                                        <div
                                          key={ticketNum}
                                          className="flex items-center gap-2 p-2 rounded-md bg-[var(--color-seafoam)]/20 border border-[var(--color-seafoam)]/30"
                                        >
                                          <Ticket className="text-[var(--color-ocean)] flex-shrink-0" size={14} weight="fill" />
                                          <div className="flex flex-col min-w-0">
                                            <span className="font-display font-semibold text-sm text-primary truncate">
                                              #{ticketNum}
                                            </span>
                                            <span className="font-body text-xs text-muted-foreground truncate">
                                              {entry.firstName} {entry.lastName}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );})}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-2 border-muted">
                  <CardContent className="p-6 text-center">
                    <MagnifyingGlass className="mx-auto text-muted-foreground mb-3" size={40} />
                    <p className="font-body text-lg text-foreground mb-1">
                      No tickets found for "{searchQuery}"
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      Please check the spelling and try again
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-xs text-muted-foreground mt-8 font-body space-y-1">
          <p>
            Data last updated: {lastUpdated} • {getTotalTickets(currentData)} tickets from {currentData.length} sellers
          </p>
          {dataSource === "google" && googleSheetUrl && (
            <button
              onClick={() => refreshFromGoogleSheet()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 text-[var(--color-ocean)] hover:text-[var(--color-navy)] transition-colors"
            >
              <ArrowsClockwise size={14} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Syncing..." : "Sync from Google Sheets"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
