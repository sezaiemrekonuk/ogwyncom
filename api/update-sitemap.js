// Vercel serverless function örneği
// api/update-sitemap.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Firebase webhook'tan gelen veriyi işle
    const { articleSlug, action } = req.body;
    
    // Sitemap'i yeniden oluştur
    // (generate-sitemap.js kodunu buraya adapte edin)
    
    res.status(200).json({ 
      message: 'Sitemap updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sitemap update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
