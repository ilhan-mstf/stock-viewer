const YahooFinance = require('yahoo-finance2').default; // Important: use .default if using require with esModuleInterop logic or similar, but here we found it's a class/default export.
// Based on previous debug, require('yahoo-finance2') returned an object with 'default' property which was the class/function.
// Let's try to match the working code in route.ts which was:
// import YahooFinance from "yahoo-finance2"; const yahooFinance = new YahooFinance();

async function test() {
    const yfModule = require('yahoo-finance2');
    const YahooFinance = yfModule.default || yfModule;
    const yahooFinance = new YahooFinance();

    const ticker = "AAPL";
    const queryOptions = {
        period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 Year ago
        interval: "1d",
    };

    console.log(`Fetching chart for ${ticker}...`);
    try {
        const result = await yahooFinance.chart(ticker, queryOptions);
        console.log(`Success! Found ${result.quotes.length} records.`);
        if (result.quotes.length > 0) {
            console.log('Sample:', result.quotes[0]);
        }
    } catch (e) {
        console.error("Failed to fetch chart:", e);
    }
}

test();
