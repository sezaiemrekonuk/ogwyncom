import React, { useState, useEffect } from 'react';
import CMSLayout from '../components/CMSLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { Edit2, Trash2 } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../config/firebase';

const CMSCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Kategori adı zorunludur.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateCategory(editingId, formData);
        setCategories(categories.map(cat => 
          cat.id === editingId ? { ...cat, ...formData } : cat
        ));
        setEditingId(null);
        alert('Kategori başarıyla güncellendi!');
      } else {
        const id = await createCategory(formData);
        setCategories([...categories, { id, ...formData }]);
        alert('Kategori başarıyla eklendi!');
      }
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Kategori kaydedilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        alert('Kategori başarıyla silindi!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Kategori silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return (
      <CMSLayout activeSection="categories">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection="categories">
      <h3 className="text-2xl font-bold text-white mb-6">Kategoriler</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  İsim
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  placeholder="Kategori adı"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  placeholder="Kategori açıklaması (opsiyonel)"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#00FF1E] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00FF1E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Ekle')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-[#3a3a3a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#444] transition-colors"
                  >
                    İptal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-[#262626] border border-[#444] rounded-xl overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Henüz kategori bulunmuyor.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#444]">
                      <th className="p-4 text-gray-400">İsim</th>
                      <th className="p-4 text-gray-400">Açıklama</th>
                      <th className="p-4 text-gray-400">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-[#444] hover:bg-white/5">
                        <td className="p-4 text-white font-medium">
                          {category.name}
                        </td>
                        <td className="p-4 text-gray-300">
                          {category.description || 'Açıklama yok'}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
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
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSCategories;
