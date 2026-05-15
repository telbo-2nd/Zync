import useQuote from "../../hooks/useQuote";
import { Quote } from "lucide-react";

export default function QuoteWidget() {
    const { quote, loading } = useQuote();

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
            <Quote size={18} className="text-[#4c3bcf]" />
            <h3 className="font-semibold text-gray-800">Quote of the Day</h3>
        </div>

        {loading ? (
            <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/5" />
            </div>
        ) : (
            <>
            <p className="text-sm text-gray-600 italic leading-relaxed">
                "{quote?.text}"
            </p>
            <p className="text-xs text-[#4c3bcf] font-semibold mt-3 text-right">
                — {quote?.author}
            </p>
            </>
        )}
        </div>
    );
}