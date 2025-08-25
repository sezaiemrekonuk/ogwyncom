import React from 'react';
import CMSLayout from '../components/CMSLayout';

const CMSSettings = () => {
  return (
    <CMSLayout activeSection="settings">
      <h3 className="text-2xl font-bold text-white mb-6">Ayarlar</h3>
      
      <div className="bg-[#262626] border border-[#444] rounded-xl p-6">
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Ayarlar sayfası yakında eklenecek...</p>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSSettings;
