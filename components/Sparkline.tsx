"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
    data: number[];
    color?: string; // Optional override
}

export function Sparkline({ data }: SparklineProps) {
    if (!data || data.length === 0) {
        return <div className="w-[120px] h-[40px] bg-white/5 rounded" />;
    }

    const chartData = data.map((val, i) => ({ i, val }));
    const start = data[0];
    const end = data[data.length - 1];
    const isPositive = end >= start;
    const strokeColor = isPositive ? "#00C853" : "#FF4D4D";

    return (
        <div className="w-[120px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <YAxis domain={["dataMin", "dataMax"]} hide />
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={strokeColor}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
