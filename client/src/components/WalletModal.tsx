import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Copy, Check, Eye, EyeOff } from "lucide-react";
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { english } from 'viem/accounts';

export function WalletModal({ isOpen, onClose, onGenerated }: {
    isOpen: boolean,
    onClose: () => void,
    onGenerated: (address: string, mnemonic: string) => void
}) {
    const [mnemonic, setMnemonic] = useState('');
    const [address, setAddress] = useState('');
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && !mnemonic) {
            const m = generateMnemonic(english);
            const account = mnemonicToAccount(m);
            setMnemonic(m);
            setAddress(account.address);
        }
    }, [isOpen, mnemonic]);

    const handleCopy = () => {
        navigator.clipboard.writeText(mnemonic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = () => {
        onGenerated(address, mnemonic);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#0d1117] border-white/10 text-white">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                        <ShieldAlert className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Security Alert</span>
                    </div>
                    <DialogTitle className="text-2xl">Backup Your New Wallet</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Whistler has generated a dedicated Base wallet for your trades. Save this seed phrase securely.
                        <span className="text-red-400 font-bold block mt-1">If you lose this, your funds are gone forever.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Wallet Address</label>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm break-all">
                            {address}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Seed Phrase (12 Words)</label>
                            <button
                                onClick={() => setShowMnemonic(!showMnemonic)}
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                            >
                                {showMnemonic ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showMnemonic ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <div className="relative group">
                            <div className={`p-4 bg-black/40 border border-white/10 rounded-lg font-mono text-sm leading-relaxed transition-all ${!showMnemonic ? 'blur-md select-none' : ''}`}>
                                {mnemonic}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-white"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        className="w-full bg-accent text-black font-bold hover:bg-accent/80"
                        onClick={handleConfirm}
                    >
                        I Have Saved My Seed Phrase
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
