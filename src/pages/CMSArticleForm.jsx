import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CMSLayout from '../components/CMSLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import RichTextEditor from '../components/RichTextEditor';
import { Save, Send, UploadCloud, Code, Eye } from 'lucide-react';
import { createArticle, updateArticle, getArticleById, getCategories, uploadImage } from '../config/firebase';

const CMSArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editorMode, setEditorMode] = useState('wysiwyg'); // 'wysiwyg' or 'html'
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '', // This will now store HTML content
    excerpt: '',
    image: '',
    category: '',
    tags: '',
    seoTitle: '',
    metaDescription: '',
    status: 'draft',
    featured: false
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [isEditing, id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const article = await getArticleById(id);
      if (article) {
        setFormData({
          title: article.title || '',
          content: article.content || '',
          excerpt: article.excerpt || '',
          image: article.image || '',
          category: article.category || '',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
          seoTitle: article.seoTitle || '',
          metaDescription: article.metaDescription || '',
          status: article.status || 'draft',
          featured: article.featured || false
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Makale yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeaturedImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    setImageUploading(true);

    try {
      const imageData = await uploadImage(file, 'featured-images');
      setFormData(prev => ({
        ...prev,
        image: imageData.url
      }));
    } catch (error) {
      console.error('Error uploading featured image:', error);
      alert('Resim yüklenirken bir hata oluştu.');
    } finally {
      setImageUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleSubmit = async (status = formData.status) => {
    if (!formData.title.trim()) {
      alert('Başlık alanı zorunludur.');
      return;
    }

    if (!formData.content.trim()) {
      alert('İçerik alanı zorunludur.');
      return;
    }

    try {
      setLoading(true);
      
      const articleData = {
        title: formData.title.trim(),
        content: formData.content, // HTML content
        excerpt: formData.excerpt.trim(),
        image: formData.image.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seoTitle: formData.seoTitle.trim() || formData.title.trim(),
        metaDescription: formData.metaDescription.trim(),
        status,
        featured: formData.featured,
        slug: formData.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-'),
        publishedAt: status === 'published' ? new Date() : null
      };

      if (isEditing) {
        await updateArticle(id, articleData);
        alert('Makale başarıyla güncellendi!');
      } else {
        await createArticle(articleData);
        alert('Makale başarıyla oluşturuldu!');
        navigate('/cms/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Makale kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <CMSLayout activeSection="new-article">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection={isEditing ? "articles" : "new-article"}>
      <h3 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Makale Düzenle' : 'Yeni Makale Ekle'}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Makale Başlığı
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
              placeholder="Dikkat çekici bir başlık girin..."
            />
          </div>

          {/* Content Editor */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-gray-300 text-sm font-medium">
                Makale İçeriği
              </label>
              <div className="flex items-center bg-[#3a3a3a] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setEditorMode('wysiwyg')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    editorMode === 'wysiwyg'
                      ? 'bg-[#00FF1E] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('html')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    editorMode === 'html'
                      ? 'bg-[#00FF1E] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-1" />
                  HTML
                </button>
              </div>
            </div>

            {editorMode === 'wysiwyg' ? (
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Makale içeriğinizi buraya yazın. Zengin metin editörü ile kolayca biçimlendirebilirsiniz..."
              />
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="20"
                className="w-full px-4 py-3 bg-[#1a1a1a]/60 border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF1E] focus:ring-2 focus:ring-[#00FF1E]/20 font-mono text-sm"
                placeholder={`HTML kodunuzu buraya yazın...

Örnek:
<h2>Alt Başlık</h2>
<p>Bu bir paragraf metnidir.</p>
<ul>
  <li>Liste öğesi 1</li>
  <li>Liste öğesi 2</li>
</ul>
<img src="image-url.jpg" alt="Açıklama" />
<blockquote>Alıntı metni</blockquote>`}
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Özet
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
              placeholder="Makale özeti (kart görünümlerinde kullanılır)"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <label className="block text-gray-300 text-sm font-medium mb-4">
              Öne Çıkan Görsel
            </label>
            
            {/* Upload Button */}
            <div className="mb-4">
              <label className="relative inline-flex items-center px-4 py-2 bg-[#00FF1E]/20 hover:bg-[#00FF1E]/30 border border-[#00FF1E] rounded-lg cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={imageUploading}
                />
                <UploadCloud className="w-4 h-4 mr-2 text-[#00FF1E]" />
                <span className="text-[#00FF1E] text-sm font-medium">
                  {imageUploading ? 'Yükleniyor...' : 'Resim Yükle'}
                </span>
              </label>
            </div>

            {/* URL Input (alternative) */}
            <div className="relative">
              <label className="block text-gray-400 text-xs mb-2">
                veya URL girin:
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                placeholder="https://example.com/image.jpg"
                disabled={imageUploading}
              />
            </div>

            {/* Preview */}
            {formData.image && (
              <div className="mt-4">
                <label className="block text-gray-400 text-xs mb-2">Önizleme:</label>
                <img 
                  src={formData.image} 
                  alt="Featured preview"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border border-[#444]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* SEO Settings */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">SEO Ayarları</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  SEO Başlığı
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  placeholder="Arama motorları için başlık"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Meta Açıklaması
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  placeholder="Arama sonuçlarında görünecek kısa açıklama"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publishing */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Yayımlama</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Durum
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayımlandı</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  placeholder="virgül, ile, ayırın"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 bg-[#3a3a3a] text-green-400 border-[#444] rounded focus:ring-green-400"
                />
                <label className="ml-2 text-sm text-gray-300">
                  Öne çıkan makale
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex-1 bg-[#3a3a3a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Taslak
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="flex-1 bg-[#00FF1E] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00FF1E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Yayımla
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Kategori</h4>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#3a3a3a] border border-[#444] rounded-lg text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSArticleForm;
