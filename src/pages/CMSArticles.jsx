import React, { useState, useEffect } from 'react';
import CMSLayout from '../components/CMSLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getArticles, deleteArticle } from '../config/firebase';
import { formatArticleDate } from '../utils/dateHelpers';

const CMSArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`"${title}" makalesini silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteArticle(id);
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        alert('Makale silinirken bir hata oluştu.');
        console.error('Error deleting article:', error);
      }
    }
  };

  if (loading) {
    return (
      <CMSLayout activeSection="articles">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection="articles">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">Tüm Yazılar</h3>
        <a 
          href="/cms/articles/new"
          className="bg-[#00FF1E] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00FF1E]/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Ekle
        </a>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-[#262626] border border-[#444] rounded-xl overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">Henüz makale bulunmuyor.</p>
            <a 
              href="/cms/articles/new"
              className="inline-block mt-4 bg-[#00FF1E] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00FF1E]/90 transition-colors"
            >
              İlk Makaleyi Ekle
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#444]">
                  <th className="p-4 text-gray-400">Başlık</th>
                  <th className="p-4 text-gray-400">Kategori</th>
                  <th className="p-4 text-gray-400">Tarih</th>
                  <th className="p-4 text-gray-400">Durum</th>
                  <th className="p-4 text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-[#444] hover:bg-white/5">
                    <td className="p-4 text-white font-medium">
                      {article.title || 'Başlık Yok'}
                    </td>
                    <td className="p-4 text-gray-300">
                      {article.category || 'Kategori Yok'}
                    </td>
                    <td className="p-4 text-gray-400">
                      {article.publishedAt ? formatArticleDate(article.publishedAt) : 'Tarih Yok'}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        article.status === 'published' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {article.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <a 
                        href={`/cms/articles/edit/${article.id}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </a>
                      <button 
                        onClick={() => handleDelete(article.id, article.title)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default CMSArticles;
