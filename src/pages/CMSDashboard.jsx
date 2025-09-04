import React, { useState, useEffect } from 'react';
import CMSLayout from '../components/CMSLayout';
import { FileText, Eye, MessageSquare, Mail } from 'lucide-react';
import { getArticles, getNewsletterSubscribers } from '../config/firebase';

const CMSDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: '24.5K',
    totalSubscribers: 0,
    shares: 32
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const articles = await getArticles();
        const subscribers = await getNewsletterSubscribers();
        const activeSubscribers = subscribers.filter(s => s.status === 'active');
        
        setStats(prev => ({
          ...prev,
          totalArticles: articles.length,
          totalSubscribers: activeSubscribers.length
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Toplam Yazı',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-[#00FF1E]'
    },
    {
      title: 'Görüntülenme (30g)',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-[#00FF1E]'
    },
    {
      title: 'Bülten Aboneleri',
      value: stats.totalSubscribers,
      icon: Mail,
      color: 'text-[#00FF1E]'
    },
    {
      title: 'Paylaşım',
      value: stats.shares,
      icon: Share2,
      color: 'text-[#00FF1E]'
    }
  ];

  return (
    <CMSLayout activeSection="dashboard">
      <h3 className="text-2xl font-bold text-white mb-6">Gösterge Paneli</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-[#262626] border border-[#444] rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className="bg-[#3a3a3a] p-3 rounded-full">
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Son Aktiviteler</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Yeni makale yayınlandı</span>
              <span className="text-sm text-gray-500">2 saat önce</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Kategori güncellendi</span>
              <span className="text-sm text-gray-500">5 saat önce</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Yeni etiket eklendi</span>
              <span className="text-sm text-gray-500">1 gün önce</span>
            </div>
          </div>
        </div>

        <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h4>
          <div className="space-y-3">
            <a 
              href="/cms/articles/new"
              className="block w-full bg-[#00FF1E] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00FF1E]/90 transition-colors text-center"
            >
              Yeni Makale Ekle
            </a>
            <a 
              href="/cms/categories"
              className="block w-full bg-[#3a3a3a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#444] transition-colors text-center"
            >
              Kategorileri Yönet
            </a>
            <a 
              href="/cms/tags"
              className="block w-full bg-[#3a3a3a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#444] transition-colors text-center"
            >
              Etiketleri Yönet
            </a>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSDashboard;
