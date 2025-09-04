import React, { useState, useEffect } from 'react';
import CMSLayout from '../components/CMSLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Eye, Phone, Mail, Building, MessageSquare, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { getHubPreorders, updatePreorderStatus, deletePreorder } from '../config/firebase';
import { formatArticleDate } from '../utils/dateHelpers';

const CMSPreorders = () => {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPreorder, setSelectedPreorder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPreorders();
  }, []);

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const data = await getHubPreorders();
      setPreorders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching preorders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updatePreorderStatus(id, newStatus);
      setPreorders(preorders.map(preorder => 
        preorder.id === id ? { ...preorder, status: newStatus } : preorder
      ));
    } catch (error) {
      alert('Durum güncellenirken bir hata oluştu.');
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" adlı ön siparişi silmek istediğinizden emin misiniz?`)) {
      try {
        await deletePreorder(id);
        setPreorders(preorders.filter(preorder => preorder.id !== id));
        if (selectedPreorder && selectedPreorder.id === id) {
          setSelectedPreorder(null);
        }
      } catch (error) {
        alert('Ön sipariş silinirken bir hata oluştu.');
        console.error('Error deleting preorder:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'contacted':
        return 'bg-blue-900 text-blue-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'contacted':
        return <Phone className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'contacted':
        return 'İletişime Geçildi';
      case 'pending':
        return 'Bekliyor';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bekliyor';
    }
  };

  const filteredPreorders = preorders.filter(preorder => {
    const matchesStatus = statusFilter === 'all' || preorder.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      preorder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preorder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (preorder.company && preorder.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getPreorderStats = () => {
    const total = preorders.length;
    const pending = preorders.filter(p => p.status === 'pending').length;
    const contacted = preorders.filter(p => p.status === 'contacted').length;
    const completed = preorders.filter(p => p.status === 'completed').length;
    return { total, pending, contacted, completed };
  };

  const stats = getPreorderStats();

  if (loading) {
    return (
      <CMSLayout activeSection="preorders">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection="preorders">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">OGW HUB Ön Siparişler</h3>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#262626] border border-[#444] rounded-lg overflow-hidden">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 text-sm ${statusFilter === 'all' ? 'bg-[#00FF1E] text-black' : 'text-gray-300'}`}
            >
              Tümü ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-2 text-sm ${statusFilter === 'pending' ? 'bg-[#00FF1E] text-black' : 'text-gray-300'}`}
            >
              Bekliyor ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('contacted')}
              className={`px-3 py-2 text-sm ${statusFilter === 'contacted' ? 'bg-[#00FF1E] text-black' : 'text-gray-300'}`}
            >
              İletişim ({stats.contacted})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-2 text-sm ${statusFilter === 'completed' ? 'bg-[#00FF1E] text-black' : 'text-gray-300'}`}
            >
              Tamamlandı ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="İsim, e-posta veya şirket ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md bg-[#262626] border border-[#444] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF1E]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preorders List */}
        <div className="lg:col-span-2">
          <div className="bg-[#262626] border border-[#444] rounded-xl overflow-hidden">
            {filteredPreorders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  {preorders.length === 0 ? 'Henüz ön sipariş bulunmuyor.' : 'Filtrelere uygun ön sipariş bulunamadı.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#444]">
                      <th className="p-4 text-gray-400">İsim</th>
                      <th className="p-4 text-gray-400">E-posta</th>
                      <th className="p-4 text-gray-400">Şirket</th>
                      <th className="p-4 text-gray-400">Tarih</th>
                      <th className="p-4 text-gray-400">Durum</th>
                      <th className="p-4 text-gray-400">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPreorders.map((preorder) => (
                      <tr 
                        key={preorder.id} 
                        className={`border-b border-[#444] hover:bg-white/5 cursor-pointer ${
                          selectedPreorder?.id === preorder.id ? 'bg-[#00FF1E]/10' : ''
                        }`}
                        onClick={() => setSelectedPreorder(preorder)}
                      >
                        <td className="p-4 text-white font-medium">
                          {preorder.name}
                        </td>
                        <td className="p-4 text-gray-300">
                          {preorder.email}
                        </td>
                        <td className="p-4 text-gray-300">
                          {preorder.company || '-'}
                        </td>
                        <td className="p-4 text-gray-400">
                          {preorder.submittedAt ? formatArticleDate(preorder.submittedAt) : '-'}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(preorder.status)}`}>
                            {getStatusIcon(preorder.status)}
                            {getStatusText(preorder.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPreorder(preorder);
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Detayları Görüntüle"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(preorder.id, preorder.name);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Sil"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Preorder Details */}
        <div className="lg:col-span-1">
          <div className="bg-[#262626] border border-[#444] rounded-xl p-6 sticky top-6">
            {selectedPreorder ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-white">Ön Sipariş Detayları</h4>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${getStatusColor(selectedPreorder.status)}`}>
                    {getStatusIcon(selectedPreorder.status)}
                    {getStatusText(selectedPreorder.status)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                      <Building className="w-4 h-4 mr-2" />
                      İsim
                    </label>
                    <p className="text-white">{selectedPreorder.name}</p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      E-posta
                    </label>
                    <p className="text-white">
                      <a href={`mailto:${selectedPreorder.email}`} className="text-[#00FF1E] hover:underline">
                        {selectedPreorder.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Telefon
                    </label>
                    <p className="text-white">
                      <a href={`tel:${selectedPreorder.phone}`} className="text-[#00FF1E] hover:underline">
                        {selectedPreorder.phone}
                      </a>
                    </p>
                  </div>

                  {selectedPreorder.company && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                        <Building className="w-4 h-4 mr-2" />
                        Şirket
                      </label>
                      <p className="text-white">{selectedPreorder.company}</p>
                    </div>
                  )}

                  {selectedPreorder.interestedFeatures && selectedPreorder.interestedFeatures.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">
                        İlgilendiği Özellikler
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPreorder.interestedFeatures.map((feature, index) => (
                          <span 
                            key={index}
                            className="bg-[#00FF1E]/10 text-[#00FF1E] text-xs px-2 py-1 rounded-full border border-[#00FF1E]/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPreorder.message && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Mesaj
                      </label>
                      <p className="text-white bg-[#1a1a1a] p-3 rounded-lg text-sm leading-relaxed">
                        {selectedPreorder.message}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      Gönderilme Tarihi
                    </label>
                    <p className="text-white text-sm">
                      {selectedPreorder.submittedAt ? formatArticleDate(selectedPreorder.submittedAt) : '-'}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-6 pt-6 border-t border-[#444]">
                  <label className="text-sm font-medium text-gray-400 mb-3 block">
                    Durum Güncelle
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'pending', label: 'Bekliyor', color: 'yellow' },
                      { value: 'contacted', label: 'İletişime Geçildi', color: 'blue' },
                      { value: 'completed', label: 'Tamamlandı', color: 'green' },
                      { value: 'cancelled', label: 'İptal Edildi', color: 'red' }
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusUpdate(selectedPreorder.id, status.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPreorder.status === status.value
                            ? 'bg-[#00FF1E] text-black font-medium'
                            : 'bg-[#3a3a3a] text-white hover:bg-[#444]'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Detayları görüntülemek için bir ön sipariş seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSPreorders;
