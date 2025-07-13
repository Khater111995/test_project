const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, action } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    let prompt = '';
    if (action === 'translate') {
      prompt = `Translate this text to Spanish: ${text}`;
    } else {
      prompt = `Summarize this text: ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const processedText = response.text();

    res.status(200).json({
      success: true,
      processedText: processedText
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
};

