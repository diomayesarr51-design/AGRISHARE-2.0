import { DeliveryOption, Coordinates } from '../types';

// Simule un appel API vers Tiak-Tiak, Yango Delivery, ou des réseaux locaux
export const getDeliveryQuotes = async (
  pickup: Coordinates,
  dropoff: Coordinates,
  weightKg: number
): Promise<DeliveryOption[]> => {
  // Simulation de délai réseau
  await new Promise(resolve => setTimeout(resolve, 800));

  // Calcul de distance basique (Haversine simplifié pour la démo)
  // Dans la réalité, ceci appellerait l'API Tiak-Tiak
  const basePrice = 500;
  
  return [
    {
      id: 'tiak-1',
      provider: 'Tiak-Tiak',
      price: basePrice + (weightKg * 100) + 500, // Prix dynamique
      estimatedTime: 45,
      rating: 4.8
    },
    {
      id: 'moto-1',
      provider: 'Moto-Local',
      price: basePrice + (weightKg * 50), // Moins cher
      estimatedTime: 60,
      rating: 4.2
    },
    {
      id: 'coop-1',
      provider: 'Cooperative',
      price: 250, // Très bas prix mais lent
      estimatedTime: 24 * 60, // 24h
      rating: 5.0
    }
  ];
};

export const bookDelivery = async (quoteId: string, orderId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`Booking delivery ${quoteId} for order ${orderId}`);
  return true;
};