import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

export class TwitterService {
    private client: TwitterApi | null = null;

    constructor() {
        if (process.env.TWITTER_API_KEY) {
            this.client = new TwitterApi({
                appKey: process.env.TWITTER_API_KEY,
                appSecret: process.env.TWITTER_API_SECRET!,
                accessToken: process.env.TWITTER_ACCESS_TOKEN!,
                accessSecret: process.env.TWITTER_ACCESS_SECRET!,
            });
        }
    }

    async postAlert(ticker: string, address: string, liquidity: number) {
        if (!this.client) {
            console.log('🐦 Twitter Service: Not configured, skipping post.');
            return;
        }

        try {
            const tweet = `🚨 NEW BASE AI TOKEN: $${ticker}\n\nCA: ${address}\nLiq: $${Math.floor(liquidity).toLocaleString()}\n\nTrade now at Whistler: https://whistler.app/token/${address}\n\n#Base #AIAgents #WhistlerAgent`;

            await this.client.v2.tweet(tweet);
            console.log(`🐦 Tweet posted for ${ticker}`);
        } catch (error) {
            console.error('Error posting to Twitter:', error);
        }
    }
}
