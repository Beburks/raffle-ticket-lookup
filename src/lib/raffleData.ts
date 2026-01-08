export interface RaffleEntry {
  lastName: string;
  firstName: string;
  ticketCount: number;
  ticketNumbers?: string;
}

export const defaultRaffleData: RaffleEntry[] = [
  { lastName: "Smith", firstName: "John", ticketCount: 5, ticketNumbers: "1001-1005" },
  { lastName: "Smith", firstName: "Sarah", ticketCount: 3, ticketNumbers: "1006-1008" },
  { lastName: "Johnson", firstName: "Mike", ticketCount: 10, ticketNumbers: "1009-1018" },
  { lastName: "Williams", firstName: "Emily", ticketCount: 2, ticketNumbers: "1019-1020" },
  { lastName: "Brown", firstName: "David", ticketCount: 7, ticketNumbers: "1021-1027" },
  { lastName: "Jones", firstName: "Lisa", ticketCount: 4, ticketNumbers: "1028-1031" },
  { lastName: "Garcia", firstName: "Carlos", ticketCount: 6, ticketNumbers: "1032-1037" },
  { lastName: "Martinez", firstName: "Ana", ticketCount: 8, ticketNumbers: "1038-1045" },
  { lastName: "Davis", firstName: "Robert", ticketCount: 5, ticketNumbers: "1046-1050" },
  { lastName: "Rodriguez", firstName: "Maria", ticketCount: 3, ticketNumbers: "1051-1053" },
];

export function searchByLastName(data: RaffleEntry[], query: string): RaffleEntry[] {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return data.filter(entry => 
    entry.lastName.toLowerCase().includes(normalizedQuery)
  );
}

export function getTotalTickets(entries: RaffleEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.ticketCount, 0);
}

export function parseCSV(csvText: string): RaffleEntry[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  
  const lastNameIdx = headers.findIndex(h => h.includes('last') || h === 'lastname');
  const firstNameIdx = headers.findIndex(h => h.includes('first') || h === 'firstname');
  const ticketCountIdx = headers.findIndex(h => h.includes('count') || h.includes('ticket') || h.includes('qty') || h.includes('quantity'));
  const ticketNumbersIdx = headers.findIndex(h => h.includes('number') && !h.includes('count'));

  const entries: RaffleEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    const lastName = lastNameIdx >= 0 ? values[lastNameIdx] || '' : '';
    const firstName = firstNameIdx >= 0 ? values[firstNameIdx] || '' : '';
    const ticketCount = ticketCountIdx >= 0 ? parseInt(values[ticketCountIdx]) || 0 : 0;
    const ticketNumbers = ticketNumbersIdx >= 0 ? values[ticketNumbersIdx] : undefined;

    if (lastName || firstName) {
      entries.push({
        lastName,
        firstName,
        ticketCount,
        ticketNumbers: ticketNumbers || undefined,
      });
    }
  }

  return entries;
}
