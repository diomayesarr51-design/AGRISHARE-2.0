import React, { useState } from 'react';
import { User, MapPin, Building, Globe, Check, ArrowRight, ArrowLeft, Upload, Sprout } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthUser, UserType } from '../types';

interface RegistrationScreenProps {
  userType: UserType;
  phoneOrEmail: string;
  onRegistrationComplete: (user: AuthUser) => void;
  onBack: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ 
  userType, 
  phoneOrEmail, 
  onRegistrationComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State unifié mais utilisé différemment selon le rôle
  const [formData, setFormData] = useState({
    fullName: '',
    // Farmer
    farmName: '',
    location: '',
    productions: [] as string[],
    docUploaded: false,
    // Investor
    companyName: '',
    website: '',
    isProfessional: false,
    sectors: [] as string[],
    // Consumer
    address: '',
    preferences: [] as string[],
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulation appel API
      const user = await authService.completeRegistration(phoneOrEmail, formData.fullName, userType);
      onRegistrationComplete(user);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // --- FORMULAIRE PRODUCTEUR (STEPPER) ---
  if (userType === UserType.FARMER) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Progress Header */}
          <div className="bg-green-600 p-6 text-white">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={currentStep > 1 ? () => setCurrentStep(s => s - 1) : onBack}>
                <ArrowLeft />
              </button>
              <h1 className="text-xl font-bold">Inscription Producteur</h1>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80 mb-2">
              <span>Identité</span>
              <span>Ferme</span>
              <span>Valid.</span>
            </div>
            <div className="h-1 bg-green-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500" 
                style={{ width: `${(currentStep / 3) * 100}%` }} 
              />
            </div>
          </div>

          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">Qui êtes-vous ?</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input 
                    type="text" 
                    autoFocus
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Moussa Diop"
                    value={formData.fullName}
                    onChange={e => updateForm('fullName', e.target.value)}
                  />
                </div>
                <button 
                  disabled={!formData.fullName}
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-green-700 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">Votre Exploitation</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la ferme</label>
                  <input 
                    type="text" 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ferme de la Vallée"
                    value={formData.farmName}
                    onChange={e => updateForm('farmName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (Ville/Zone)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Niayes"
                      value={formData.location}
                      onChange={e => updateForm('location', e.target.value)}
                    />
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Productions principales</label>
                   <div className="flex flex-wrap gap-2">
                     {['Légumes', 'Fruits', 'Céréales', 'Élevage'].map(p => (
                       <button
                         key={p}
                         onClick={() => {
                            const newP = formData.productions.includes(p) 
                              ? formData.productions.filter(i => i !== p)
                              : [...formData.productions, p];
                            updateForm('productions', newP);
                         }}
                         className={`px-3 py-1 rounded-full text-sm border ${formData.productions.includes(p) ? 'bg-green-100 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200'}`}
                       >
                         {p}
                       </button>
                     ))}
                   </div>
                </div>
                <button 
                  disabled={!formData.farmName || !formData.location}
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-green-700 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">Validation</h2>
                
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-1">Document d'identification</h3>
                  <p className="text-sm text-blue-700 mb-4">Requis pour vérifier votre statut professionnel.</p>
                  <button 
                    onClick={() => updateForm('docUploaded', !formData.docUploaded)}
                    className={`w-full py-3 rounded-lg border border-dashed flex items-center justify-center gap-2 ${formData.docUploaded ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-blue-300 text-blue-500'}`}
                  >
                    {formData.docUploaded ? <><Check size={18}/> Document reçu</> : <><Upload size={18}/> Téléverser une photo</>}
                  </button>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check className="text-green-600" size={20} />
                      <span className="text-sm text-gray-600">J'accepte les conditions de vente</span>
                   </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-green-700 disabled:opacity-50 flex justify-center"
                >
                  {isLoading ? "Création..." : "CRÉER MON ESPACE FERME"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULAIRE INVESTISSEUR ---
  if (userType === UserType.INVESTOR) {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-purple-600 p-6 text-white flex items-center gap-4">
            <button onClick={onBack}><ArrowLeft /></button>
            <h1 className="text-xl font-bold">Profil Investisseur</h1>
          </div>
          
          <div className="p-8 space-y-5">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.fullName}
                  onChange={e => updateForm('fullName', e.target.value)}
                />
             </div>
             
             <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  checked={formData.isProfessional} 
                  onChange={e => updateForm('isProfessional', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <span className="text-gray-700">Je suis un investisseur professionnel</span>
             </div>

             {formData.isProfessional && (
               <div className="space-y-4 animate-fadeIn">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Société</label>
                    <div className="relative">
                      <input type="text" className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Invest Corp" value={formData.companyName} onChange={e => updateForm('companyName', e.target.value)} />
                      <Building className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
                    <div className="relative">
                      <input type="text" className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="www.exemple.com" value={formData.website} onChange={e => updateForm('website', e.target.value)} />
                      <Globe className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                 </div>
               </div>
             )}

             <button 
                onClick={handleSubmit}
                disabled={!formData.fullName}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-purple-700 disabled:opacity-50"
             >
                {isLoading ? "Finalisation..." : "ACCÉDER AUX OPPORTUNITÉS"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULAIRE CONSOMMATEUR (SIMPLE) ---
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
         <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
            <button onClick={onBack}><ArrowLeft /></button>
            <h1 className="text-xl font-bold">Profil Consommateur</h1>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="text-center mb-4">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                 <User size={32} />
               </div>
               <h2 className="text-xl font-bold text-gray-800">Bienvenue !</h2>
               <p className="text-gray-500">Finalisons votre inscription en quelques secondes.</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Fatou Ndiaye"
                  value={formData.fullName}
                  onChange={e => updateForm('fullName', e.target.value)}
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison (Optionnel)</label>
                <div className="relative">
                  <input type="text" className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dakar, Quartier..." value={formData.address} onChange={e => updateForm('address', e.target.value)} />
                  <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                </div>
             </div>

             <button 
                onClick={handleSubmit}
                disabled={!formData.fullName}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 disabled:opacity-50"
             >
                {isLoading ? "Chargement..." : "COMMENCER MES ACHATS"}
             </button>
          </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;