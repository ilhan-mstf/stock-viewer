import { StockTable } from "@/components/StockTable";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Software Meltdown
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Tracking the performance of high-growth software stocks.
        </p>
      </header>

      <section>
        <StockTable />
      </section>

      <footer className="mt-12 text-center text-xs text-gray-600">
        <p>Market data provided by Yahoo Finance. Prices may be delayed.</p>
      </footer>
    </main>
  );
}
