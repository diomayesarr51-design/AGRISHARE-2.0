import React, { useState, useEffect, useRef } from 'react';
import { AuthUser, UserType } from '../types';
import { authService } from '../services/authService';
import { Phone, ArrowRight, Loader2, AlertCircle, ArrowLeft, Lock, CheckCircle, RefreshCw, Mail, Sprout, ShoppingBag, TrendingUp } from 'lucide-react';

interface LoginScreenProps {
  userType?: UserType; // Nouveau prop pour connaître le contexte
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateToWelcome: () => void;
  onNavigateToRegister: (phoneOrEmail: string) => void;
}

type LoginStep = 'INPUT' | 'PASSWORD' | 'OTP';

const LoginScreen: React.FC<LoginScreenProps> = ({ 
  userType = UserType.CONSUMER, // Par défaut
  onLoginSuccess, 
  onNavigateToWelcome, 
  onNavigateToRegister 
}) => {
  const [step, setStep] = useState<LoginStep>('INPUT');
  const [identifier, setIdentifier] = useState(''); // Phone or Email
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Configuration selon le rôle
  const isInvestor = userType === UserType.INVESTOR;
  const isFarmer = userType === UserType.FARMER;
  
  const getRoleConfig = () => {
    switch(userType) {
      case UserType.FARMER: return { color: 'text-green-600', bg: 'bg-green-50', icon: Sprout, label: 'Espace Producteur' };
      case UserType.INVESTOR: return { color: 'text-purple-600', bg: 'bg-purple-50', icon: TrendingUp, label: 'Espace Investisseur' };
      default: return { color: 'text-blue-600', bg: 'bg-blue-50', icon: ShoppingBag, label: 'Espace Consommateur' };
    }
  };
  
  const config = getRoleConfig();
  const Icon = config.icon;

  useEffect(() => {
    let interval: any;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isInvestor) {
      if (!identifier.includes('@')) return setError("Email invalide");
    } else {
      if (identifier.length < 9) return setError("Numéro invalide (9 chiffres)");
    }
    
    setIsLoading(true);
    
    try {
      // Pour l'investisseur, on demande direct le mot de passe s'il existe (simulé ici comme existant)
      // Pour les autres, logique téléphone -> OTP
      const exists = await authService.checkUserExists(identifier);
      
      if (isInvestor) {
         // Investisseur passe toujours par mot de passe ou création compte pro
         if (exists) setStep('PASSWORD');
         else onNavigateToRegister(identifier); // Redir vers form complet investisseur
      } else {
         // Producteur / Consommateur
         if (exists) {
           setStep('PASSWORD'); // Ou OTP selon préférence, ici MDP pour simplifier
         } else {
           await authService.sendVerificationCode(identifier);
           setStep('OTP');
           setTimer(60);
         }
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulation login
      const user = await authService.login(identifier, password);
      // Force le type correct si le mock renvoie autre chose
      user.type = userType; 
      onLoginSuccess(user);
    } catch (err) {
      setError("Mot de passe incorrect.");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '')) verifyOtp(newOtp.join(''));
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    setError('');
    try {
      const isValid = await authService.verifyCode(identifier, code);
      if (isValid) {
        onNavigateToRegister(identifier);
      } else {
        setError("Code incorrect.");
        setIsLoading(false);
        setOtp(Array(6).fill(''));
      }
    } catch (err) {
      setError("Erreur de vérification.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
        
        <div className="p-6 pb-0">
          <button onClick={onNavigateToWelcome} className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft size={20} /> Retour
          </button>
        </div>

        <div className="px-8 pb-10 pt-4">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${config.color}`}>
              <Icon size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{config.label}</h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 'INPUT' && (isInvestor ? 'Entrez votre email professionnel' : 'Entrez votre numéro de téléphone')}
              {step === 'PASSWORD' && 'Entrez votre mot de passe'}
              {step === 'OTP' && `Code envoyé au ${identifier}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {error}
            </div>
          )}

          {step === 'INPUT' && (
            <form onSubmit={handleInputSubmit} className="space-y-6">
              <div className="relative">
                {isInvestor ? (
                  <>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      autoFocus
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-agri-primary focus:bg-white text-lg transition-all"
                      placeholder="nom@societe.com"
                    />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold text-lg">+221</span>
                      <div className="h-6 w-px bg-gray-300 mx-3"></div>
                    </div>
                    <input
                      type="tel"
                      autoFocus
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value.replace(/[^0-9]/g, ''))}
                      className="block w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-agri-primary focus:bg-white text-xl font-bold tracking-wide transition-all"
                      placeholder="7X XXX XX XX"
                      maxLength={9}
                    />
                  </>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || identifier.length < 5}
                className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex justify-center items-center ${isInvestor ? 'bg-purple-600 hover:bg-purple-700' : isFarmer ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>CONTINUER <ArrowRight size={20} className="ml-2" /></>}
              </button>
            </form>
          )}

          {step === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-6 animate-slideInRight">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-agri-primary focus:bg-white text-xl transition-all"
                placeholder="Votre mot de passe"
              />
              <button
                type="submit"
                disabled={password.length < 4 || isLoading}
                className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex justify-center items-center ${isInvestor ? 'bg-purple-600 hover:bg-purple-700' : isFarmer ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "SE CONNECTER"}
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <div className="space-y-8 animate-slideInRight">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpInputRefs.current[index] = el; }}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-primary focus:bg-white transition-all"
                  />
                ))}
              </div>
              {isLoading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;