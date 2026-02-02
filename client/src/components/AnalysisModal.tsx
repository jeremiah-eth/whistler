import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, BrainCircuit, ShieldCheck } from "lucide-react";
import type { Token } from "@/lib/mock-data";
import { useState, useEffect } from "react";

export function AnalysisModal({
    token,
    isOpen,
    onClose
}: {
    token: Token | null,
    isOpen: boolean,
    onClose: () => void
}) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && token) {
            handleAnalyze();
        } else {
            setAnalysis(null);
        }
    }, [isOpen, token]);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/analyze-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your_openclaw_key'
                },
                body: JSON.stringify({ address: token?.id, ticker: token?.ticker })
            });
            const data = await response.json();
            setAnalysis(data.analysis);
        } catch (error) {
            setAnalysis("### Analysis Error\nFailed to connect to OpenClaw Brain.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-[#0d1117] border-white/10 text-white">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-accent mb-2">
                        <BrainCircuit className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-widest">OpenClaw Analysis</span>
                    </div>
                    <DialogTitle className="text-2xl">Brain Report: {token?.ticker}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Autonomous agent risk assessment and onchain heuristics.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 min-h-[200px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            <p className="text-gray-500 font-mono text-xs uppercase">Connecting to Brain Tier...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: analysis?.replace(/\n/g, '<br/>') || '' }} />

                            <div className="mt-8 flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] text-green-500 uppercase font-bold">Verified by Whistler Monitoring</span>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
