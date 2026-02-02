import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Token } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownRight, ExternalLink, Info, BrainCircuit } from "lucide-react";

export function TokenFeed({
    onAction,
    tokens
}: {
    onAction: (token: Token, type: 'long' | 'short' | 'info') => void,
    tokens: Token[]
}) {
    return (
        <div className="rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden shadow-2xl">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead className="w-[250px] text-gray-400">Token</TableHead>
                        <TableHead className="text-gray-400">Launch / Age</TableHead>
                        <TableHead className="text-gray-400">Liquidity</TableHead>
                        <TableHead className="text-gray-400">24h Volume</TableHead>
                        <TableHead className="text-gray-400">Hype</TableHead>
                        <TableHead className="text-gray-400">24h Change</TableHead>
                        <TableHead className="text-right text-gray-400">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map((token) => (
                        <TableRow key={token.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white group-hover:text-accent transition-colors">{token.ticker}</span>
                                        {token.isNew && (
                                            <Badge className="bg-accent/20 text-accent border-accent/20 text-[10px] h-4 px-1 animate-pulse">NEW</Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">{token.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm">{token.launchTime}</span>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                        {token.address} <ExternalLink className="w-2 h-2" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-300">
                                ${Math.floor(token.liquidity).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-300">
                                ${Math.floor(token.volume24h).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${token.hypeScore > 70 ? 'bg-accent' : token.hypeScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${token.hypeScore}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold">{token.hypeScore}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className={`flex items-center gap-1 text-sm font-medium ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {token.priceChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {Math.abs(token.priceChange)}%
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onAction(token, 'analyze')} className="h-8 w-8 text-gray-400 hover:text-accent hover:bg-accent/10">
                                        <BrainCircuit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onAction(token, 'info')} className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10">
                                        <Info className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" onClick={() => onAction(token, 'long')} className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-black h-8 px-3 transition-all">
                                        Long
                                    </Button>
                                    <Button size="sm" onClick={() => onAction(token, 'short')} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black h-8 px-3 transition-all">
                                        Short
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
