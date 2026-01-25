/**
 * Google Sheets Service
 * Fetches data from a publicly shared Google Sheet using the CSV export URL
 */

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName?: string;
}

/**
 * Extracts the spreadsheet ID from various Google Sheets URL formats
 */
export function extractSpreadsheetId(url: string): string | null {
  // Handle full URLs like: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
  const urlMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];
  
  // Handle just the ID
  if (/^[a-zA-Z0-9-_]+$/.test(url)) return url;
  
  return null;
}

/**
 * Builds the CSV export URL for a Google Sheet
 */
export function buildCsvExportUrl(spreadsheetId: string, gid: string = '0'): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Fetches data from a Google Sheet as CSV
 */
export async function fetchGoogleSheetData(config: GoogleSheetsConfig): Promise<string> {
  const { spreadsheetId } = config;
  
  // For now, we'll use gid=0 (first sheet). Can be enhanced to support specific sheets
  const url = buildCsvExportUrl(spreadsheetId, '0');
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }
    
    const csvData = await response.text();
    return csvData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching Google Sheet: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validates if a Google Sheet is accessible
 */
export async function validateGoogleSheetAccess(spreadsheetId: string): Promise<boolean> {
  try {
    const url = buildCsvExportUrl(spreadsheetId, '0');
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
