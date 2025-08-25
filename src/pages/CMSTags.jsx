import React, { useState, useEffect } from 'react';
import CMSLayout from '../components/CMSLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { Edit2, Trash2 } from 'lucide-react';
import { getTags, createTag, updateTag, deleteTag } from '../config/firebase';

const CMSTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Etiket adı zorunludur.');
      return;
    }

    try {
      setSubmitting(true);
      const tagName = formData.name.trim().startsWith('#') 
        ? formData.name.trim() 
        : `#${formData.name.trim()}`;
      
      const tagData = { name: tagName };

      if (editingId) {
        await updateTag(editingId, tagData);
        setTags(tags.map(tag => 
          tag.id === editingId ? { ...tag, ...tagData } : tag
        ));
        setEditingId(null);
        alert('Etiket başarıyla güncellendi!');
      } else {
        const id = await createTag(tagData);
        setTags([...tags, { id, ...tagData }]);
        alert('Etiket başarıyla eklendi!');
      }
      setFormData({ name: '' });
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('Etiket kaydedilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tag) => {
    setFormData({ name: tag.name });
    setEditingId(tag.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '' });
    setEditingId(null);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" etiketini silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteTag(id);
        setTags(tags.filter(tag => tag.id !== id));
        alert('Etiket başarıyla silindi!');
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Etiket silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return (
      <CMSLayout activeSection="tags">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection="tags">
      <h3 className="text-2xl font-bold text-white mb-6">Etiketler</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Etiket Düzenle' : 'Yeni Etiket Ekle'}
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
                  placeholder="Örn: react, javascript"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  # işareti otomatik olarak eklenecektir
                </p>
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

        {/* Tags List */}
        <div className="lg:col-span-2">
          <div className="bg-[#262626] border border-[#444] rounded-xl overflow-hidden">
            {tags.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Henüz etiket bulunmuyor.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#444]">
                      <th className="p-4 text-gray-400">İsim</th>
                      <th className="p-4 text-gray-400">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => (
                      <tr key={tag.id} className="border-b border-[#444] hover:bg-white/5">
                        <td className="p-4 text-white font-medium">
                          <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded-full text-sm">
                            {tag.name}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id, tag.name)}
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

export default CMSTags;
