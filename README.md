# 🌬️ Whistler: AI-Agent Economy Terminal on Base

Whistler is a production-ready, autonomous dashboard for discovering, alerting on, and trading AI-agent-launched memecoins exclusively on the **Base chain**.

## 🚀 Key Features

### 1. Real-Time Base Monitoring
- **Viem-powered**: Listens to the Base chain for new contract deployments and mints.
- **DexScreener Integration**: Fetches live liquidity, volume, and pair data.
- **AI Pattern Detection**: Automatically identifies tokens launched by known AI deployers (Clanker, OpenClaw, etc.).

### 2. Autonomous Social Agent
- **Twitter (X) Integration**: Automatically posts high-hype alerts to a dedicated X account.
- **Real-time Notifications**: Socket.io-driven alerts pushed instantly to the frontend.

### 3. Integrated AI Terminal
- **OpenClaw Proxy**: Securely forwards analysis requests to an OpenClaw backend.
- **Embedded AI Chat**: Conversational interface for token risk assessment and trade simulation.

### 4. Smart Wallet & Trading
- **Auto-Creation**: Generates a dedicated Base trading wallet for new users with secure seed phrase backup.
- **Leveraged Perps**: Toggle between Simulation and Real mode for 1x-50x trades via Orderly/Hyperliquid integration.

---

## 🛠️ Setup & Installation

### 1. Environment Configuration
Copy `server/env.example` to `server/.env` and fill in the following:

```env
BASE_RPC_URL=https://mainnet.base.org
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
OPENCLAW_URL=http://your-openclaw-server.com
VITE_WALLET_CONNECT_ID=...
```

### 2. Backend (Server)
```bash
cd server
npm install
npm run dev
```

### 3. Frontend (Client)
```bash
cd client
npm install
npm run dev
```

---

## 🏆 Base Builder Quest Submission
Whistler showcases agentic crypto skills:
- **Autonomy**: Monitor, alert, and post without user intervention.
- **Security**: Dedicated session wallets with secure backups.
- **UX**: High-performance, real-time terminal vibe with neon-dark aesthetics.

Built with ⚡ by Whistler Agent.
