import React from 'react';
import { Sprout, ShoppingBag, TrendingUp, CheckCircle, ArrowRight, LogIn } from 'lucide-react';
import { UserType } from '../types';

interface WelcomeScreenProps {
  onNavigateToLogin: () => void; // Gardé pour compatibilité
  onNavigateToRegister: (role: UserType) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  
  const handleRoleSelect = (role: UserType) => {
    onNavigateToRegister(role);
  };

  const RoleCard = ({ 
    role, 
    title, 
    subtitle, 
    icon: Icon, 
    features, 
    colorClass, 
    bgClass,
    btnClass 
  }: any) => (
    <div 
      onClick={() => handleRoleSelect(role)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-full ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
          <p className="text-gray-500 text-sm leading-snug mt-1">{subtitle}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        {features.map((feat: string, i: number) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle size={14} className={`mt-1 ${colorClass} opacity-70`} />
            <span className="text-sm text-gray-600">{feat}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${btnClass} opacity-90 group-hover:opacity-100 transition-opacity`}>
        ESPACE {title.toUpperCase()} <ArrowRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-6 text-center px-4 animate-fadeIn">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
          <Sprout size={40} className="text-agri-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AgriShare <span className="text-senegal-yellow">SN</span>
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          La plateforme intégrée connectant toute la chaîne de valeur agricole au Sénégal.
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-agri-dark text-xs font-bold border border-green-200">
          3 Espaces • 1 Plateforme
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 px-4 pb-10 max-w-md mx-auto w-full space-y-4 animate-slideUp">
        <RoleCard 
          role={UserType.FARMER}
          title="Producteur"
          subtitle="Gérez votre ferme et vendez vos récoltes"
          icon={Sprout}
          colorClass="text-green-600"
          bgClass="bg-green-100"
          btnClass="bg-green-600"
          features={[
            'Gestion de ferme & stocks',
            'Vente directe aux consommateurs',
            'Accès aux conseils IA',
            'Financement de projets'
          ]}
        />

        <RoleCard 
          role={UserType.CONSUMER}
          title="Consommateur"
          subtitle="Achetez des produits frais et locaux"
          icon={ShoppingBag}
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
          btnClass="bg-blue-600"
          features={[
            'Produits frais à proximité',
            'Livraison ou Click & Collect',
            'Traçabilité garantie',
            'Support producteurs locaux'
          ]}
        />

        <RoleCard 
          role={UserType.INVESTOR}
          title="Investisseur"
          subtitle="Financez l'agriculture sénégalaise"
          icon={TrendingUp}
          colorClass="text-purple-600"
          bgClass="bg-purple-100"
          btnClass="bg-purple-600"
          features={[
            'Opportunités vérifiées',
            'Suivi de portefeuille',
            'Analyses de marché',
            'ROI attractif'
          ]}
        />
        
        <div className="text-center pt-6 pb-4">
          <p className="text-gray-500 text-sm mb-2">Vous avez déjà un compte ?</p>
          <button 
            onClick={onNavigateToLogin}
            className="text-agri-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            <LogIn size={16} /> Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;