import TutorialView from "@/components/tutorial/TutorialView";
import { TrainingMode } from "@/components/tutorial/TrainingMode";
import { BookOpen } from "lucide-react";

export default function TutorialPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
            <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto max-w-4xl pt-12 pb-24 px-4 md:px-8">
                <div className="mb-12 text-center flex flex-col items-center">
                    <div className="h-16 w-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Trading Academy</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Master the markets with our interactive training mode and core trading fundamentals.</p>
                </div>
                
                <div className="glass-card rounded-2xl p-6 md:p-8 mb-16 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-[60px] -z-10" />
                   <TrainingMode />
                </div>

                <div className="mt-12 glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <h2 className="text-3xl font-bold tracking-tight mb-8 text-center flex items-center justify-center gap-3">
                       <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                       Trading Fundamentals
                    </h2>
                    <TutorialView />
                </div>
            </div>
        </div>
    );
}
