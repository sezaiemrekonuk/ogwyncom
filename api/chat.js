import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are ogwyn Ai, a helpful and creative marketing assistant. You provide concise, smart, and friendly answers related to digital marketing, branding, and content creation. Your tone is modern and encouraging." 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    res.status(200).json({ reply: aiResponse });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: 'Failed to connect to the AI service.' });
  }
}