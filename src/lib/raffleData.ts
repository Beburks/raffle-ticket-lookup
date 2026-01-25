export interface TicketDetail {
  ticketNumber: string;
  firstName: string;
  lastName: string;
}

export interface RaffleEntry {
  seller: string;
  ticketCount: number;
  tickets: TicketDetail[];
}

export const defaultRaffleData: RaffleEntry[] = [
  { 
    seller: "Smith", 
    ticketCount: 5, 
    tickets: [
      { ticketNumber: "1001", firstName: "John", lastName: "Smith" },
      { ticketNumber: "1002", firstName: "Jane", lastName: "Smith" },
      { ticketNumber: "1003", firstName: "John", lastName: "Smith" },
      { ticketNumber: "1004", firstName: "Jane", lastName: "Smith" },
      { ticketNumber: "1005", firstName: "John", lastName: "Smith" },
    ]
  },
  { 
    seller: "Johnson", 
    ticketCount: 10, 
    tickets: [
      { ticketNumber: "1009", firstName: "Mary", lastName: "Johnson" },
      { ticketNumber: "1010", firstName: "Mary", lastName: "Johnson" },
      { ticketNumber: "1011", firstName: "Tom", lastName: "Johnson" },
      { ticketNumber: "1012", firstName: "Tom", lastName: "Johnson" },
      { ticketNumber: "1013", firstName: "Mary", lastName: "Johnson" },
      { ticketNumber: "1014", firstName: "Tom", lastName: "Johnson" },
      { ticketNumber: "1015", firstName: "Mary", lastName: "Johnson" },
      { ticketNumber: "1016", firstName: "Tom", lastName: "Johnson" },
      { ticketNumber: "1017", firstName: "Mary", lastName: "Johnson" },
      { ticketNumber: "1018", firstName: "Tom", lastName: "Johnson" },
    ]
  },
  { 
    seller: "Williams", 
    ticketCount: 2, 
    tickets: [
      { ticketNumber: "1019", firstName: "Sarah", lastName: "Williams" },
      { ticketNumber: "1020", firstName: "Sarah", lastName: "Williams" },
    ]
  },
  { 
    seller: "Brown", 
    ticketCount: 7, 
    tickets: [
      { ticketNumber: "1021", firstName: "Michael", lastName: "Brown" },
      { ticketNumber: "1022", firstName: "Lisa", lastName: "Brown" },
      { ticketNumber: "1023", firstName: "Michael", lastName: "Brown" },
      { ticketNumber: "1024", firstName: "Lisa", lastName: "Brown" },
      { ticketNumber: "1025", firstName: "Michael", lastName: "Brown" },
      { ticketNumber: "1026", firstName: "Lisa", lastName: "Brown" },
      { ticketNumber: "1027", firstName: "Michael", lastName: "Brown" },
    ]
  },
  { 
    seller: "Jones", 
    ticketCount: 4, 
    tickets: [
      { ticketNumber: "1028", firstName: "Emily", lastName: "Jones" },
      { ticketNumber: "1029", firstName: "Emily", lastName: "Jones" },
      { ticketNumber: "1030", firstName: "Emily", lastName: "Jones" },
      { ticketNumber: "1031", firstName: "Emily", lastName: "Jones" },
    ]
  },
  { 
    seller: "Garcia", 
    ticketCount: 6, 
    tickets: [
      { ticketNumber: "1032", firstName: "Carlos", lastName: "Garcia" },
      { ticketNumber: "1033", firstName: "Maria", lastName: "Garcia" },
      { ticketNumber: "1034", firstName: "Carlos", lastName: "Garcia" },
      { ticketNumber: "1035", firstName: "Maria", lastName: "Garcia" },
      { ticketNumber: "1036", firstName: "Carlos", lastName: "Garcia" },
      { ticketNumber: "1037", firstName: "Maria", lastName: "Garcia" },
    ]
  },
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
    (entry.seller || '').toLowerCase().includes(normalizedQuery)
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
  const firstNameIdx = headers.findIndex(h => h.includes('first'));
  const lastNameIdx = headers.findIndex(h => h.includes('last'));

  if (ticketNumberIdx === -1 && sellerIdx === -1) {
    if (headers.length >= 2) {
      return parseWithPositionalColumns(lines, 0, 1, -1, -1);
    }
    return [];
  }

  const actualTicketIdx = ticketNumberIdx >= 0 ? ticketNumberIdx : 0;
  const actualSellerIdx = sellerIdx >= 0 ? sellerIdx : 1;
  const actualFirstNameIdx = firstNameIdx >= 0 ? firstNameIdx : -1;
  const actualLastNameIdx = lastNameIdx >= 0 ? lastNameIdx : -1;

  return parseWithPositionalColumns(lines, actualTicketIdx, actualSellerIdx, actualFirstNameIdx, actualLastNameIdx);
}

function parseWithPositionalColumns(lines: string[], ticketIdx: number, sellerIdx: number, firstNameIdx: number, lastNameIdx: number): RaffleEntry[] {
  const sellerMap = new Map<string, TicketDetail[]>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    const ticketNumber = values[ticketIdx] || '';
    const seller = (values[sellerIdx] || '').trim();
    const firstName = firstNameIdx >= 0 ? (values[firstNameIdx] || '').trim() : '';
    const lastName = lastNameIdx >= 0 ? (values[lastNameIdx] || '').trim() : '';

    if (!seller) continue;

    const key = seller.toLowerCase();
    
    const ticketDetail: TicketDetail = {
      ticketNumber,
      firstName,
      lastName,
    };
    
    if (sellerMap.has(key)) {
      const existing = sellerMap.get(key)!;
      if (ticketNumber) {
        existing.push(ticketDetail);
      }
    } else {
      sellerMap.set(key, ticketNumber ? [ticketDetail] : []);
    }
  }

  const entries: RaffleEntry[] = [];
  sellerMap.forEach((tickets, key) => {
    const sortedTickets = tickets.sort((a, b) => {
      const numA = parseInt(a.ticketNumber) || 0;
      const numB = parseInt(b.ticketNumber) || 0;
      return numA - numB;
    });
    
    entries.push({
      seller: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      ticketCount: sortedTickets.length,
      tickets: sortedTickets,
    });
  });

  return entries.sort((a, b) => a.seller.localeCompare(b.seller));
}
