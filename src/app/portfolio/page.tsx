import PortfolioView from "@/components/portfolio/PortfolioView";
import { Briefcase } from "lucide-react";

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
            <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto max-w-7xl pt-12 pb-24 px-4 md:px-8">
                <div className="mb-10 flex flex-col items-start gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
                        <Briefcase className="h-10 w-10 text-primary" />
                        My Portfolio
                    </h1>
                    <p className="text-lg text-muted-foreground">Monitor your holdings, performance, and overall market value.</p>
                </div>
                <PortfolioView />
            </div>
        </div>
    );
}
