# Software Meltdown Dashboard

A real-time stock dashboard tracking the "Software Meltdown" of 2024/2025. This application monitors ~80 major SaaS/Cloud tickers, providing quantitative metrics like Year-to-Date (YTD) performance, Simple Moving Averages (SMA), and Relative Strength (RS) Ranks.

## Features

*   **Real-time Data**: Fetches stock quotes via `yahoo-finance2`.
*   **Quantitative Metrics**:
    *   **YTD %**: Calculated from Jan 1st of the current year.
    *   **SMA Indicators**: 20, 50, and 200-day Simple Moving Averages with Bull/Bear trend indicators.
    *   **RS Rank**: 1-99 Cohort ranking based on 1-year performance.
    *   **Sparklines**: 1-year price trend visualization.
*   **Theme Support**: Fully responsive Light and Dark modes.
*   **Accessible UI**: High-contrast heatmaps and accessible table structures.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4
*   **Charts**: Recharts (Sparklines)
*   **Deployment**: Cloudflare Pages (via OpenNext)

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

## Deployment (Cloudflare)

This project uses **OpenNext** (`@opennextjs/cloudflare`) to deploy Next.js on Cloudflare Workers.

### 1. Build Command
The build process is decoupled to prevent recursion loops on Cloudflare CI:

*   **Cloudflare Build Command**: `npm run cf:build`
*   **Build Output Directory**: `.open-next/assets` (Configured in `wrangler.jsonc`)

### 2. Manual Deployment
To deploy manually from your terminal:

```bash
npm run deploy
```

## Architecture Notes

*   **API Runtime**: The API uses the standard Node.js runtime (not Edge Runtime). OpenNext automatically wraps this for Cloudflare compatibility using the `nodejs_compat` v2 flag (Compatibility Date: 2024-09-23+).
*   **Caching**: In-memory caching (60s) is implemented to respect Yahoo Finance rate limits.
