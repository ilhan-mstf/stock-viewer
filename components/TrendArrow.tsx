import { ArrowDown, ArrowUp } from "lucide-react";

export function TrendArrow({ value }: { value: number }) {
    if (value === 0) return null;
    const isPositive = value > 0;
    const Icon = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-500" : "text-red-500";

    return <Icon className={`w-4 h-4 ${color}`} />;
}
