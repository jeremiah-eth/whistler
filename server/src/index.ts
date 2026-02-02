import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import { AgentService } from './services/agent.js';
import { openClawProxy } from './middleware/proxy.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const agentService = new AgentService(io);
agentService.startMonitoring();

app.get('/health', (req, res) => {
    res.send({ status: 'ok', chain: 'base', monitor: 'active' });
});

app.all('/api/openclaw/*', openClawProxy);

app.post('/api/analyze', async (req, res) => {
    const { ticker } = req.body;
    const analysis = await agentService.analyzeToken(ticker);
    res.send(analysis);
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
