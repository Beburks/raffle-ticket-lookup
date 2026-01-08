import { useState, useRef } from "react";
import { useKV } from "@github/spark/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Ticket, Confetti, UploadSimple, X, FileText } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { searchByLastName, getTotalTickets, parseCSV, defaultRaffleData, type RaffleEntry } from "@/lib/raffleData";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<RaffleEntry[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [raffleData, setRaffleData] = useKV<RaffleEntry[]>("raffle-data", defaultRaffleData);
  const [lastUpdated, setLastUpdated] = useKV<string>("raffle-last-updated", new Date().toLocaleDateString());

  const currentData = raffleData ?? defaultRaffleData;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const found = searchByLastName(currentData, searchQuery);
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
      toast.success(`Loaded ${parsed.length} entries from CSV`);
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-accent blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-secondary blur-2xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Ticket className="text-primary" size={40} weight="duotone" />
            <h1 className="font-display text-4xl font-bold text-foreground">
              2026 Cash Raffle
            </h1>
            <Ticket className="text-primary" size={40} weight="duotone" />
          </div>
          <p className="text-muted-foreground font-body text-lg">
            Look up your family's raffle tickets
          </p>
        </motion.div>

        <Card className="shadow-xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label htmlFor="last-name" className="font-body font-medium text-sm text-foreground">
                  Enter Your Last Name
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
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
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
                      <FileText className="mx-auto text-muted-foreground mb-2" size={32} />
                      <p className="font-body text-sm text-muted-foreground">
                        Drag & drop a CSV file here, or click to browse
                      </p>
                      <p className="font-body text-xs text-muted-foreground/70 mt-1">
                        Expected columns: Last Name, First Name, Ticket Count
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUpload(false);
                      }}
                      className="mt-2 text-muted-foreground"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <Input
                  id="last-name"
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
                  className="h-12 px-6 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-400 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <MagnifyingGlass size={20} weight="bold" className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {results && results.length > 0 ? (
                <Card className="shadow-xl border-2 border-accent/30 bg-gradient-to-br from-card to-accent/5">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Confetti className="text-primary" size={28} weight="duotone" />
                        <span className="font-body text-muted-foreground">Total Tickets</span>
                        <Confetti className="text-primary" size={28} weight="duotone" />
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
                        ticket{totalTickets !== 1 ? "s" : ""} sold for "{searchQuery}"
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="font-body font-medium text-sm text-muted-foreground mb-3">
                        Breakdown by Seller
                      </p>
                      <div className="space-y-2">
                        {results.map((entry, index) => (
                          <motion.div
                            key={`${entry.lastName}-${entry.firstName}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <Ticket className="text-accent" size={20} weight="fill" />
                              <span className="font-body text-foreground">
                                {entry.firstName} {entry.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-semibold text-lg text-primary">
                                {entry.ticketCount}
                              </span>
                              {entry.ticketNumbers && (
                                <span className="text-xs text-muted-foreground font-body">
                                  ({entry.ticketNumbers})
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
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

        <p className="text-center text-xs text-muted-foreground mt-8 font-body">
          Data last updated: {lastUpdated} • {currentData.length} entries loaded
        </p>
      </div>
    </div>
  );
}

export default App;
