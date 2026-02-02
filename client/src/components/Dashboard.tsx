import { useState, useEffect } from 'react';
import { TokenFeed } from './TokenFeed';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TradingModal } from './TradingModal';
import { AnalysisModal } from './AnalysisModal';
import type { Token } from '@/lib/mock-data';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const socket = io('http://localhost:3001');

export function Dashboard() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [tradeType, setTradeType] = useState<'long' | 'short' | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial fetch of pairs could go here if server provides an endpoint
        // For now, let's just listen for new ones
        setIsLoading(false);

        socket.on('token-alert', (data: any) => {
            const newToken: Token = {
                id: data.address,
                ticker: data.ticker,
                name: data.name,
                address: `${data.address.slice(0, 6)}...${data.address.slice(-4)}`,
                launchTime: 'Just now',
                liquidity: data.liquidity || 0,
                volume24h: data.volume || 0,
                hypeScore: 85,
                priceChange: 0,
                isNew: true
            };

            setTokens(prev => {
                // Avoid duplicates
                if (prev.find(t => t.id === newToken.id)) return prev;
                return [newToken, ...prev].slice(0, 50);
            });

            toast.info(`New Token Detected: ${data.ticker}`, {
                description: `Liquidity: $${Math.floor(data.liquidity || 0).toLocaleString()}`
            });
        });

        return () => {
            socket.off('token-alert');
        };
    }, []);

    const handleAction = (token: Token, type: 'long' | 'short' | 'info' | 'analyze') => {
        if (type === 'info') {
            window.open(`https://dexscreener.com/base/${token.id}`, '_blank');
            return;
        }
        if (type === 'analyze') {
            setSelectedToken(token);
            setIsAnalysisOpen(true);
            return;
        }
        setSelectedToken(token);
        setTradeType(type);
        setIsModalOpen(true);
    };

    return (
        <section id="live-feed" className="container mx-auto px-4 py-20 min-h-[600px]">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Live Token Feed</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-gray-400">Monitoring Base chain for agentic launches...</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search ticker..."
                                className="pl-10 bg-white/5 border-white/10 focus:border-accent/50 transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="border-white/10">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        <p className="text-gray-500 font-mono text-sm">Synchronizing with Base monitoring agents...</p>
                    </div>
                ) : tokens.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-20 text-center">
                        <p className="text-gray-500">Waiting for next AI agent launch on Base...</p>
                    </div>
                ) : (
                    <TokenFeed onAction={handleAction} tokens={tokens} />
                )}

                <TradingModal
                    token={selectedToken}
                    type={tradeType}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                <AnalysisModal
                    token={selectedToken}
                    isOpen={isAnalysisOpen}
                    onClose={() => setIsAnalysisOpen(false)}
                />
            </div>
        </section>
    );
}
