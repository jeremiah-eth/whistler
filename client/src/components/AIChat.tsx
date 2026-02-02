import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, X, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Whistler AI active. How can I help you today? I can analyze tokens, simulate trades, or check onchain data.' }
    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await response.json();

            const aiMessage: Message = {
                role: 'assistant',
                content: data.response
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error while analyzing that token.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-accent text-black p-2 rounded-l-xl shadow-lg transition-transform ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
            >
                <ChevronRight className="w-6 h-6 rotate-180" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-[#0a0e14] border-l border-white/5 z-50 flex flex-col shadow-2xl"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded bg-accent/20">
                                    <Bot className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Whistler AI</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-white/5 text-white' : 'bg-accent/20 text-accent'}`}>
                                            {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-3 rounded-lg text-sm leading-relaxed ${m.role === 'user' ? 'bg-white/5 text-gray-200' : 'bg-accent/5 text-gray-200 border border-accent/10'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-accent/20 text-accent">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                        <div className="p-3 rounded-lg text-sm bg-accent/5 text-gray-400 italic">
                                            Analyzing...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask AI about a token..."
                                    className="bg-white/5 border-white/10 focus:border-accent/50"
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" className="bg-accent text-black hover:bg-accent/80 shrink-0" disabled={isLoading}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-gray-600 mt-2 text-center uppercase tracking-tighter">
                                AI can make mistakes. Verify onchain metrics.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
