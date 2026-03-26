import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Hugging Face API call
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mosaicml/mpt-7b-chat',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KUMU_AI_AGENT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: userMessage })
      }
    );

    const data = await response.json();
    const reply = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
