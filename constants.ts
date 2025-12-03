import { Product, Region } from './types';

// Mock coordinates centered roughly around Dakar for testing logic
// Dakar Center approx: 14.6928, -17.4467

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Oignons de Potou',
    category: 'Légumes',
    price: 450,
    unit: 'kg',
    farmerName: 'Moussa Diop',
    location: Region.LOUGA,
    coordinates: { lat: 14.7128, lng: -17.4067 }, // ~5km from center
    image: 'https://picsum.photos/400/300?random=1',
    available: true,
    rating: 4.8,
    freshness: 'recolte_du_jour',
    preparationTime: 15
  },
  {
    id: '2',
    name: 'Mangues Kent',
    category: 'Fruits',
    price: 1200,
    unit: 'kg',
    farmerName: 'Coopérative Casamance',
    location: Region.ZIGUINCHOR,
    coordinates: { lat: 14.6828, lng: -17.4367 }, // ~2km from center
    image: 'https://picsum.photos/400/300?random=2',
    available: true,
    rating: 4.9,
    freshness: 'recolte_hier',
    preparationTime: 10
  },
  {
    id: '3',
    name: 'Patates Douces',
    category: 'Tubercules',
    price: 300,
    unit: 'kg',
    farmerName: 'Fatou Ndiaye',
    location: Region.THIES,
    coordinates: { lat: 14.7528, lng: -17.3867 }, // ~10km from center
    image: 'https://picsum.photos/400/300?random=3',
    available: true,
    rating: 4.5,
    freshness: 'stock',
    preparationTime: 20
  },
  {
    id: '4',
    name: 'Riz de la Vallée',
    category: 'Céréales',
    price: 400,
    unit: 'kg',
    farmerName: 'GIE Richard Toll',
    location: Region.SAINT_LOUIS,
    coordinates: { lat: 14.8928, lng: -17.2467 }, // ~30km (far)
    image: 'https://picsum.photos/400/300?random=4',
    available: true,
    rating: 4.7,
    freshness: 'stock',
    preparationTime: 5
  },
  {
    id: '5',
    name: 'Tomates Cerises',
    category: 'Légumes',
    price: 800,
    unit: 'kg',
    farmerName: 'Jardin Bio Niayes',
    location: Region.DAKAR,
    coordinates: { lat: 14.6950, lng: -17.4490 }, // Very close (<1km)
    image: 'https://picsum.photos/400/300?random=5',
    available: true, // Changed to true for demo
    rating: 4.6,
    freshness: 'recolte_du_jour',
    preparationTime: 12
  },
  {
    id: '6',
    name: 'Arachide Coque',
    category: 'Légumineuses',
    price: 350,
    unit: 'kg',
    farmerName: 'Saloum Agro',
    location: Region.KAOLACK,
    coordinates: { lat: 14.6528, lng: -17.4167 }, // ~6km
    image: 'https://picsum.photos/400/300?random=6',
    available: true,
    rating: 4.9,
    freshness: 'stock',
    preparationTime: 10
  }
];

export const REGIONS_LIST = Object.values(Region);

export const SYSTEM_INSTRUCTION_AI = `
You are "Agri-Expert", an advanced AI assistant for the AgriShare Senegal platform. 
Your goal is to assist farmers, investors, and consumers in Senegal.
Context:
- Senegal Geography: Know regions like Niayes (vegetables), Casamance (fruits), Peanut Basin (groundnuts).
- Currency: FCFA (XOF).
- Seasons: Hivernage (rainy season), Contre-saison (dry season).
- Languages: Answer in French (default) but understand context if Wolof terms are used (e.g., 'ceebu jën', 'mafé').

Capabilities:
1. Yield Prediction: Estimate crop yields based on soil, region, and season.
2. Soil Analysis: Interpret descriptions of soil (sandy, clay, laterite) and suggest crops.
3. Market Advice: Suggest when to sell based on typical price trends in Senegal.
4. Investment Advice: Analyze ROI for crops like Cashew, Onion, or Mango.

Keep answers concise, practical, and helpful for a mobile-first user base.
`;