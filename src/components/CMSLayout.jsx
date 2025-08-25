import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Folder, 
  Tag, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell 
} from 'lucide-react';

const CMSLayout = ({ children, activeSection = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'Gösterge Paneli', icon: LayoutDashboard, href: '/cms' },
    { id: 'articles', name: 'Yazılar', icon: FileText, href: '/cms/articles' },
    { id: 'new-article', name: 'Yeni Yazı Ekle', icon: PlusCircle, href: '/cms/articles/new' },
    { id: 'categories', name: 'Kategoriler', icon: Folder, href: '/cms/categories' },
    { id: 'tags', name: 'Etiketler', icon: Tag, href: '/cms/tags' },
    { id: 'settings', name: 'Ayarlar', icon: Settings, href: '/cms/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#16161B] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 min-h-screen flex-shrink-0 flex flex-col transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 bg-[#262626] border-r border-[#444]`}>
        
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-center relative h-[65px] border-b border-[#444]">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              CMS Panel
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white absolute right-6 top-1/2 -translate-y-1/2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-400/10 text-[#00FF1E] font-semibold'
                    : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#00FF1E]' : ''}`} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-[#444] mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2.5 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#262626] border-b border-[#444] p-4 flex justify-between items-center flex-shrink-0 h-[65px]">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-xl font-semibold text-white hidden md:block">
            Hoş Geldiniz, Admin!
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <Bell className="w-6 h-6" />
            </button>
            <img 
              src="https://placehold.co/40x40/262626/FFFFFF?text=A" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-gray-600" 
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CMSLayout;
