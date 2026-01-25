# Raffle Ticket Lookup Application

A simple, user-friendly tool that allows participants to search by seller name and instantly see how many raffle tickets have been sold, with detailed ticket information including ticket number, first name, last name, and seller for each ticket.

**Experience Qualities**:
1. **Efficient** - Users get their ticket count in seconds with minimal input
2. **Trustworthy** - Clear display of accurate data builds confidence in the raffle system
3. **Celebratory** - The interface should feel exciting and rewarding, matching the hopeful spirit of a raffle

**Complexity Level**: Micro Tool (single-purpose application)
  - This is a focused search utility with a single input and display output

## Essential Features

### Seller Name Search
- **Functionality**: Text input that searches raffle ticket data by seller name (first or last name)
- **Purpose**: Allows sellers to quickly look up total tickets sold and view individual ticket details
- **Trigger**: User types the seller name and presses enter or clicks search
- **Progression**: Enter seller name → Click search/press enter → View total ticket count → Expand seller to see individual tickets
- **Success criteria**: Accurate match of seller names (case-insensitive) with correct ticket counts displayed

### Results Display
- **Functionality**: Shows total tickets sold for the searched seller with expandable details showing ticket number, first name, last name, and seller for each ticket
- **Purpose**: Provides clear, comprehensive feedback on tickets sold with full transparency
- **Trigger**: Successful search query
- **Progression**: Results appear → Total count prominently displayed → Click seller row to expand → View table with Ticket #, First Name, Last Name, Seller columns
- **Success criteria**: Results show within 200ms, count is accurate, all ticket details are displayed correctly

### Data Update Capability
- **Functionality**: CSV upload or Google Sheets integration for data updates
- **Purpose**: Allows organizer to update ticket data over the sales period via CSV file or live Google Sheets sync
- **Trigger**: User clicks "Update Data" and uploads CSV or connects Google Sheets
- **Progression**: Click Update Data → Choose CSV or Google Sheets tab → Upload file or paste published URL → Data syncs and displays confirmation
- **Success criteria**: New data loads correctly, total ticket count updates, search results reflect new data

## Edge Case Handling

- **No Results Found**: Friendly message encouraging user to check spelling or try a different name
- **Empty Input**: Disable search button until input has content
- **Partial Matches**: Search includes partial matches to help users find their family
- **Multiple Families Same Name**: Display all matches with clear attribution

## Design Direction

The design should evoke excitement and anticipation - the thrill of a raffle! Use warm, celebratory colors that feel welcoming and festive. The interface should feel like opening a golden ticket envelope.

## Color Selection

- **Primary Color**: `oklch(0.75 0.18 50)` - Warm gold/amber that evokes prizes and celebration
- **Secondary Colors**: `oklch(0.35 0.05 280)` - Deep purple for elegance and contrast
- **Accent Color**: `oklch(0.65 0.2 145)` - Teal/green for success states and highlights
- **Background**: `oklch(0.98 0.01 80)` - Warm cream for a festive, inviting feel
- **Foreground/Background Pairings**:
  - Background (Cream): Deep purple text - Ratio ~12:1 ✓
  - Primary (Gold): Dark text `oklch(0.25 0.05 50)` - Ratio ~6:1 ✓
  - Cards (White): Purple text - Ratio ~10:1 ✓

## Font Selection

Typography should feel bold and celebratory while remaining highly readable. Use a distinctive display font for headlines paired with a clean sans-serif for body text.

- **Primary Font**: "Bricolage Grotesque" - Bold, characterful for headings
- **Secondary Font**: "Source Sans 3" - Clean, readable for body text and data

- **Typographic Hierarchy**:
  - H1 (App Title): Bricolage Grotesque Bold/36px/tight
  - H2 (Result Count): Bricolage Grotesque Semibold/48px/tight
  - Body (Names/Details): Source Sans 3 Regular/16px/normal
  - Input Label: Source Sans 3 Medium/14px/normal

## Animations

Subtle entrance animations for results to create a moment of reveal and anticipation. The ticket count should scale up slightly when appearing to draw attention. Button hover states should feel responsive and tactile.

## Component Selection

- **Components**: 
  - Card for the main search container with elevated shadow
  - Input for last name entry with clear focus states
  - Button for search action with gold gradient background
  - Badge for displaying individual ticket counts
- **Customizations**: 
  - Custom result card with celebratory styling
  - Animated number display for ticket count
- **States**: 
  - Button: idle (gold), hover (brighter gold with lift), active (pressed), disabled (muted)
  - Input: idle (border), focus (gold ring), error (red border)
- **Icon Selection**: MagnifyingGlass for search, Ticket for results, Confetti for celebration
- **Spacing**: 16px base unit, 24px section gaps, 8px element gaps
- **Mobile**: Full-width card, larger touch targets for input and button, stacked layout
