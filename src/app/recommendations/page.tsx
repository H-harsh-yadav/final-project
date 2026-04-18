import RecommendationsView from "@/components/recommendations/RecommendationsView";

export default function RecommendationsPage() {
    return (
        <div className="container mx-auto max-w-7xl p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Recommended Stocks</h1>
                <p className="text-muted-foreground">AI-curated stock recommendations based on market trends.</p>
            </div>
            <RecommendationsView />
        </div>
    );
}
