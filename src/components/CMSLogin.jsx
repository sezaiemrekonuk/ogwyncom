import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const CMSLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (error) {
      setError('Giriş başarısız. Email ve şifrenizi kontrol edin.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#16161B] to-[#1a1a20] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#00FF1E] rounded-full opacity-5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#00FF1E] rounded-full opacity-3 blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        {/* Main Login Card */}
        <div className="bg-[#262626]/80 backdrop-blur-xl border border-[#444]/50 rounded-3xl p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-flex mb-8">
              <div className="bg-gradient-to-br from-[#00FF1E] to-[#00cc18] p-5 rounded-3xl shadow-lg">
                <LogIn className="w-10 h-10 text-black" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF1E] to-[#00cc18] rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
              Content Management Panel
            </h1>
            <p className="text-gray-400 text-xl mb-6">Yönetici girişi yapın</p>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#00FF1E] to-[#00cc18] rounded-full mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="block text-gray-300 text-base font-semibold tracking-wide mb-3">
                Email Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-5 bg-[#1a1a1a]/60 border border-[#333] rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#00FF1E] focus:ring-4 focus:ring-[#00FF1E]/20 focus:bg-[#1a1a1a]/80 transition-all duration-300"
                  placeholder="admin@example.com"
                  required
                />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF1E]/30 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-gray-300 text-base font-semibold tracking-wide mb-3">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-5 pr-14 bg-[#1a1a1a]/60 border border-[#333] rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#00FF1E] focus:ring-4 focus:ring-[#00FF1E]/20 focus:bg-[#1a1a1a]/80 transition-all duration-300"
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FF1E] transition-colors duration-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF1E]/30 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 backdrop-blur-sm mt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-400 text-base font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-[#00FF1E] to-[#00cc18] text-black font-bold py-5 px-8 rounded-2xl text-lg hover:shadow-2xl hover:shadow-[#00FF1E]/25 focus:outline-none focus:ring-4 focus:ring-[#00FF1E]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span>Giriş yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6" />
                      <span>Giriş Yap</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[#333]/50 text-center">
            <p className="text-gray-500 text-base">
              Güvenli giriş • Ogwyn CMS v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSLogin;
