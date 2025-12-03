import React from 'react';
import { Sprout, ShoppingBag, TrendingUp, ChevronDown, CheckCircle, ArrowRight, Globe, ShieldCheck, Users, LogIn } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const scrollToSpaces = () => {
    const element = document.getElementById('spaces-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar Overlay */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
             <Sprout className="text-white" size={24} />
           </div>
           <span className="text-white font-bold text-xl tracking-tight">AgriShare <span className="text-yellow-300">SN</span></span>
        </div>
        <button 
          onClick={onLogin}
          className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full font-medium hover:bg-white hover:text-green-800 transition-all flex items-center gap-2"
        >
          <LogIn size={18} /> Se connecter
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Agriculture Sénégal" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-900/50 to-green-900/90" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur border border-green-400/30 text-green-100 text-sm font-semibold tracking-wide animate-fadeIn">
            PLATEFORME DIGITALE INTÉGRÉE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slideUp">
            Le Futur de l'Agriculture <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Sénégalaise</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-slideUp delay-100">
            Une solution unique connectant producteurs, consommateurs et investisseurs pour une agriculture durable, rentable et accessible à tous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp delay-200">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Commencer maintenant <ArrowRight size={20} />
            </button>
            <button 
              onClick={scrollToSpaces}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-lg font-bold rounded-full border border-white/30 transition-all flex items-center justify-center"
            >
              Découvrir les espaces
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-green-50 py-12 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "Producteurs", value: "500+", icon: Users },
             { label: "Consommateurs", value: "10K+", icon: ShoppingBag },
             { label: "Investisseurs", value: "50+", icon: TrendingUp },
             { label: "Transactions", value: "100%", icon: ShieldCheck, sub: "Sécurisées" },
           ].map((stat, idx) => (
             <div key={idx} className="flex flex-col items-center text-center">
               <div className="mb-3 p-3 bg-white rounded-full shadow-sm text-green-600">
                 <stat.icon size={24} />
               </div>
               <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
               <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
               {stat.sub && <span className="text-xs text-green-600">{stat.sub}</span>}
             </div>
           ))}
        </div>
      </section>

      {/* Spaces Section */}
      <section id="spaces-section" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-green-600 font-bold tracking-widest uppercase mb-2">Nos Espaces</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">3 Univers, 1 Écosystème</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Que vous souhaitiez vendre vos récoltes, manger sainement ou investir dans l'avenir, AgriShare a un espace dédié pour vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer Card */}
            <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
               <div className="h-2 bg-green-500 w-full" />
               <div className="p-8">
                 <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Sprout size={32} className="text-green-600" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-3">Producteur</h4>
                 <p className="text-gray-500 mb-6 leading-relaxed">
                   Gérez votre ferme, vendez directement sans intermédiaires et augmentez vos revenus grâce à nos outils digitaux.
                 </p>
                 <ul className="space-y-3 mb-8">
                   {['Accès direct au marché', 'Gestion des stocks', 'Paiement instantané', 'Conseils Météo & IA'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                       <CheckCircle size={16} className="text-green-500" /> {item}
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="px-8 pb-8">
                 <button onClick={onStart} className="w-full py-4 rounded-xl border-2 border-green-50 text-green-600 font-bold hover:bg-green-50 transition-colors">
                   Accéder à l'espace
                 </button>
               </div>
            </div>

            {/* Consumer Card */}
            <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform md:-translate-y-4">
               <div className="h-2 bg-blue-500 w-full" />
               <div className="p-8">
                 <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <ShoppingBag size={32} className="text-blue-600" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-3">Consommateur</h4>
                 <p className="text-gray-500 mb-6 leading-relaxed">
                   Accédez à des produits frais, locaux et de saison. Commandez en quelques clics et faites-vous livrer.
                 </p>
                 <ul className="space-y-3 mb-8">
                   {['Produits 100% locaux', 'Traçabilité garantie', 'Livraison express', 'Prix équitables'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                       <CheckCircle size={16} className="text-blue-500" /> {item}
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="px-8 pb-8">
                 <button onClick={onStart} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">
                   Commencer mes achats
                 </button>
               </div>
            </div>

            {/* Investor Card */}
            <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
               <div className="h-2 bg-purple-500 w-full" />
               <div className="p-8">
                 <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <TrendingUp size={32} className="text-purple-600" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-3">Investisseur</h4>
                 <p className="text-gray-500 mb-6 leading-relaxed">
                   Financez l'agriculture de demain. Suivez vos investissements et profitez d'un ROI attractif.
                 </p>
                 <ul className="space-y-3 mb-8">
                   {['Opportunités vérifiées', 'Suivi de portefeuille', 'Analyses de marché', 'Impact social'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                       <CheckCircle size={16} className="text-purple-500" /> {item}
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="px-8 pb-8">
                 <button onClick={onStart} className="w-full py-4 rounded-xl border-2 border-purple-50 text-purple-600 font-bold hover:bg-purple-50 transition-colors">
                   Voir les opportunités
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / How it works */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                 Une Vision pour le Sénégal
               </h2>
               <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                 AgriShare n'est pas seulement une application, c'est un mouvement. Nous visons à réduire les pertes post-récolte, assurer la sécurité alimentaire et créer de la richesse dans nos zones rurales.
               </p>
               <div className="space-y-4">
                 <div className="flex gap-4">
                   <div className="bg-white p-3 rounded-lg shadow-sm h-fit"><Globe className="text-green-600" /></div>
                   <div>
                     <h4 className="font-bold text-gray-900">Souveraineté Alimentaire</h4>
                     <p className="text-sm text-gray-500">Réduire les importations en valorisant la production locale.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="bg-white p-3 rounded-lg shadow-sm h-fit"><ShieldCheck className="text-green-600" /></div>
                   <div>
                     <h4 className="font-bold text-gray-900">Confiance & Transparence</h4>
                     <p className="text-sm text-gray-500">Chaque acteur est vérifié, chaque produit est tracé.</p>
                   </div>
                 </div>
               </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-transparent opacity-20 rounded-3xl transform rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Ferme Sénégal" 
                 className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-500"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-green-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à rejoindre l'aventure ?</h2>
          <p className="text-green-100 mb-10 text-lg">
            Que vous soyez au champ, en ville ou au bureau, AgriShare vous connecte à l'essentiel.
          </p>
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-yellow-400 hover:bg-yellow-500 text-green-900 text-xl font-bold rounded-full shadow-lg hover:shadow-yellow-400/50 transition-all transform hover:-translate-y-1"
          >
            Créer mon compte gratuitement
          </button>
          <p className="mt-6 text-sm text-green-300">
            Déjà inscrit ? <button onClick={onLogin} className="text-white underline font-bold">Connectez-vous</button>
          </p>
        </div>
      </section>

      <footer className="bg-green-950 text-green-400 py-10 px-4 text-center text-sm">
        <p>© 2024 AgriShare Sénégal. Tous droits réservés.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-white">Conditions</a>
          <a href="#" className="hover:text-white">Confidentialité</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;