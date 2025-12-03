import React from 'react';

export enum UserType {
  GUEST = 'guest',
  FARMER = 'farmer',
  CONSUMER = 'consumer',
  INVESTOR = 'investor'
}

export interface AuthUser {
  id: string;
  phone: string;
  fullName: string;
  type: UserType;
  farmName?: string; // Spécifique farmer
  token: string;
  refreshToken: string;
  profileData?: any; // Données spécifiques au rôle
}

export interface ConsumerProfile {
  deliveryAddress: string;
  preferences: string[];
}

export interface InvestorProfile {
  companyName?: string;
  budgetRange: string;
  sectors: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';
export type SalesChannel = 'B2C' | 'B2B' | 'BOTH';

export interface ProductSpecs {
  variety: string;
  productionMode: 'Bio' | 'Conventionnel' | 'Raisonné' | 'Permaculture';
  certifications: string[];
  harvestDate: Date;
  origin: string;
  weightUnit: string;
  quality: 'Premium' | 'Standard' | 'Industrie';
}

export interface ProductPricing {
  b2cPrice: number;
  b2cMinQty: number;
  b2bPrice: number;
  b2bMinQty: number;
  b2bPaymentTerms?: string;
}

// Gestion Images Avancée
export type ImageType = 'main' | 'gallery' | 'certification' | 'farm';

export interface ProductImage {
  id: string;
  url: string;
  type: ImageType;
  isPrimary: boolean;
  aiScore?: number; // Score qualité IA
  tags?: string[];
}

// Gestion Lots & Traçabilité
export interface ProductBatch {
  id: string;
  batchNumber: string; // ex: LOT-2024-11-01
  harvestDate: Date;
  expiryDate?: Date;
  initialQuantity: number;
  currentQuantity: number;
  location?: string; // Entrepôt A, Frigo 2...
  notes?: string;
}

// Historique Mouvements
export interface StockMovement {
  id: string;
  date: Date;
  type: 'production' | 'sale' | 'loss' | 'adjustment' | 'restock';
  quantity: number; // Positif ou négatif
  reason?: string;
  referenceId?: string; // ID Commande ou ID Culture
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Prix affiché par défaut (souvent B2C)
  unit: string;
  farmerName: string;
  location: string;
  coordinates: Coordinates;
  image: string; // Gardé pour compatibilité UI simple
  available: boolean;
  rating: number;
  freshness: 'recolte_du_jour' | 'recolte_hier' | 'stock';
  preparationTime: number;
}

// Gestion Avancée Agriculteur
export interface FarmerProfile {
  id: string;
  farmName: string;
  fullName: string;
  phone: string;
  location: Coordinates;
  address: string;
  farmSize: number; // hectares
  certifications: string[]; // 'Bio', 'Local', etc.
  isVerified: boolean;
  joinedDate: Date;
}

export interface Crop {
  id: number | string;
  name: string;
  stage: 'Semis' | 'Croissance' | 'Floraison' | 'Maturation' | 'Récolte';
  planted: string;
  harvest: string;
  progress: number;
  health: 'Excellent' | 'Bon' | 'Surveillance' | 'Critique';
  estimatedYield?: number; // kg
  img?: string;
}

export interface CatalogProduct extends Product {
  stockQuantity: number;
  minStockThreshold: number;
  soldQuantity: number;
  // Champs étendus pour le catalogue
  status: ProductStatus;
  channels: SalesChannel;
  description: string;
  media: ProductImage[]; // Galerie complète
  specs: ProductSpecs;
  pricing: ProductPricing;
  batches: ProductBatch[]; // Gestion des lots
  movements: StockMovement[]; // Historique
  views: number;
  lastUpdated: Date;
  syncStatus: {
    b2c: 'synced' | 'pending' | 'error';
    b2b: 'synced' | 'pending' | 'error';
  };
}

// Alias pour compatibilité si nécessaire, mais on utilisera CatalogProduct principalement
export type InventoryItem = CatalogProduct;

export interface DeliveryOption {
  id: string;
  provider: 'Tiak-Tiak' | 'Moto-Local' | 'Cooperative' | 'Auto';
  price: number;
  estimatedTime: number; // minutes
  rating: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Region {
  DAKAR = 'Dakar',
  THIES = 'Thiès',
  SAINT_LOUIS = 'Saint-Louis',
  KAOLACK = 'Kaolack',
  ZIGUINCHOR = 'Ziguinchor',
  DIOURBEL = 'Diourbel',
  TAMBACOUNDA = 'Tambacounda',
  LOUGA = 'Louga'
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready_to_ship' | 'shipping' | 'delivered';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryOption?: DeliveryOption;
  estimatedTime: Date;
  date: Date;
  shippingProvider?: string;
  trackingNumber?: string;
}