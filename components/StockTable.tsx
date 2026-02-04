"use client";

import { useState, useEffect, useMemo } from "react";
import { StockData, StockApiResponse } from "@/types";
import { formatCurrency, formatCompactNumber, formatPercentage, cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import { TrendArrow } from "./TrendArrow";
import { HeatmapCell } from "./HeatmapCell";
import { DataBarCell } from "./DataBarCell";
import { RSRankCell } from "./RSRankCell";
import { SMACell } from "./SMACell";

type SortField = keyof StockData;
type SortOrder = 'asc' | 'desc';

export function StockTable() {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('rsRank');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const fetchData = async () => {
        try {
            const res = await fetch("/api/stocks");
            const data: StockApiResponse = await res.json();
            setStocks(data.stocks);
            setLastUpdated(data.lastUpdated);
        } catch (error) {
            console.error("Failed to fetch stocks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to desc for numbers usually
        }
    };

    const sortedStocks = useMemo(() => {
        return [...stocks].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [stocks, sortField, sortOrder]);


    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading market data...</div>;
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return <span className="ml-1 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
    };

    const Th = ({ field, children, align = 'right', className = '', title }: { field?: SortField, children: React.ReactNode, align?: 'left' | 'right' | 'center', className?: string, title?: string }) => (
        <th
            className={cn(
                "px-2 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A2A] select-none",
                align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
                className
            )}
            onClick={() => field && handleSort(field)}
            title={title}
        >
            <div className={cn("flex items-center gap-1", align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start')}>
                {children}
                {field && <SortIcon field={field} />}
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] shadow-sm">
            <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300" role="grid" aria-label="Stock Performance Table">
                <thead className="bg-gray-50 dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 text-[11px] tracking-wide">
                    <tr>
                        <Th field="symbol" align="left">Ticker</Th>
                        <Th field="name" align="left">Company</Th>
                        <Th field="price" align="right">Price</Th>
                        <Th field="marketCap" align="right">Market Cap</Th>
                        <Th field="peRatio" align="right" className="text-gray-700 dark:text-gray-400">P/E</Th>
                        <Th field="changePercentYtd" align="right" className="bg-gray-100/50 dark:bg-white/5" title="Year to Date">YTD %</Th>
                        <th className="px-2 py-3 text-center" aria-label="1 Year Trend Chart">Chart 1Y</th>
                        <Th field="changePercent1Y" align="right" className="w-[100px]" title="1 Year Change">1Y %</Th>
                        <Th field="delta52wHigh" align="right" title="Distance from 52 Week High">Δ 52w High</Th>
                        <Th field="rsRank" align="center" title="Relative Strength Rank">RS Rank</Th>
                        <th className="px-1 py-3 text-center" title="20 Day Simple Moving Average">20SMA</th>
                        <th className="px-1 py-3 text-center" title="50 Day Simple Moving Average">50SMA</th>
                        <th className="px-1 py-3 text-center" title="200 Day Simple Moving Average">200SMA</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {sortedStocks.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-3 py-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600 flex items-center justify-center text-[10px] text-blue-700 dark:text-gray-200 font-extrabold" aria-hidden="true">
                                    {stock.symbol[0]}
                                </div>
                                <span className="text-base">{stock.symbol}</span>
                            </td>
                            <td className="px-3 py-3 text-gray-600 dark:text-gray-400 truncate max-w-[140px] font-medium">
                                {stock.name}
                            </td>
                            <td className="px-3 py-3 text-right font-mono font-medium text-gray-900 dark:text-gray-200 text-[13px]">
                                {formatCurrency(stock.price)}
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-gray-600 dark:text-gray-500 text-[13px]">
                                {formatCompactNumber(stock.marketCap)}
                            </td>
                            <td className="px-3 py-3">
                                <HeatmapCell value={stock.peRatio} max={200} />
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-[13px]">
                                <DataBarCell value={stock.changePercentYtd} type="fill" />
                            </td>
                            <td className="px-2 py-3 w-[100px]">
                                <Sparkline data={stock.history} />
                            </td>
                            <td className="px-3 py-3 text-[13px]">
                                <DataBarCell value={stock.changePercent1Y} type="fill" />
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-gray-600 dark:text-gray-500 text-[13px]">
                                {formatPercentage(stock.delta52wHigh)}
                            </td>
                            <td className="px-3 py-3 flex justify-center">
                                <RSRankCell value={stock.rsRank} />
                            </td>
                            <td className="px-2 py-3"><SMACell status={stock.sma20} /></td>
                            <td className="px-2 py-3"><SMACell status={stock.sma50} /></td>
                            <td className="px-2 py-3"><SMACell status={stock.sma200} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-4 text-xs text-gray-500 dark:text-gray-400 text-right flex justify-between bg-gray-50 dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-gray-800">
                <span>Displaying {stocks.length} Tickers</span>
                <span>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "-"}</span>
            </div>
        </div>
    );
}
