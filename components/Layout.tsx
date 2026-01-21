
import React from 'react';
import { LayoutDashboard, Receipt, Package, BarChart3, Menu, X, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Imagem de perfil fornecida pela usuária
  const profileImageUrl = "https://i.imgur.com/LHv9XU3.png";

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'transactions', label: 'Finanças', icon: Receipt },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-[#FFF9F9] text-gray-800 font-sans selection:bg-pink-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-pink-100 fixed inset-y-0 left-0 z-30 shadow-sm">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 rotate-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-gray-900 leading-tight block">Julia Oliveira</span>
            <span className="text-xs font-sans font-bold text-pink-400 tracking-widest uppercase">Lash Design</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-pink-500 text-white shadow-xl shadow-pink-100 translate-x-2'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-pink-50">
          <div className="bg-pink-50/50 p-4 rounded-3xl flex items-center space-x-3 border border-pink-100/50">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shrink-0 shadow-md bg-pink-100">
              <img src={profileImageUrl} alt="Julia" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Julia Oliveira</p>
              <p className="text-[10px] uppercase font-black text-pink-500 tracking-widest">Proprietária</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-pink-50 w-full fixed top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-serif font-bold text-gray-900 tracking-tight">Julia Oliveira</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl animate-slideInRight flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-pink-50 bg-pink-50/30">
               <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm bg-pink-100">
                  <img src={profileImageUrl} alt="Julia" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Julia Oliveira</p>
                  <p className="text-[10px] text-pink-500 font-bold uppercase tracking-tighter">Gestão Lash</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 bg-white rounded-full shadow-sm hover:text-pink-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-3xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-pink-500 text-white shadow-xl scale-[1.02]' 
                        : 'text-gray-500 bg-pink-50/20 hover:bg-pink-50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-bold text-lg">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-8 border-t border-pink-50 bg-gray-50/30 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">LashBalance Premium</p>
              <button className="w-full py-4 bg-white border border-pink-100 text-pink-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
                Fechar Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        <div className="pt-20 lg:pt-12 p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-screen-2xl mx-auto flex-1">
          <header className="mb-8 lg:mb-12">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl shadow-pink-100 flex-shrink-0 bg-pink-50">
                 <img src={profileImageUrl} alt="Julia Oliveira" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                  Olá, Julia! <span className="text-pink-400 inline-block animate-bounce">✨</span>
                </h1>
                <p className="text-xs sm:text-lg text-gray-500 font-medium">Confira o crescimento do seu negócio hoje.</p>
              </div>
            </div>
          </header>
          
          <div className="pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
