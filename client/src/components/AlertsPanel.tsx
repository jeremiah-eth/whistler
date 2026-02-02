import { Bell, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface Alert {
    id: string;
    ticker: string;
    message: string;
    time: string;
    type: 'high' | 'medium';
}

const socket = io('http://localhost:3001');

export function AlertsPanel() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        socket.on('token-alert', (data: any) => {
            const newAlert: Alert = {
                id: Date.now().toString(),
                ticker: data.ticker,
                message: data.message,
                time: 'Just now',
                type: data.type
            };
            setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        });

        return () => {
            socket.off('token-alert');
        };
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-40 w-80 space-y-2 pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`pointer-events-auto flex flex-col gap-1 p-3 rounded-lg border backdrop-blur-md shadow-lg ${alert.type === 'high'
                                ? 'bg-accent/10 border-accent/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-1 rounded ${alert.type === 'high' ? 'bg-accent text-black' : 'bg-gray-700 text-white'}`}>
                                    {alert.type === 'high' ? <Zap className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                                </div>
                                <span className="font-bold text-sm">{alert.ticker}</span>
                            </div>
                            <span className="text-[10px] text-gray-500">{alert.time}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-tight">
                            {alert.message}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
