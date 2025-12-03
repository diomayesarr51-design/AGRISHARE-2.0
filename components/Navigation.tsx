import React, { useState } from 'react';
import { UserType, AuthUser } from '../types';
import { Menu, X, Sprout, ShoppingCart, BarChart3, Bot, User, LogOut, LogIn } from 'lucide-react';

interface NavigationProps {
  currentUserType: UserType;
  onNavigate: (view: string) => void;
  currentView: string;
  onUserSwitch: (type: UserType) => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentUserType, 
  onNavigate, 
  currentView, 
  onUserSwitch,
  authUser,
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'marketplace', label: 'Marché', icon: <ShoppingCart size={20} />, roles: [UserType.CONSUMER, UserType.FARMER, UserType.INVESTOR] },
    { id: 'farmer-dashboard', label: 'Ma Ferme', icon: <Sprout size={20} />, roles: [UserType.FARMER] },
    { id: 'investor-dashboard', label: 'Investissements', icon: <BarChart3 size={20} />, roles: [UserType.INVESTOR] },
    { id: 'ai-assistant', label: 'Conseiller IA', icon: <Bot size={20} />, roles: [UserType.FARMER, UserType.INVESTOR] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(currentUserType));

  return (
    <nav className="bg-agri-dark text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Sprout className="h-8 w-8 text-senegal-yellow mr-2" />
            <span className="font-bold text-xl tracking-tight">AgriShare <span className="text-senegal-yellow">SN</span></span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-agri-primary text-white'
                      : 'text-gray-300 hover:bg-agri-primary hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
             <div className="flex items-center space-x-4">
                {authUser ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="text-xs text-gray-400">Bonjour,</p>
                       <p className="text-sm font-bold text-senegal-yellow">{authUser.fullName.split(' ')[0]}</p>
                    </div>
                    <button 
                      onClick={onLogout} 
                      className="p-2 bg-white/10 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Déconnexion"
                    >
                       <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Mode:</span>
                    <select 
                      value={currentUserType}
                      onChange={(e) => onUserSwitch(e.target.value as UserType)}
                      className="bg-gray-800 text-white text-sm rounded border border-gray-600 px-2 py-1 focus:outline-none focus:border-senegal-yellow"
                    >
                      <option value={UserType.CONSUMER}>Consommateur</option>
                      <option value={UserType.FARMER}>Producteur</option>
                      <option value={UserType.INVESTOR}>Investisseur</option>
                    </select>
                    <button 
                      onClick={() => onNavigate('login')}
                      className="flex items-center text-sm bg-agri-primary px-3 py-1.5 rounded hover:bg-agri-secondary"
                    >
                       <LogIn size={14} className="mr-1"/> Login
                    </button>
                  </div>
                )}
             </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-agri-primary inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-agri-secondary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-slideUp">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {authUser && (
               <div className="px-3 py-3 border-b border-gray-700 mb-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-white">{authUser.fullName}</p>
                    <p className="text-xs text-gray-400">{authUser.type}</p>
                  </div>
                  <button onClick={onLogout} className="text-red-400 text-xs flex items-center">
                    <LogOut size={14} className="mr-1" /> Déconnexion
                  </button>
               </div>
             )}
             
             {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                    currentView === item.id
                      ? 'bg-agri-primary text-white'
                      : 'text-gray-300 hover:bg-agri-primary hover:text-white'
                  }`}
                >
                   <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}

               {!authUser && (
                 <div className="border-t border-gray-700 mt-4 pt-4 px-3">
                   <button 
                     onClick={() => { onNavigate('login'); setIsOpen(false); }}
                     className="w-full text-center bg-white/10 py-2 rounded mb-4 text-sm font-bold"
                   >
                     Se connecter
                   </button>
                   <p className="text-gray-400 text-sm mb-2">Changer de profil:</p>
                   <div className="flex flex-col space-y-2">
                      <button onClick={() => { onUserSwitch(UserType.CONSUMER); setIsOpen(false); }} className="text-left text-gray-300 hover:text-white text-sm">Consommateur</button>
                      <button onClick={() => { onUserSwitch(UserType.FARMER); setIsOpen(false); }} className="text-left text-gray-300 hover:text-white text-sm">Producteur</button>
                      <button onClick={() => { onUserSwitch(UserType.INVESTOR); setIsOpen(false); }} className="text-left text-gray-300 hover:text-white text-sm">Investisseur</button>
                   </div>
                 </div>
               )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;