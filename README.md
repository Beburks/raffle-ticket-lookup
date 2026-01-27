# 🎟️ Raffle Ticket Lookup

A web application for looking up raffle ticket sellers and managing raffle data.

## Features

- **Automatic Shared Dataset**: On startup, the app automatically loads raffle data from a shared CSV file (`public/raffle-data.csv`)
- **Search by Seller**: Look up tickets by seller name
- **CSV Upload**: Upload your own CSV file to override the current data
- **Google Sheets Integration**: Connect to a published Google Sheet for real-time data updates
- **Persistent Storage**: Data is saved locally using Spark KV storage

## 📊 Shared Dataset

The app loads data from `public/raffle-data.csv` for all visitors automatically on startup. This shared dataset is loaded:
- In development when running `npm run dev`
- In production when deployed to GitHub Pages at `https://beburks.github.io/raffle-ticket-lookup/`

### Updating the Shared Dataset

To update the shared raffle data for all visitors:

1. Edit `public/raffle-data.csv` with your new ticket assignments
2. Commit and push the changes to the `main` branch
3. The GitHub Actions workflow will automatically rebuild and deploy the site
4. All visitors will see the updated data on their next page load

### CSV Format

The CSV file should have the following format:
```csv
Ticket Number,Seller
1,Smith Family
2,Smith Family
3,Jones Family
```

- First row must be headers (Ticket Number, Seller)
- Each subsequent row represents one ticket assignment
- Empty seller values are allowed (blank entries will be skipped)

## 🚀 Development

### Running Locally

```bash
npm install
npm run dev
```

This is a Spark Template application — a clean, minimal Spark environment pre-configured for local development and ready to scale with your ideas.

## 🌐 Deploying to GitHub Pages

This template is preconfigured for deployment to GitHub Pages using Vite.

1. Ensure your default branch is `main` (or `master`). The workflow triggers on pushes to either branch.
2. The Vite `base` path is set via the `BASE_PATH` environment variable to `/${REPO_NAME}/` during CI, which makes assets resolve correctly on Pages.
3. A GitHub Actions workflow at `.github/workflows/deploy.yml` builds the site and deploys the `dist/` output to GitHub Pages.
4. To deploy manually, push to `main`/`master` or run the **Deploy to GitHub Pages** workflow via the **Actions** tab.
5. After the workflow succeeds, your site will be available at `https://<your-username>.github.io/<repo-name>/`.

## 📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
