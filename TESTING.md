# Testing Guide for Google Sheets Integration

## Manual Testing Steps

### 1. Test Output Format Changes
1. Open the application
2. Search for "Smith" or "John"
3. Verify that:
   - Each ticket number is displayed individually (e.g., "Ticket #1001")
   - Each ticket shows the seller's first and last name
   - A summary section at the bottom shows total tickets per seller
   - Total ticket count is displayed at the top

### 2. Test Google Sheets Connection

#### Setup a Test Google Sheet:
1. Create a new Google Sheet
2. Add the following data:

```
Ticket Number,First Name,Last Name
1001,John,Smith
1002,John,Smith
1003,Mary,Johnson
1004,Mary,Johnson
1005,Sarah,Williams
```

3. Share the sheet: File → Share → Change to "Anyone with the link can view"
4. Copy the share URL

#### Test Connection:
1. In the app, click "Connect Sheet"
2. Paste the Google Sheet URL
3. Click "Connect"
4. Verify:
   - Success message appears
   - Data is loaded correctly
   - Search functionality works with the new data

#### Test Refresh:
1. Update the Google Sheet (add a new row)
2. In the app, click "Refresh Sheet"
3. Verify the new data is loaded

#### Test Disconnect:
1. Click "Change Sheet"
2. Click "Disconnect"
3. Verify the app returns to default data

### 3. Test CSV Upload (Backward Compatibility)
1. Click "Upload CSV"
2. Upload a CSV file with the same format
3. Verify data loads correctly
4. Verify both upload methods work independently

### 4. Test Edge Cases

#### Invalid Google Sheet URL:
- Enter "invalid-url" → Should show error message

#### Private Google Sheet:
- Try to connect to a private sheet → Should show permission error

#### Empty Google Sheet:
- Connect to an empty sheet → Should show "No valid data found"

#### Special Characters in Names:
- Test names with apostrophes, hyphens, etc.
- Verify they display correctly

## Expected Behavior

### Output Format:
- **Total Tickets Section**: Large number showing total count
- **Individual Ticket Details**: Scrollable list showing:
  - Ticket icon
  - "Ticket #[number]" in bold
  - "First Last" name below
- **Summary by Seller**: Shows total tickets per person

### Google Sheets Integration:
- Uses public CSV export (no API key needed)
- Validates sheet access before loading
- Shows clear error messages
- Stores sheet ID for future refreshes
- Works alongside CSV upload feature

## Known Limitations

1. **Google Sheets must be public**: The sheet must be shared with "Anyone with the link can view" permissions
2. **First sheet only**: Currently only reads the first sheet (gid=0) in a workbook
3. **CSV format required**: Expected columns are "Ticket Number", "Seller" or "Last Name", and optionally "First Name"
4. **No real-time updates**: Data is fetched on-demand (Connect or Refresh), not automatically

## Troubleshooting

### "Cannot access the Google Sheet" error:
- Verify the sheet is shared publicly
- Check that the URL is correct
- Try using the sheet ID instead of the full URL

### "No valid data found" error:
- Verify column names match expected format
- Check that there's data beyond just the header row
- Ensure ticket numbers and seller names are present

### Data not updating:
- Click "Refresh Sheet" to manually fetch latest data
- If refresh fails, try disconnecting and reconnecting
