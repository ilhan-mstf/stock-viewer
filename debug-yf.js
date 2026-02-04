const yf = require('yahoo-finance2');
console.log('Type of default:', typeof yf.default);
console.log('Type of yf:', typeof yf);
console.log('Keys:', Object.keys(yf));
try {
    const inst = new yf.YahooFinance();
    console.log('Can instantiate YahooFinance:', !!inst);
} catch (e) { console.log('Cannot instantiate YahooFinance', e.message); }
