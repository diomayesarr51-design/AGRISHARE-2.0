import React, { useState } from 'react';
import { FarmerProfile, Coordinates } from '../types';
import { Camera, MapPin, User, Check, Sprout, ChevronRight } from 'lucide-react';

interface FarmerOnboardingProps {
  onComplete: (profile: FarmerProfile) => void;
}

const FarmerOnboarding: React.FC<FarmerOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    farmName: '',
    farmSize: '',
    categories: [] as string[]
  });

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = () => {
    // Mock creation
    const profile: FarmerProfile = {
      id: 'new-farmer-1',
      fullName: formData.fullName,
      phone: formData.phone,
      farmName: formData.farmName,
      location: { lat: 14.7, lng: -17.4 }, // Mock GPS
      address: 'Zone Niayes, Sénégal',
      farmSize: parseFloat(formData.farmSize) || 1,
      certifications: ['Local'],
      isVerified: false,
      joinedDate: new Date()
    };
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
          <div 
            className="h-full bg-senegal-green transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="flex-1 p-8">
          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-agri-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Bienvenue !</h2>
                <p className="text-gray-500">Commençons par faire connaissance.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                    placeholder="Ex: Moussa Diop"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (WhatsApp)</label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                    placeholder="Ex: 77 123 45 67"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.fullName || !formData.phone}
                className="w-full bg-agri-primary text-white py-3 rounded-lg font-bold hover:bg-agri-dark transition-colors disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          )}

          {/* STEP 2: Farm Info */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout size={40} className="text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Votre Ferme</h2>
                <p className="text-gray-500">Parlez-nous de votre exploitation.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la ferme</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                    placeholder="Ex: Ferme de la Vallée"
                    value={formData.farmName}
                    onChange={e => setFormData({...formData, farmName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (Hectares)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                    placeholder="Ex: 2.5"
                    value={formData.farmSize}
                    onChange={e => setFormData({...formData, farmSize: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.farmName}
                className="w-full bg-agri-primary text-white py-3 rounded-lg font-bold hover:bg-agri-dark transition-colors disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={40} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Localisation</h2>
                <p className="text-gray-500">Pour que les clients vous trouvent.</p>
              </div>

              <div className="bg-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <MapPin size={32} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium">Position GPS détectée</p>
                <p className="text-xs text-gray-500 mt-1">Zone Niayes, Sénégal (Simulation)</p>
                <button className="mt-4 text-agri-primary text-sm font-bold underline">
                  Modifier manuellement
                </button>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-agri-primary text-white py-3 rounded-lg font-bold hover:bg-agri-dark transition-colors"
              >
                Confirmer la position
              </button>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <Check size={50} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">C'est tout bon !</h2>
              <p className="text-gray-600">
                Votre profil agriculteur est créé. Vous pouvez maintenant ajouter vos premiers produits.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left text-sm text-yellow-800">
                <p className="font-bold mb-1">💡 Conseil Pro :</p>
                Ajoutez des photos claires de vos produits pour vendre 2x plus vite.
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-agri-primary text-white py-3 rounded-lg font-bold hover:bg-agri-dark transition-colors flex items-center justify-center"
              >
                Accéder à mon Tableau de Bord <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerOnboarding;