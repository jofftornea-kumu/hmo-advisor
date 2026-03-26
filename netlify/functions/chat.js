// /netlify/functions/chatbot.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No prompt provided.' }) };
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` // we'll set this in Netlify
      },
      body: JSON.stringify({
        prompt: { text: userPrompt },
        temperature: 0.7,
        maxOutputTokens: 500
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.candidates?.[0]?.content || "No response from Gemini." })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
