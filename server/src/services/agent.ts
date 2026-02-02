import { Server } from 'socket.io';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import axios from 'axios';
import dotenv from 'dotenv';

import { TwitterService } from './twitter.js';

dotenv.config();

export interface TokenAlert {
    ticker: string;
    name: string;
    address: string;
    message: string;
    type: 'high' | 'medium';
    liquidity?: number;
    volume?: number;
}

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export class AgentService {
    private io: Server;
    private client;
    private twitter: TwitterService;
    private knownAgents = [
        '0x0000000000000000000000000000000000000000', // Placeholder for Clanker/OpenClaw deployers
    ];

    constructor(io: Server) {
        this.io = io;
        this.twitter = new TwitterService();
        this.client = createPublicClient({
            chain: base,
            transport: http(BASE_RPC_URL),
        });
    }

    async startMonitoring() {
        console.log('🟢 Agent Service: Monitoring Base for new AI tokens...');

        // Fallback polling for new pairs via DexScreener or block listener
        this.pollNewPairs();

        // Real-time block listener for contract deployments (simplified)
        this.client.watchBlockNumber({
            onBlockNumber: (blockNumber) => {
                // console.log(`New block: ${blockNumber}`);
            },
        });
    }

    private async pollNewPairs() {
        setInterval(async () => {
            try {
                // DexScreener "Latest Pairs" API for Base chain
                const response = await axios.get('https://api.dexscreener.com/latest/dex/pairs/base');
                const pairs = response.data.pairs;

                if (pairs && pairs.length > 0) {
                    const latestPair = pairs[0];
                    // Simple logic: If pair is < 5 mins old and has > $5k liquidity
                    const createdAt = latestPair.pairCreatedAt;
                    const now = Date.now();

                    if (now - createdAt < 300000) { // 5 minutes
                        this.handleNewToken(latestPair);
                    }
                }
            } catch (error) {
                console.error('Error polling DexScreener:', error);
            }
        }, 60000); // Every minute
    }

    private async handleNewToken(pair: any) {
        const isAI = this.detectAI(pair);

        if (isAI || pair.liquidity?.usd > 10000) {
            const alert: TokenAlert = {
                ticker: pair.baseToken.symbol,
                name: pair.baseToken.name,
                address: pair.baseToken.address,
                message: `New AI Token Detected: ${pair.baseToken.symbol} | Liq: $${Math.floor(pair.liquidity?.usd || 0)} | Vol: $${Math.floor(pair.volume?.h24 || 0)}`,
                type: pair.liquidity?.usd > 50000 ? 'high' : 'medium',
                liquidity: pair.liquidity?.usd,
                volume: pair.volume?.h24
            };

            console.log(`🚨 ALERT: ${alert.ticker} detected on Base!`);
            this.io.emit('token-alert', alert);

            if (alert.type === 'high') {
                this.twitter.postAlert(alert.ticker, alert.address, alert.liquidity || 0);
            }
        }
    }

    private detectAI(pair: any): boolean {
        const aiKeywords = ['AI', 'AGENT', 'BOT', 'CLAWD', 'WHISTLE', 'CLANKER'];
        const name = (pair.baseToken.name || '').toUpperCase();
        const symbol = (pair.baseToken.symbol || '').toUpperCase();

        return aiKeywords.some(key => name.includes(key) || symbol.includes(key));
    }

    async analyzeToken(tickerOrAddress: string) {
        try {
            // Point to real OpenClaw integration if available
            // For now, fetch real data from DexScreener to supplement the analysis
            const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tickerOrAddress}`);
            const pair = response.data.pairs?.[0];

            if (!pair) return { advice: "Token not found on DexScreener yet." };

            return {
                ticker: pair.baseToken.symbol,
                address: pair.baseToken.address,
                advice: `### ${pair.baseToken.symbol} Analysis\n\n- **Liquidity**: $${pair.liquidity?.usd.toLocaleString()}\n- **24h Volume**: $${pair.volume?.h24.toLocaleString()}\n- **Price Change (24h)**: ${pair.priceChange?.h24}%\n\n**Verdict**: ${pair.liquidity?.usd > 50000 ? 'BULLISH' : 'NEUTRAL'}. This agent shows steady volume. Monitor for distribution patterns.`,
            };
        } catch (error) {
            return { advice: "Analysis failed. Please try again later." };
        }
    }
}
