import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const phrases = [
    "Track AI Agents Launching Tokens on Base",
    "Get Alerts in Real-Time",
    "Long / Short with Leverage",
    "Powered by Autonomous AI"
];

export function Hero() {
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fullText = phrases[currentPhrase];
            if (!isDeleting) {
                if (displayText.length < fullText.length) {
                    setDisplayText(fullText.substring(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(fullText.substring(0, displayText.length - 1));
                } else {
                    setIsDeleting(false);
                    setCurrentPhrase((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? 30 : 50);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentPhrase]);

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-4xl"
            >
                <Badge variant="outline" className="mb-4 border-accent/50 text-accent gap-2 px-3 py-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Agent Monitoring Base Right Now
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Whistler
                </h1>

                <div className="h-12 md:h-16 mb-8">
                    <p className="text-xl md:text-2xl text-gray-400 font-mono">
                        {displayText}
                        <span className="animate-pulse ml-1 inline-block w-2 h-6 bg-accent" />
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <ConnectButton />
                    <Button variant="outline" size="lg" className="border-accent/20 hover:border-accent/60 hover:bg-accent/5">
                        View Live Feed
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm border-t border-gray-800 pt-8 w-full">
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 uppercase tracking-widest font-semibold">AI Tokens Tracked</span>
                        <span className="text-2xl font-bold font-mono">1,284</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 uppercase tracking-widest font-semibold">New Launches Today</span>
                        <span className="text-2xl font-bold font-mono text-accent">42</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 uppercase tracking-widest font-semibold">Active Users</span>
                        <span className="text-2xl font-bold font-mono">8.5k</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
