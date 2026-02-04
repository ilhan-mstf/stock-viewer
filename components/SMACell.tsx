import { Triangle } from "lucide-react";

interface SMACellProps {
    status: 'up' | 'down' | 'neutral';
}

export function SMACell({ status }: SMACellProps) {
    if (status === 'neutral') return <span className="text-gray-600">-</span>;

    const isUp = status === 'up';
    return (
        <div className="flex justify-center">
            <Triangle
                className={`w-3 h-3 ${isUp ? "text-green-500 fill-green-500" : "text-red-500 fill-red-500 rotate-180"}`}
            />
        </div>
    );
}
