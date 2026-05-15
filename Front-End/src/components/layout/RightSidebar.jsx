import QuoteWidget from "../widgets/QuoteWidget";
import SuggestedPeople from "../widgets/SuggestedPeople";

export default function RightSidebar() {
    return (
        <aside className="w-72 fixed right-0 top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto hidden xl:block">
        <QuoteWidget />
        <SuggestedPeople />
        </aside>
    );
}