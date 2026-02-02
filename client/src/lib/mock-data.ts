export interface Token {
    id: string;
    name: string;
    ticker: string;
    address: string;
    launchTime: string;
    liquidity: number;
    volume24h: number;
    hypeScore: number;
    priceChange: number;
    isNew: boolean;
}

export const mockTokens: Token[] = [
    {
        id: '1',
        name: 'Molt Agent',
        ticker: '$MOLTY',
        address: '0x42...f3a2',
        launchTime: '5 min ago',
        liquidity: 12500,
        volume24h: 45000,
        hypeScore: 88,
        priceChange: 12.5,
        isNew: true,
    },
    {
        id: '2',
        name: 'Whistle Autonomous',
        ticker: '$WHISTLE',
        address: '0x88...e12b',
        launchTime: '2 hours ago',
        liquidity: 85000,
        volume24h: 120000,
        hypeScore: 72,
        priceChange: -5.2,
        isNew: false,
    },
    {
        id: '3',
        name: 'Claw AI',
        ticker: '$CLAWD',
        address: '0x12...99ee',
        launchTime: '12 min ago',
        liquidity: 5200,
        volume24h: 8000,
        hypeScore: 45,
        priceChange: 2.1,
        isNew: true,
    },
    {
        id: '4',
        name: 'Base Bot',
        ticker: '$BBOT',
        address: '0xbc...77d1',
        launchTime: '1 day ago',
        liquidity: 250000,
        volume24h: 500000,
        hypeScore: 95,
        priceChange: 145.8,
        isNew: false,
    },
    {
        id: '5',
        name: 'Neural Scout',
        ticker: '$SCOUT',
        address: '0xfe...2211',
        launchTime: '45 min ago',
        liquidity: 18000,
        volume24h: 22000,
        hypeScore: 64,
        priceChange: -1.5,
        isNew: true,
    }
];
