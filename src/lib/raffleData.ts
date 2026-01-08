export interface RaffleEntry {
  seller: string;
  ticketCount: number;
  ticketNumbers: string[];
}

export const defaultRaffleData: RaffleEntry[] = [
  { seller: "Smith", ticketCount: 5, ticketNumbers: ["1001", "1002", "1003", "1004", "1005"] },
  { seller: "Johnson", ticketCount: 10, ticketNumbers: ["1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018"] },
  { seller: "Williams", ticketCount: 2, ticketNumbers: ["1019", "1020"] },
  { seller: "Brown", ticketCount: 7, ticketNumbers: ["1021", "1022", "1023", "1024", "1025", "1026", "1027"] },
  { seller: "Jones", ticketCount: 4, ticketNumbers: ["1028", "1029", "1030", "1031"] },
  { seller: "Garcia", ticketCount: 6, ticketNumbers: ["1032", "1033", "1034", "1035", "1036", "1037"] },
];

export function searchBySeller(data: RaffleEntry[], query: string): RaffleEntry[] {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return data.filter(entry => 
    entry.seller.toLowerCase().includes(normalizedQuery)
  );
}

export function getTotalTickets(entries: RaffleEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.ticketCount, 0);
}

export function parseCSV(csvText: string): RaffleEntry[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  
  const ticketNumberIdx = headers.findIndex(h => h.includes('ticket') && h.includes('number'));
  const sellerIdx = headers.findIndex(h => h.includes('seller'));

  if (ticketNumberIdx === -1 && sellerIdx === -1) {
    if (headers.length >= 2) {
      return parseWithPositionalColumns(lines, 0, 1);
    }
    return [];
  }

  const actualTicketIdx = ticketNumberIdx >= 0 ? ticketNumberIdx : 0;
  const actualSellerIdx = sellerIdx >= 0 ? sellerIdx : 1;

  return parseWithPositionalColumns(lines, actualTicketIdx, actualSellerIdx);
}

function parseWithPositionalColumns(lines: string[], ticketIdx: number, sellerIdx: number): RaffleEntry[] {
  const sellerMap = new Map<string, { ticketNumbers: string[] }>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    const ticketNumber = values[ticketIdx] || '';
    const seller = values[sellerIdx] || '';

    if (!seller) continue;

    const normalizedSeller = seller.trim();
    
    if (sellerMap.has(normalizedSeller)) {
      const existing = sellerMap.get(normalizedSeller)!;
      if (ticketNumber) {
        existing.ticketNumbers.push(ticketNumber);
      }
    } else {
      sellerMap.set(normalizedSeller, {
        ticketNumbers: ticketNumber ? [ticketNumber] : [],
      });
    }
  }

  const entries: RaffleEntry[] = [];
  sellerMap.forEach((value, seller) => {
    entries.push({
      seller,
      ticketCount: value.ticketNumbers.length,
      ticketNumbers: value.ticketNumbers.sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
      }),
    });
  });

  return entries.sort((a, b) => a.seller.localeCompare(b.seller));
}
