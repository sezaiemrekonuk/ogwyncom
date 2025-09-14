import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Firebase config - .env dosyanızdan alınacak
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Site base URL'i - kendi domain'inizle değiştirin
const BASE_URL = 'https://ogwyn.com';

// Statik sayfalar
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/bulten', priority: '0.8', changefreq: 'weekly' },
  { url: '/broadcast', priority: '0.8', changefreq: 'weekly' },
  { url: '/hub', priority: '0.8', changefreq: 'weekly' },
  { url: '/magaza', priority: '0.8', changefreq: 'weekly' },
  { url: '/ogwyn-ai', priority: '0.8', changefreq: 'monthly' },
  { url: '/iletisim', priority: '0.7', changefreq: 'monthly' },
  { url: '/gizlilik-politikasi', priority: '0.3', changefreq: 'yearly' }
];

async function generateSitemap() {
  try {
    console.log('🚀 Sitemap oluşturuluyor...');
    
    // Firebase'den makaleleri çek
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    
    const articles = [];
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.slug && data.published) { // Sadece yayınlanmış makaleler
        articles.push({
          slug: data.slug,
          lastmod: data.updatedAt || data.createdAt || new Date().toISOString(),
          title: data.title
        });
      }
    });

    console.log(`📰 ${articles.length} makale bulundu`);

    // XML sitemap oluştur
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;

    // Statik sayfaları ekle
    staticPages.forEach(page => {
      const lastmod = new Date().toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>

`;
    });

    // Makale sayfalarını ekle
    articles.forEach(article => {
      const lastmod = new Date(article.lastmod).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

`;
    });

    sitemap += `</urlset>`;

    // Sitemap dosyasını kaydet
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');

    console.log('✅ Sitemap başarıyla oluşturuldu!');
    console.log(`📍 Konum: ${sitemapPath}`);
    console.log(`📊 Toplam URL: ${staticPages.length + articles.length}`);
    
  } catch (error) {
    console.error('❌ Sitemap oluşturulurken hata:', error);
    process.exit(1);
  }
}

// Script'i çalıştır
generateSitemap();
