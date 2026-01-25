export interface RaffleEntry {
  seller: string;
  firstName: string;
  lastName: string;
  ticketCount: number;
  ticketNumbers: string[];
}

export const defaultRaffleData: RaffleEntry[] = [
  { seller: "John Smith", firstName: "John", lastName: "Smith", ticketCount: 5, ticketNumbers: ["1001", "1002", "1003", "1004", "1005"] },
  { seller: "Mary Johnson", firstName: "Mary", lastName: "Johnson", ticketCount: 10, ticketNumbers: ["1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018"] },
  { seller: "Sarah Williams", firstName: "Sarah", lastName: "Williams", ticketCount: 2, ticketNumbers: ["1019", "1020"] },
  { seller: "Michael Brown", firstName: "Michael", lastName: "Brown", ticketCount: 7, ticketNumbers: ["1021", "1022", "1023", "1024", "1025", "1026", "1027"] },
  { seller: "Emily Jones", firstName: "Emily", lastName: "Jones", ticketCount: 4, ticketNumbers: ["1028", "1029", "1030", "1031"] },
  { seller: "Carlos Garcia", firstName: "Carlos", lastName: "Garcia", ticketCount: 6, ticketNumbers: ["1032", "1033", "1034", "1035", "1036", "1037"] },
];

export async function fetchFromGoogleSheet(publishedUrl: string): Promise<{ data: RaffleEntry[]; error?: string }> {
  try {
    const csvUrl = convertToCSVUrl(publishedUrl);
    
    const corsProxies = [
      (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];
    
    let lastError = "";
    
    for (const proxyFn of corsProxies) {
      try {
        const proxiedUrl = proxyFn(csvUrl);
        const response = await fetch(proxiedUrl);
        
        if (!response.ok) {
          lastError = `HTTP ${response.status}`;
          continue;
        }
        
        const text = await response.text();
        
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          lastError = "Received HTML instead of CSV data";
          continue;
        }
        
        const parsed = parseCSV(text);
        
        if (parsed.length === 0) {
          lastError = "No valid data found. Check the sheet format (Ticket Number, Seller columns).";
          continue;
        }
        
        return { data: parsed };
      } catch {
        lastError = "Network error";
        continue;
      }
    }
    
    return { data: [], error: lastError || "Failed to fetch data. Make sure the sheet is published to the web as CSV." };
  } catch {
    return { data: [], error: "Network error. Check the URL and try again." };
  }
}

function convertToCSVUrl(url: string): string {
  if (url.includes('/pub?') && url.includes('output=csv')) {
    return url;
  }
  
  if (url.includes('/pub?')) {
    if (!url.includes('output=')) {
      return url + '&output=csv';
    }
    return url.replace(/output=\w+/, 'output=csv');
  }
  
  const spreadsheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (spreadsheetIdMatch) {
    const spreadsheetId = spreadsheetIdMatch[1];
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/pub?output=csv&gid=${gid}`;
  }
  
  return url;
}

export function searchBySeller(data: RaffleEntry[], query: string): RaffleEntry[] {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return data.filter(entry => 
    (entry.seller || '').toLowerCase().includes(normalizedQuery) ||
    (entry.firstName || '').toLowerCase().includes(normalizedQuery) ||
    (entry.lastName || '').toLowerCase().includes(normalizedQuery)
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
  const sellerIdx = headers.findIndex(h => h.includes('seller') || h.includes('last'));
  const firstNameIdx = headers.findIndex(h => h.includes('first'));

  if (ticketNumberIdx === -1 && sellerIdx === -1) {
    if (headers.length >= 2) {
      return parseWithPositionalColumns(lines, 0, 1, -1);
    }
    return [];
  }

  const actualTicketIdx = ticketNumberIdx >= 0 ? ticketNumberIdx : 0;
  const actualSellerIdx = sellerIdx >= 0 ? sellerIdx : 1;
  const actualFirstNameIdx = firstNameIdx >= 0 ? firstNameIdx : -1;

  return parseWithPositionalColumns(lines, actualTicketIdx, actualSellerIdx, actualFirstNameIdx);
}

function parseWithPositionalColumns(lines: string[], ticketIdx: number, sellerIdx: number, firstNameIdx: number): RaffleEntry[] {
  const sellerMap = new Map<string, { firstName: string; lastName: string; ticketNumbers: string[] }>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    const ticketNumber = values[ticketIdx] || '';
    const lastName = (values[sellerIdx] || '').trim();
    const firstName = firstNameIdx >= 0 ? (values[firstNameIdx] || '').trim() : '';

    if (!lastName) continue;

    const fullName = firstName ? `${firstName} ${lastName}` : lastName;
    const key = fullName.toLowerCase();
    
    if (sellerMap.has(key)) {
      const existing = sellerMap.get(key)!;
      if (ticketNumber) {
        existing.ticketNumbers.push(ticketNumber);
      }
    } else {
      sellerMap.set(key, {
        firstName,
        lastName,
        ticketNumbers: ticketNumber ? [ticketNumber] : [],
      });
    }
  }

  const entries: RaffleEntry[] = [];
  sellerMap.forEach((value) => {
    const fullName = value.firstName ? `${value.firstName} ${value.lastName}` : value.lastName;
    entries.push({
      seller: fullName,
      firstName: value.firstName,
      lastName: value.lastName,
      ticketCount: value.ticketNumbers.length,
      ticketNumbers: value.ticketNumbers.sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
      }),
    });
  });

  return entries.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
}
