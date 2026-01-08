export interface RaffleEntry {
  lastName: string;
  firstName: string;
  ticketCount: number;
  ticketNumbers?: string;
}

export const raffleData: RaffleEntry[] = [
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

export function searchByLastName(query: string): RaffleEntry[] {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return raffleData.filter(entry => 
    entry.lastName.toLowerCase().includes(normalizedQuery)
  );
}

export function getTotalTickets(entries: RaffleEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.ticketCount, 0);
}
