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
  
  // Auth Flow State
  const [registrationIdentifier, setRegistrationIdentifier] = useState<string>('');
  
  // Auth State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // 1. Auto-Login Check on Mount
  useEffect(() => {
    const checkSession = async () => {
      setIsAuthChecking(true);
      try {
        const user = await authService.autoLogin();
        if (user) {
          handleLoginSuccess(user);
        } else {
          // Stay on landing if not logged in
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
    
    // Redirection intelligente selon le rôle
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
    setCurrentView('landing'); // Retour à la Landing Page
  };

  const handleOrderPlaced = (orderId: string) => {
    setActiveOrderId(orderId);
    setCurrentView('order-tracking');
  };

  // 2. Render Loading Splash Screen
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-agri-dark flex flex-col items-center justify-center text-white">
         <Sprout size={64} className="text-senegal-yellow animate-bounce mb-4" />
         <h1 className="text-2xl font-bold tracking-tight">AgriShare SN</h1>
         <p className="text-green-200 mt-2 text-sm animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  // 3. Render Views
  const renderContent = () => {
    // Auth Flows
    if (currentView === 'landing') {
      return (
        <LandingPage 
          onStart={() => setCurrentView('welcome')} 
          onLogin={() => setCurrentView('login')} 
        />
      );
    }

    if (currentView === 'welcome') {
      return (
        <WelcomeScreen 
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToRegister={(role) => {
            setUserType(role);
            setCurrentView('login');
          }}
        />
      );
    }

    if (currentView === 'login') {
      return (
        <LoginScreen 
          userType={userType} // Passer le type choisi
          onLoginSuccess={handleLoginSuccess}
          onNavigateToWelcome={() => setCurrentView('welcome')}
          onNavigateToRegister={(identifier) => {
            setRegistrationIdentifier(identifier);
            setCurrentView('register');
          }}
        />
      );
    }

    if (currentView === 'register') {
      return (
        <RegistrationScreen 
          userType={userType} // Passer le type choisi pour afficher le bon formulaire
          phoneOrEmail={registrationIdentifier}
          onRegistrationComplete={handleLoginSuccess}
          onBack={() => setCurrentView('login')}
        />
      );
    }

    // Main App Views
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} onUserSwitch={setUserType} />;
      case 'marketplace':
        return <Marketplace onOrderPlaced={handleOrderPlaced} />;
      case 'farmer-dashboard':
        return authUser?.type === UserType.FARMER 
          ? <FarmerDashboard /> 
          : <div className="text-center p-10">Accès réservé aux producteurs.</div>;
      case 'investor-dashboard':
        return authUser?.type === UserType.INVESTOR
          ? <InvestorDashboard />
          : <div className="text-center p-10">Accès réservé aux investisseurs.</div>;
      case 'ai-assistant':
        return <AIAssistant userType={userType} />;
      case 'order-tracking':
        return activeOrderId ? (
          <OrderTracking orderId={activeOrderId} onBack={() => setCurrentView('marketplace')} />
        ) : (
          <Marketplace onOrderPlaced={handleOrderPlaced} />
        );
      default:
        return <Home onNavigate={setCurrentView} onUserSwitch={setUserType} />;
    }
  };

  // Si on est dans le flux d'auth (landing, welcome, login, register), on n'affiche pas la navigation principale
  const isAuthFlow = ['landing', 'welcome', 'login', 'register'].includes(currentView);

  if (isAuthFlow) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navigation 
        currentUserType={userType} 
        onNavigate={setCurrentView} 
        currentView={currentView}
        onUserSwitch={setUserType}
        authUser={authUser}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 text-center text-gray-500 text-sm">
          <p>© 2024 AgriShare Senegal. Tous droits réservés.</p>
          <p className="mt-2">Made with ❤️ for Senegal</p>
        </div>
      </footer>
    </div>
  );
};

export default App;