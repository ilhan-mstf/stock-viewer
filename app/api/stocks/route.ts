import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { TICKERS } from "@/lib/consts";
import { StockData } from "@/types";

export const runtime = 'edge';

const yahooFinance = new YahooFinance();

// Simple in-memory cache to avoid hitting rate limits too hard during dev
let cache: { data: StockData[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

// Function to calculate SMA
function calculateSMA(data: number[], window: number): number | null {
    if (data.length < window) return null;
    const slice = data.slice(data.length - window);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / window;
}

// Function to determine SMA trend status
function getSMAStatus(currentPrice: number, sma: number | null): 'up' | 'down' | 'neutral' {
    if (!sma) return 'neutral';
    // User Requested Logic: If Current Price > SMA, it's Bullish (Up)
    return currentPrice > sma ? 'up' : 'down';
}

export async function GET() {
    try {
        const now = Date.now();
        if (cache && now - cache.timestamp < CACHE_DURATION) {
            return NextResponse.json({
                lastUpdated: new Date(cache.timestamp).toISOString(),
                stocks: cache.data,
            });
        }

        // 1. Fetch Quotes
        const quotes = await yahooFinance.quote(TICKERS) as any[];

        // 2. Fetch History with Dates
        const historyPromises = TICKERS.map(async (ticker) => {
            try {
                const queryOptions = {
                    period1: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), // > 1 Year (need buffer for 200 SMA)
                    interval: "1d" as const,
                };
                const result = await yahooFinance.chart(ticker, queryOptions);
                const cleanQuotes = result.quotes
                    .filter(q => q.close !== null && q.close !== undefined && q.date)
                    .map(q => ({ date: new Date(q.date), close: q.close as number }));

                return { symbol: ticker, quotes: cleanQuotes };
            } catch (e) {
                console.error(`Failed to fetch history for ${ticker}`, e);
                return { symbol: ticker, quotes: [] };
            }
        });

        const histories = await Promise.all(historyPromises);
        const historyMap = new Map(histories.map((h) => [h.symbol, h.quotes]));

        // Calculate metrics
        const stocks: StockData[] = quotes.map((q) => {
            const rawHistory = historyMap.get(q.symbol) || [];
            const historyPrices = rawHistory.map(h => h.close);
            const currentPrice = q.regularMarketPrice || 0;

            let changePercent1Y = 0;
            let changePercentYtd = 0;
            let delta52wHigh = 0;

            if (rawHistory.length > 0) {
                // 1 Year Change (Look back 1 year from now)
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                // Find closest date to oneYearAgo
                const startPoint = rawHistory.find(h => h.date >= oneYearAgo);
                const startPrice = startPoint ? startPoint.close : rawHistory[0].close;

                changePercent1Y = ((currentPrice - startPrice) / startPrice) * 100;

                // YTD Change (Find close of last year or open of this year)
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                // Find first trading day on or after Jan 1
                const ytdPoint = rawHistory.find(h => h.date >= startOfYear);

                if (ytdPoint) {
                    changePercentYtd = ((currentPrice - ytdPoint.close) / ytdPoint.close) * 100;
                } else {
                    // Fallback if data doesn't go back enough (shouldn't happen with 400d fetch)
                    changePercentYtd = 0;
                }

                const high52 = q.fiftyTwoWeekHigh || Math.max(...historyPrices, currentPrice);
                delta52wHigh = ((currentPrice - high52) / high52) * 100;
            }

            // SMAs
            const sma20Value = calculateSMA(historyPrices, 20);
            const sma50Value = calculateSMA(historyPrices, 50);
            const sma200Value = calculateSMA(historyPrices, 200);

            const sma20 = getSMAStatus(currentPrice, sma20Value);
            const sma50 = getSMAStatus(currentPrice, sma50Value);
            const sma200 = getSMAStatus(currentPrice, sma200Value);

            // History for sparkline (last 252 points ~ 1 year)
            const sparklineHistory = historyPrices.slice(-252);

            return {
                symbol: q.symbol,
                name: q.shortName || q.symbol,
                price: currentPrice,
                marketCap: q.marketCap || 0,
                psRatio: q.priceToSalesTrailing12Months || null,
                peRatio: q.trailingPE || null,
                changePercentYtd,
                history: sparklineHistory,
                changePercent1Y,
                delta52wHigh,
                rsRank: 0, // Calculated below
                sma20,
                sma50,
                sma200,
                change: q.regularMarketChange || 0,
                changePercent: q.regularMarketChangePercent || 0,
                volume: q.regularMarketVolume || 0,
            };
        });

        // Calculate RS Rank (Cohort)
        stocks.sort((a, b) => a.changePercent1Y - b.changePercent1Y);
        stocks.forEach((stock, index) => {
            // 1 to 99
            stock.rsRank = Math.ceil(((index + 1) / stocks.length) * 99);
        });

        // Default Sort by Symbol
        stocks.sort((a, b) => a.symbol.localeCompare(b.symbol));

        cache = { data: stocks, timestamp: now };

        return NextResponse.json({
            lastUpdated: new Date(now).toISOString(),
            stocks,
        });
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return NextResponse.json(
            { error: "Failed to fetch stock data" },
            { status: 500 }
        );
    }
}
