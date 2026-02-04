This Product Requirements Document (PRD) outlines the blueprint for migrating your Google Sheets dashboard into a fully functional, custom-coded web application.

---

# **Product Requirements Document (PRD)**

**Project Name:** Software Meltdown Dashboard (Web App)
**Version:** 1.0
**Status:** Draft
**Date:** February 3, 2026

---

## **1. Executive Summary**

The "Software Meltdown" dashboard is currently a manual Google Sheet used to track the performance of 35+ high-growth software stocks. The goal is to migrate this into a **custom native web application** to eliminate spreadsheet limitations (latency, manual data entry, formatting constraints) and provide a professional, real-time market analysis tool with sub-second data updates and advanced interactive visualizations.

## **2. Problem Statement**

* **Latency:** Google Sheets `GOOGLEFINANCE` has a ~15-minute delay and often times out with "Loading..." errors.
* **Scalability:** Adding more metrics (like RSI, Volume, or P/S) requires complex, fragile scraping scripts that break easily.
* **UX Limitations:** Spreadsheets cannot render pixel-perfect, responsive mobile views or interactive charts (tooltips, zooming).
* **Data Gaps:** Key metrics like **Price-to-Sales (P/S)** and **Relative Strength (RS) Rank** are not natively available in free spreadsheet tools.

## **3. Functional Requirements**

### **3.1. Real-Time Data Engine**

* **Stock Data:** The app must stream real-time price, change %, and volume for all tracked tickers (NYSE/NASDAQ).
* **Fundamental Data:** Auto-fetch Market Cap, P/E Ratio, and **Price-to-Sales (P/S)** (updated daily).
* **Historical Data:** Store 52 weeks of daily closing prices to generate sparklines and calculate RS Rank.
* **Calculated Metrics:**
* **RS Rank (1-99):** Percentile ranking of a stock's 12-month performance relative to the entire cohort.
* **SMA Indicators:** Auto-calculate 20-day and 50-day Simple Moving Averages to display trend arrows (▲/▼).
* **Distance to 52w High:** Formula: `(Current Price - 52w High) / 52w High`.



### **3.2. User Interface (UI) Features**

* **Dashboard View:** A dense, high-contrast data table replicating the original "Software Meltdown" look.
* **Visualizations:**
* **Sparklines:** SVG-based mini-charts for "1Y Trend" (Red line).
* **Heatmap Columns:** Dynamic background coloring for `% YTD` and `% 1Y` (Red → White gradient).
* **RS Rank Bar:** Horizontal bar chart inside the cell (Green, filled based on score).


* **Interactive Sorting:** Users can click headers to sort by "RS Rank," "Market Cap," or "% Drawdown."
* **Dark Mode Default:** The UI must default to a "Pro" dark theme (Background: `#1e1e1e`, Text: `#ffffff`, Accents: `#e06666` for drops, `#57bb8a` for gains).

### **3.3. Admin & Scalability**

* **Ticker Management:** An admin panel (or config file) to easily add/remove tickers (e.g., adding "Figma" if it IPOs).
* **Mobile Responsiveness:** The table must adapt to mobile screens (e.g., hiding "Market Cap" and "P/E" on small screens while keeping Price and % Change).

---

## **4. Technical Architecture (Recommended Stack)**

To achieve the "instant" feel of a native app, we will use a modern React-based stack.

### **4.1. Frontend**

* **Framework:** **Next.js (React)** – For SEO, speed, and server-side rendering.
* **Styling:** **Tailwind CSS** – For rapid, pixel-perfect styling of the dark mode grid.
* **Charting:** **Recharts** or **Tremor** – Lightweight libraries specifically for building financial sparklines and dashboards.

### **4.2. Backend & Data**

* **Language:** **Python (FastAPI)** or **Node.js**.
* **Database:** **PostgreSQL** (to store historical data for RS Rank calculations).
* **Caching:** **Redis** (Critical: Cache stock prices for 60 seconds to prevent hitting API rate limits).

### **4.3. Data APIs (The Engine)**

You need a reliable provider that offers P/S ratios and real-time prices.

* **Option A (Pro):** **Financial Modeling Prep (FMP)** – Excellent for "Price-to-Sales" and fundamental data.
* **Option B (Budget):** **Twelve Data** – Great for real-time prices and technical indicators (RSI, SMA).
* **Option C (Free Tier):** **Yahoo Finance API (yfinance)** – Good for MVP, but not recommended for a production "native" app due to reliability issues.

---

## **5. UX/UI Design Specifications**

* **Typography:** Monospace font for numbers (e.g., `JetBrains Mono` or `Roboto Mono`) to ensure decimal alignment.
* **Color Palette:**
* **Background:** `#111111` (Deep Black)
* **Surface/Rows:** `#1E1E1E` (Dark Grey)
* **Negative (Loss):** `#FF4D4D` (Vivid Red)
* **Positive (Gain):** `#00C853` (Vivid Green)
* **Text:** `#E0E0E0` (Off-white for readability)



---

## **6. Implementation Phases**

### **Phase 1: MVP (Week 1-2)**

* [ ] Set up Next.js project with Tailwind CSS.
* [ ] Connect to a Data API (e.g., FMP) to fetch live prices for the 35 tickers.
* [ ] Build the main Table Component with hardcoded columns.
* [ ] Implement "Sparklines" using historical data array.
* [ ] **Deliverable:** A live website showing the table with real data.

### **Phase 2: Advanced Metrics (Week 3)**

* [ ] Implement backend logic to calculate "RS Rank" daily.
* [ ] Fetch "Price-to-Sales" and "Market Cap" asynchronously.
* [ ] Add sorting and filtering logic.
* [ ] **Deliverable:** Dashboard fully matches the functionality of the Google Sheet.

### **Phase 3: Polish & Mobile (Week 4)**

* [ ] Refine "Dark Mode" aesthetics (shadows, gradients).
* [ ] Optimize for mobile (horizontal scroll or hidden columns).
* [ ] Add "Detail View" (Click a row to see a full chart).
* [ ] **Deliverable:** Production-ready web app.

---

## **7. Next Step for You**

If you have a developer team, send them this document.
**If you are building this yourself**, would you like me to generate the **`Boilerplate Code`** for the **Next.js frontend** so you can start immediately?