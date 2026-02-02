import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENCLAW_URL = process.env.OPENCLAW_URL || 'http://localhost:8000';
const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY;

export const openClawProxy = async (req: Request, res: Response) => {
    const path = req.path.replace('/api/openclaw', '');

    try {
        const response = await axios({
            method: req.method,
            url: `${OPENCLAW_URL}${path}`,
            data: req.body,
            params: req.query,
            headers: {
                'Content-Type': 'application/json',
                ...(OPENCLAW_API_KEY ? { 'Authorization': `Bearer ${OPENCLAW_API_KEY}` } : {}),
            }
        });

        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error('OpenClaw Proxy Error:', error.message);
        res.status(error.response?.status || 500).send(error.response?.data || { error: 'OpenClaw unavailable' });
    }
};
