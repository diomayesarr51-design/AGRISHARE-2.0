import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, CartItem, Coordinates } from '../types';
import { Search, MapPin, Filter, ShoppingBag, Navigation as NavIcon, Clock, Plus, Minus, CreditCard, X, Bike } from 'lucide-react';

interface MarketplaceProps {
  onOrderPlaced?: (orderId: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onOrderPlaced }) => {
  // State for Geolocation & Filtering
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [radius, setRadius] = useState<number>(10); // km
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // State for Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'cash'>('wave');
  const [address, setAddress] = useState('');

  // Initial Geolocation
  useEffect(() => {
    handleGeolocation();
  }, []);

  const handleGeolocation = () => {
    setIsLoadingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLoc(false);
          setLocationError('');
        },
        (error) => {
          setIsLoadingLoc(false);
          // Fallback to Dakar Center for demo purposes if permission denied
          setUserLocation({ lat: 14.6928, lng: -17.4467 }); 
          setLocationError("Géolocalisation précise indisponible. Position par défaut: Dakar.");
        }
      );
    } else {
      setIsLoadingLoc(false);
      setUserLocation({ lat: 14.6928, lng: -17.4467 });
      setLocationError("Géolocalisation non supportée.");
    }
  };

  // Haversine Formula for distance
  const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Filter Products
  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const nearbyProducts = MOCK_PRODUCTS.map(product => {
    const dist = userLocation ? calculateDistance(userLocation, product.coordinates) : 0;
    return { ...product, distance: dist };
  }).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesRadius = userLocation ? product.distance <= radius : true;
    return matchesSearch && matchesCategory && matchesRadius;
  }).sort((a, b) => a.distance - b.distance);

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 500 : 0; // Flat fee for demo
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    // Simulate order processing
    const orderId = `AGRI-${Math.floor(Math.random() * 10000)}`;
    setCart([]);
    setIsCartOpen(false);
    setIsCheckingOut(false);
    if (onOrderPlaced) onOrderPlaced(orderId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 relative">
      {/* Geolocation Header */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-primary p-6 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <NavIcon className="mr-2" size={24} /> 
              Livraison Express
            </h1>
            <p className="text-agri-light opacity-90 text-sm mt-1">
              Produits frais détectés autour de vous
            </p>
          </div>
          
          <div className="flex items-center bg-white/10 backdrop-blur rounded-lg p-1">
            <button 
              onClick={() => setRadius(5)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${radius === 5 ? 'bg-white text-agri-dark shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              5 km
            </button>
            <button 
              onClick={() => setRadius(10)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${radius === 10 ? 'bg-white text-agri-dark shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              10 km
            </button>
            <button 
              onClick={() => setRadius(20)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${radius === 20 ? 'bg-white text-agri-dark shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              20 km
            </button>
          </div>
        </div>
        
        {locationError && (
          <div className="mt-4 bg-yellow-500/20 text-yellow-100 text-xs py-1 px-2 rounded inline-block">
            {locationError}
          </div>
        )}

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Que cherchez-vous ? (ex: Oignons, Mangues)..."
            className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-senegal-yellow shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat 
                ? 'bg-agri-dark text-white border-agri-dark' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="flex">
              <div className="w-1/3 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                  {product.freshness === 'recolte_du_jour' ? 'RÉCOLTE DU JOUR' : 'FRAIS'}
                </div>
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                       <MapPin size={10} className="mr-1" />
                       {product.distance} km
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.farmerName}</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Clock size={12} className="mr-1" />
                    Prêt en {product.preparationTime} min
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-3">
                  <div>
                     <span className="font-bold text-lg text-agri-primary">{product.price} F</span>
                     <span className="text-xs text-gray-400">/{product.unit}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 bg-agri-light text-agri-dark rounded-full hover:bg-agri-primary hover:text-white transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {nearbyProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" />
          </div>
          <p className="text-gray-500">Aucun produit trouvé dans ce rayon.</p>
          <button onClick={() => setRadius(20)} className="text-agri-primary font-medium mt-2">Élargir la recherche</button>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-agri-primary text-white p-4 rounded-full shadow-lg hover:bg-agri-dark transition-transform hover:scale-105 z-40 flex items-center gap-2"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <span className="font-bold">{cartTotal} FCFA</span>
        </button>
      )}

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2 text-agri-primary" /> Panier
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">Votre panier est vide</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                       <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                       <div>
                         <h4 className="font-bold text-sm">{item.name}</h4>
                         <p className="text-xs text-gray-500">{item.price} F / {item.unit}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Minus size={14} /></button>
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Plus size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && !isCheckingOut && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-bold">{cartTotal} FCFA</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-bold text-agri-primary">Calculé à l'étape suivante</span>
                </div>
                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-agri-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-agri-dark transition-colors"
                >
                  Commander
                </button>
              </div>
            )}

            {isCheckingOut && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 overflow-y-auto max-h-[50vh]">
                 <h3 className="font-bold mb-4">Mode de livraison</h3>
                 <div className="flex gap-2 mb-4">
                   <button 
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex-1 py-2 rounded-lg text-sm border ${deliveryType === 'delivery' ? 'bg-agri-primary text-white border-agri-primary' : 'bg-white text-gray-600'}`}
                   >
                     Livraison (+500F)
                   </button>
                   <button 
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex-1 py-2 rounded-lg text-sm border ${deliveryType === 'pickup' ? 'bg-agri-primary text-white border-agri-primary' : 'bg-white text-gray-600'}`}
                   >
                     Click & Collect
                   </button>
                 </div>

                 {deliveryType === 'delivery' && (
                   <div className="mb-4">
                     <label className="block text-xs font-bold text-gray-500 mb-1">Adresse</label>
                     <input 
                      type="text" 
                      placeholder="Quartier, Rue, Villa..."
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                     />
                   </div>
                 )}

                 <h3 className="font-bold mb-4">Paiement</h3>
                 <div className="space-y-2 mb-6">
                    <button onClick={() => setPaymentMethod('wave')} className={`w-full flex items-center justify-between p-3 border rounded-lg ${paymentMethod === 'wave' ? 'border-blue-400 bg-blue-50' : ''}`}>
                       <span className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-500 rounded-full"></div> Wave Mobile Money</span>
                       {paymentMethod === 'wave' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                    </button>
                    <button onClick={() => setPaymentMethod('cash')} className={`w-full flex items-center justify-between p-3 border rounded-lg ${paymentMethod === 'cash' ? 'border-green-400 bg-green-50' : ''}`}>
                       <span className="flex items-center gap-2"><CreditCard size={20} className="text-green-600"/> Cash à la livraison</span>
                       {paymentMethod === 'cash' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </button>
                 </div>

                 <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-agri-primary">{finalTotal} FCFA</span>
                 </div>

                 <button 
                  onClick={handleCheckout}
                  className="w-full bg-agri-dark text-white py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                 >
                   Confirmer la commande
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;