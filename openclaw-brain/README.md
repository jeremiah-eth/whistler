# 🧠 OpenClaw Brain

OpenClaw Brain is the autonomous AI backend for the Whistler Dashboard. It provides real-time agent responses and token analysis.

## Features
- **AI Chat**: Context-aware conversation about the Base agent economy.
- **Token Analysis**: Deep onchain metrics and risk assessment for Base tokens.
- **Secure API**: Protected by API Key authentication.

## Setup

### 1. Installation
```bash
cd openclaw-brain
npm install
```

### 2. Configuration
Create a `.env` file (see `.env.example` in root) or use the defaults:
```env
PORT=8000
API_KEY=your_openclaw_key
```

### 3. Running
```bash
npm run dev
```

## API Endpoints
- `POST /api/chat`: General agent conversation.
- `POST /api/analyze-token`: Detailed token reports.
- `GET /health`: Service status check.
