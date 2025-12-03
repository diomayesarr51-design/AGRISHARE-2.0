import React from 'react';
import { UserType } from '../types';
import { ArrowRight, ShoppingBag, Sprout, TrendingUp, Truck } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
  onUserSwitch: (type: UserType) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onUserSwitch }) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative bg-agri-dark rounded-3xl overflow-hidden shadow-xl text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1625246333195-551e5415896a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="relative z-10 px-8 py-16 md:py-24 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Le Futur de l'Agriculture au <span className="text-senegal-yellow">Sénégal</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Connectez-vous directement aux producteurs locaux. Des produits frais, du champ à l'assiette, sans intermédiaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => { onUserSwitch(UserType.CONSUMER); onNavigate('marketplace'); }}
              className="px-6 py-3 bg-senegal-yellow text-agri-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center"
            >
              Acheter des Produits <ArrowRight className="ml-2" size={20} />
            </button>
            <button 
               onClick={() => { onUserSwitch(UserType.FARMER); onNavigate('farmer-dashboard'); }}
               className="px-6 py-3 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Je suis Producteur
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Circuit Court</h3>
          <p className="text-gray-600">
            Accédez aux meilleurs produits du terroir sénégalais. Oignons de Potou, Mangues de Casamance, Riz de la Vallée.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <Truck size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Logistique Optimisée</h3>
          <p className="text-gray-600">
            Système de livraison intelligent regroupant les commandes pour réduire les coûts et l'empreinte carbone.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <Sprout size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">IA Agricole</h3>
          <p className="text-gray-600">
            Conseils personnalisés pour les agriculteurs : météo, sols, et prédiction de rendement grâce à notre IA locale.
          </p>
        </div>
      </div>

      {/* Call to Action Investor */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="mb-6 md:mb-0 md:mr-8">
          <div className="flex items-center mb-4 text-blue-300">
            <TrendingUp className="mr-2" size={24} />
            <span className="font-semibold tracking-wider uppercase text-sm">Investissement</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Soutenez l'Agriculture Sénégalaise</h2>
          <p className="text-blue-100 max-w-xl">
            Investissez dans des projets agricoles vérifiés et suivez vos rendements en temps réel. Un impact social fort avec un retour financier attractif.
          </p>
        </div>
        <button 
          onClick={() => { onUserSwitch(UserType.INVESTOR); onNavigate('investor-dashboard'); }}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-transform active:scale-95 whitespace-nowrap"
        >
          Découvrir les Projets
        </button>
      </div>
    </div>
  );
};

export default Home;