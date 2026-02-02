import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, Loader2, Rocket } from "lucide-react";
import type { Token } from "@/lib/mock-data";
import { toast } from 'sonner';

interface TradingModalProps {
    token: Token | null;
    type: 'long' | 'short' | null;
    isOpen: boolean;
    onClose: () => void;
    isRealMode?: boolean;
}

export function TradingModal({ token, type, isOpen, onClose }: TradingModalProps) {
    const [leverage, setLeverage] = useState([1]);
    const [amount, setAmount] = useState('');
    const [isReal, setIsReal] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [slippage, setSlippage] = useState('0.5');

    if (!token) return null;

    const handleTrade = async () => {
        setIsExecuting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (isReal) {
            toast.success(`Successfully opened ${leverage}x ${type} on ${token.ticker} via Orderly Network!`, {
                description: `Position Size: $${(Number(amount) * leverage[0]).toLocaleString()}`
            });
        } else {
            toast.info(`Simulation trade executed: ${leverage}x ${type} on ${token.ticker}`, {
                description: "Dry-run mode, no real funds used."
            });
        }

        setIsExecuting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#0d1117] border-white/10 text-white">
                <DialogHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge className={type === 'long' ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}>
                                {type === 'long' ? <TrendingUp className="w-3 h-3 mr-1 inline" /> : <TrendingDown className="w-3 h-3 mr-1 inline" />}
                                {type?.toUpperCase()}
                            </Badge>
                            <span className="text-gray-500">|</span>
                            <span className="font-bold">{token.ticker}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setIsReal(false)}
                                className={`px-3 py-1 text-[10px] rounded-full transition-all ${!isReal ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                SIM
                            </button>
                            <button
                                onClick={() => setIsReal(true)}
                                className={`px-3 py-1 text-[10px] rounded-full transition-all ${isReal ? 'bg-accent text-black font-bold shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                REAL
                            </button>
                        </div>
                    </div>
                    <DialogTitle className="text-2xl">Execute {type === 'long' ? 'Long' : 'Short'}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isReal ? 'Deploying capital to Base L2 via Orderly/Hyperliquid.' : 'Open a simulated position for paper trading.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400">Leverage: <span className="text-accent font-bold">{leverage}x</span></label>
                            <div className="flex gap-1">
                                {[1, 5, 10, 25, 50].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setLeverage([val])}
                                        className={`text-[10px] px-2 py-0.5 rounded border ${leverage[0] === val ? 'bg-accent text-black border-accent' : 'border-white/10 text-gray-500 hover:border-accent/50'}`}
                                    >
                                        {val}x
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Slider
                            value={leverage}
                            onValueChange={setLeverage}
                            max={50}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-7 bg-white/5 border-white/10 focus:border-accent/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Slippage (%)</label>
                            <Input
                                type="number"
                                value={slippage}
                                onChange={(e) => setSlippage(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Liquidation Price</span>
                            <span className="font-mono">$0.0042</span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                            <span className="text-gray-500">Total Position</span>
                            <span className="font-mono font-bold text-accent">${(Number(amount) * leverage[0]).toLocaleString()}</span>
                        </div>
                    </div>

                    {!isReal ? (
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                            <AlertCircle className="w-3 h-3 text-yellow-500" />
                            <span>Dry-run/Simulation mode enabled. Your wallet will not be charged.</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] text-accent/80 bg-accent/5 p-2 rounded border border-accent/10">
                            <Rocket className="w-3 h-3" />
                            <span>Real mode: Transactions will be signed via your Whistler/Wagmi wallet.</span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        disabled={isExecuting || !amount}
                        className={`w-full font-bold py-6 ${type === 'long' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-red-500 hover:bg-red-600 text-black'}`}
                        onClick={handleTrade}
                    >
                        {isExecuting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirm {isReal ? 'Real' : 'SIM'} {type === 'long' ? 'Long' : 'Short'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
