import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { personalities } from './personalities.js';

const app = express();
app.use(cors({
  origin: 'https://yamenai.vercel.app', // your frontend
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

const PORT = 5000;

// ✅ AIMLapi config
const API_KEY = '5f00e13501cb40e6a042fba0320d7427';
const MODEL = 'gemma-3n-4b'; // Model slug for AIMLapi

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

app.post('/chat', async (req, res) => {
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
        temperature: 0.8, // Make it more expressive and natural
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    // Optional: log to verify model behavior
    console.log('Request sent:', fullMessages);
    console.log('Response received:', data);

    res.json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(PORT, () => console.log(`✅ AIMLapi + Gemma 3N backend running at http://localhost:${PORT}`));
