export interface StockData {
    symbol: string;
    name: string;
    price: number;
    marketCap: number;
    psRatio: number | null; // Price to Sales
    peRatio: number | null; // Price to Earnings
    changePercentYtd: number; // % YTD
    history: number[]; // For Sparkline (1Y)
    changePercent1Y: number; // % 1Y
    delta52wHigh: number; // Distance from 52w High
    rsRank: number; // 0-99
    sma20: 'up' | 'down' | 'neutral';
    sma50: 'up' | 'down' | 'neutral';
    sma200: 'up' | 'down' | 'neutral';
    change: number; // Keeping for compatibility / debugging
    changePercent: number; // Keeping for compatibility / debugging
    volume: number;
}

export interface StockApiResponse {
    lastUpdated: string;
    stocks: StockData[];
}
