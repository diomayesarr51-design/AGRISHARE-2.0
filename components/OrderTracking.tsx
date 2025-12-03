import React, { useState, useEffect } from 'react';
import { Bike, CheckCircle, Clock, MapPin, Phone, Package } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, onBack }) => {
  const [status, setStatus] = useState(0); // 0: Confirmed, 1: Preparing, 2: On way, 3: Delivered

  // Simulate status updates
  useEffect(() => {
    const timer1 = setTimeout(() => setStatus(1), 3000);
    const timer2 = setTimeout(() => setStatus(2), 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { label: "Confirmé", icon: <CheckCircle size={18} />, time: "14:30" },
    { label: "Préparation", icon: <Package size={18} />, time: "14:35" },
    { label: "En route", icon: <Bike size={18} />, time: "14:50" },
    { label: "Livré", icon: <MapPin size={18} />, time: "--:--" },
  ];

  return (
    <div className="bg-white min-h-[80vh] rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
       {/* Map Placeholder */}
       <div className="h-64 bg-gray-200 relative w-full">
         <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png')] bg-cover bg-center grayscale"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            {status === 2 && (
                <div className="bg-agri-primary text-white p-2 rounded-full shadow-xl animate-bounce">
                    <Bike size={32} />
                </div>
            )}
            {status < 2 && (
                <div className="bg-agri-dark text-white p-2 rounded-full shadow-xl">
                    <MapPin size={32} />
                </div>
            )}
         </div>
         <button 
           onClick={onBack}
           className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold"
         >
            ← Retour
         </button>
       </div>

       <div className="p-6">
         <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Commande #{orderId}</h2>
                <p className="text-gray-500">Arrivée estimée: <span className="text-agri-primary font-bold">15:10</span></p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                EN COURS
            </div>
         </div>

         {/* Stepper */}
         <div className="relative flex justify-between items-center mb-8">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-agri-primary -z-10 transition-all duration-1000"
                style={{ width: `${(status / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        index <= status ? 'bg-agri-primary border-agri-primary text-white' : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                        {step.icon}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${index <= status ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                    </span>
                </div>
            ))}
         </div>

         {/* Driver Info */}
         {status >= 2 && (
            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100 mb-6 animate-slideUp">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=driver" alt="Driver" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Ibrahima Fall</h4>
                        <p className="text-xs text-gray-500">Livreur Jakarta • Yamaha T-120</p>
                    </div>
                </div>
                <button className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-agri-primary hover:bg-agri-primary hover:text-white transition-colors">
                    <Phone size={20} />
                </button>
            </div>
         )}

         <div className="space-y-3">
            <h3 className="font-bold text-gray-800">Détails</h3>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Oignons de Potou (2kg)</span>
                <span>900 F</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frais de livraison</span>
                <span>500 F</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>1400 FCFA</span>
            </div>
         </div>
       </div>
    </div>
  );
};

export default OrderTracking;