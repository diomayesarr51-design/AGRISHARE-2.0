
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Marketplace from './components/Marketplace';
import FarmerDashboard from './components/FarmerDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import AIAssistant from './components/AIAssistant';
import Home from './components/Home';
import OrderTracking from './components/OrderTracking';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LandingPage from './components/LandingPage';
import { UserType, AuthUser } from './types';
import { authService } from './services/authService';
import { Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [userType, setUserType] = useState<UserType>(UserType.CONSUMER);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  // Auth State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setIsAuthChecking(true);
      try {
        const user = await authService.autoLogin();
        if (user) {
          handleLoginSuccess(user);
        }
      } catch (e) {
        console.error("Auto login failed", e);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setUserType(user.type);
    
    if (user.type === UserType.FARMER) {
      setCurrentView('farmer-dashboard');
    } else if (user.type === UserType.INVESTOR) {
      setCurrentView('investor-dashboard');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAuthUser(null);
    setUserType(UserType.CONSUMER);
    setCurrentView('landing');
  };

  const handleOrderPlaced = (orderId: string) => {
    setActiveOrderId(orderId);
    setCurrentView('order-tracking');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-agri-dark flex flex-col items-center justify-center text-white">
         <Sprout size={64} className="text-senegal-yellow animate-bounce mb-4" />
         <h1 className="text-2xl font-bold tracking-tight">AgriShare SN</h1>
         <p className="text-green-200 mt-2 text-sm animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'landing') return <LandingPage onStart={() => setCurrentView('welcome')} onLogin={() => setCurrentView('login')} />;
    if (currentView === 'welcome') return <WelcomeScreen onNavigateToLogin={() => setCurrentView('login')} onNavigateToRegister={(role) => { setUserType(role); setCurrentView('login'); }} />;
    if (currentView === 'login') return <LoginScreen userType={userType} onLoginSuccess={handleLoginSuccess} onNavigateToWelcome={() => setCurrentView('welcome')} onNavigateToRegister={(id) => setCurrentView('register')} />;
    if (currentView === 'register') return <RegistrationScreen userType={userType} phoneOrEmail="" onRegistrationComplete={handleLoginSuccess} onBack={() => setCurrentView('login')} />;

    switch (currentView) {
      case 'home': return <Home onNavigate={setCurrentView} onUserSwitch={setUserType} />;
      case 'marketplace': return <Marketplace onOrderPlaced={handleOrderPlaced} />;
      case 'farmer-dashboard': return <FarmerDashboard />;
      case 'investor-dashboard': return <InvestorDashboard />;
      case 'ai-assistant': return <AIAssistant userType={userType} />;
      case 'order-tracking': return activeOrderId ? <OrderTracking orderId={activeOrderId} onBack={() => setCurrentView('marketplace')} /> : <Marketplace onOrderPlaced={handleOrderPlaced} />;
      default: return <Home onNavigate={setCurrentView} onUserSwitch={setUserType} />;
    }
  };

  const isAuthFlow = ['landing', 'welcome', 'login', 'register'].includes(currentView);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {!isAuthFlow && (
        <Navigation 
          currentUserType={userType} 
          onNavigate={setCurrentView} 
          currentView={currentView}
          onUserSwitch={setUserType}
          authUser={authUser}
          onLogout={handleLogout}
        />
      )}
      <main className={!isAuthFlow ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;