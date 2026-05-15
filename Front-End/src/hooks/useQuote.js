import { useState, useEffect } from "react";

export default function useQuote() {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
        try {
            const res = await fetch("https://api.adviceslip.com/advice");
            const data = await res.json();
            setQuote({
            text: data.slip.advice,
            author: "Advice of the Day"
            });
        } catch {
            setQuote({
            text: "The best way to predict the future is to create it.",
            author: "Peter Drucker",
            });
        } finally {
            setLoading(false);
        }
        };
        fetchQuote();
    }, []);

    return { quote, loading };
}