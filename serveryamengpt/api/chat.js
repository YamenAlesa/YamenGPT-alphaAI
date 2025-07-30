import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { personalities } from '../personalities.js'; // notice the updated path
import fetch from 'node-fetch';

const app = express();

app.use(cors({
  origin: 'https://yamenai.vercel.app',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

const API_KEY = '5f00e13501cb40e6a042fba0320d7427';
const MODEL = 'gemma-3n-4b';

const identityMemory = {
  yamengpt: [
    { role: "user", content: "What’s your name?" },
    { role: "assistant", content: "I am YamenGPT, a brilliant AI designed to provide highly intelligent answers." }
  ],
  yamen: [
    { role: "user", content: "What’s your name?" },
    { role: "assistant", content: "Yo, I’m Yamen 😎 The goofiest bot on the block!" }
  ]
};

app.post('/api/chat', async (req, res) => {
  const { messages, personality } = req.body;

  const selected = personalities[personality] || personalities.yamengpt;
  const memory = identityMemory[personality] || [];

  const fullMessages = [
    { role: "system", content: selected.prompt },
    ...memory,
    ...messages,
  ];

  try {
    const response = await fetch('https://api.aimlapi.com/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

export default app;
