import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Package, Users, Droplets, Sun, Wind, Plus, AlertTriangle, 
  ShoppingBag, Truck, MapPin, Edit2, Trash2, Clock, X, Search, Filter, 
  Save, Image as ImageIcon, CheckCircle, Calendar, Sprout, Tractor, 
  ArrowLeft, Copy, Sparkles, RefreshCw, Box, Printer, FileText, Send,
  Layers, Scan, History, AlertOctagon, MoreHorizontal, ChevronDown, Upload, Camera, Globe
} from 'lucide-react';
import { FarmerProfile, CatalogProduct, Order, Crop, OrderStatus, ProductStatus, ProductImage, ProductBatch, StockMovement } from '../types';
import FarmerOnboarding from './FarmerOnboarding';

// --- PROPS INTERFACES ---
interface ProductionTabProps {
  crops: Crop[];
  onAddCrop: (crop: Partial<Crop>) => void;
  onUpdateCrop: (id: string | number, updates: Partial<Crop>) => void;
  onHarvest: (id: string | number) => void;
}

interface CatalogTabProps {
  products: CatalogProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CatalogProduct[]>>;
}

interface OrdersTabProps {
  orders: Order[];
  onProcessOrder: (orderId: string) => void;
}

// --- SUB-COMPONENTS INTERNES ---

// Gestionnaire d'Images Avancé
const MediaManager = ({ media, onChange }: { media: ProductImage[], onChange: (m: ProductImage[]) => void }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = () => {
    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: `https://picsum.photos/400/300?random=${Math.random()}`,
      type: media.length === 0 ? 'main' : 'gallery',
      isPrimary: media.length === 0,
      aiScore: undefined
    };
    onChange([...media, newImage]);
  };

  const analyzeImage = (id: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      onChange(media.map(m => m.id === id ? { ...m, aiScore: Math.floor(Math.random() * 30) + 70, tags: ['Frais', 'Bio', 'Légume'] } : m));
      setAnalyzing(false);
    }, 1500);
  };

  const setPrimary = (id: string) => {
    onChange(media.map(m => ({ ...m, isPrimary: m.id === id })));
  };

  const removeImage = (id: string) => {
    onChange(media.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 uppercase">Galerie Média</label>
        <button type="button" onClick={handleUpload} className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold hover:bg-gray-200 flex items-center gap-1">
          <Upload size={12}/> Ajouter
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((img) => (
          <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 ${img.isPrimary ? 'border-agri-primary' : 'border-gray-200'}`}>
             <img src={img.url} className="w-full h-32 object-cover" />
             {img.isPrimary && <div className="absolute top-1 left-1 bg-agri-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Principal</div>}
             {img.aiScore && (
               <div className={`absolute top-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${img.aiScore > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                 <Sparkles size={8}/> IA: {img.aiScore}%
               </div>
             )}
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                <div className="flex gap-2">
                   {!img.isPrimary && (
                      <button onClick={() => setPrimary(img.id)} className="p-1.5 bg-white rounded-full hover:bg-green-100 text-green-700" title="Définir principal"><CheckCircle size={14}/></button>
                   )}
                   <button onClick={() => analyzeImage(img.id)} className="p-1.5 bg-white rounded-full hover:bg-purple-100 text-purple-700" title="Analyser Qualité"><Sparkles size={14}/></button>
                   <button onClick={() => removeImage(img.id)} className="p-1.5 bg-white rounded-full hover:bg-red-100 text-red-700" title="Supprimer"><Trash2 size={14}/></button>
                </div>
                {analyzing && <span className="text-white text-[10px] animate-pulse">Analyse...</span>}
             </div>
          </div>
        ))}
        <button type="button" onClick={handleUpload} className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-agri-primary hover:text-agri-primary transition-colors">
           <Camera size={24} className="mb-2"/>
           <span className="text-xs font-bold">Ajouter Photo</span>
        </button>
      </div>
    </div>
  );
};

// Gestionnaire de Lots
const BatchManager = ({ batches, onChange }: { batches: ProductBatch[], onChange: (b: ProductBatch[]) => void }) => {
  const addBatch = () => {
    const newBatch: ProductBatch = {
      id: Date.now().toString(),
      batchNumber: `LOT-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
      harvestDate: new Date(),
      initialQuantity: 100,
      currentQuantity: 100,
      location: 'Entrepôt A'
    };
    onChange([newBatch, ...batches]);
  };

  const updateBatch = (id: string, field: string, value: any) => {
    onChange(batches.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 uppercase">Lots & Traçabilité</label>
        <button type="button" onClick={addBatch} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 flex items-center gap-1">
          <Plus size={12}/> Nouveau Lot
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
             <tr>
               <th className="p-3">Numéro Lot</th>
               <th className="p-3">Récolte</th>
               <th className="p-3 text-center">Qté Init.</th>
               <th className="p-3 text-center">Qté Actuelle</th>
               <th className="p-3">Lieu</th>
             </tr>
          </thead>
          <tbody>
             {batches.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">Aucun lot enregistré.</td></tr>
             ) : (
                batches.map(batch => (
                  <tr key={batch.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                     <td className="p-3 font-mono font-bold text-gray-700">{batch.batchNumber}</td>
                     <td className="p-3">{new Date(batch.harvestDate).toLocaleDateString()}</td>
                     <td className="p-3 text-center text-gray-500">{batch.initialQuantity}</td>
                     <td className="p-3 text-center">
                        <input 
                          type="number" 
                          value={batch.currentQuantity} 
                          onChange={(e) => updateBatch(batch.id, 'currentQuantity', parseInt(e.target.value))}
                          className="w-16 p-1 border rounded text-center font-bold"
                        />
                     </td>
                     <td className="p-3 text-gray-500">{batch.location}</td>
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 1. Overview Tab
const OverviewTab = () => {
  const revenueData = [
    { name: 'Sem 1', revenu: 150000, depense: 80000 },
    { name: 'Sem 2', revenu: 230000, depense: 120000 },
    { name: 'Sem 3', revenu: 180000, depense: 90000 },
    { name: 'Sem 4', revenu: 320000, depense: 150000 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl flex items-center gap-2">
                <MapPin size={20} className="text-yellow-400"/> Météo: Niayes
              </h3>
              <p className="text-blue-100 mt-1">Conditions idéales pour les semis</p>
              <div className="mt-6 flex items-center gap-8">
                 <div>
                    <p className="text-4xl font-bold">28°C</p>
                    <p className="text-sm opacity-80">Ensoleillé</p>
                 </div>
                 <div className="h-10 w-px bg-white/20"></div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm"><Droplets size={16}/> Humidité: 65%</div>
                    <div className="flex items-center gap-2 text-sm"><Wind size={16}/> Vent: 12 km/h NE</div>
                 </div>
              </div>
            </div>
            <Sun size={64} className="text-yellow-400 animate-spin-slow opacity-90" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
           <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20}/> Alertes Production
              </h3>
              <div className="space-y-3">
                 <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex gap-2 items-center">
                    <AlertTriangle size={16}/> <strong>Stock Critique :</strong> Oignons (5kg)
                 </div>
                 <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-100 flex gap-2 items-center">
                    <Tractor size={16}/> <strong>Maintenance :</strong> Tracteur J-2
                 </div>
              </div>
           </div>
           <button className="w-full mt-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg">
             Voir le calendrier
           </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Performance Financière</h3>
          <select className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg p-2">
            <option>Ce mois</option>
            <option>Cette année</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenu" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} name="Revenus" />
              <Area type="monotone" dataKey="depense" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Dépenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 2. Production Tab
const ProductionTab: React.FC<ProductionTabProps> = ({ crops, onAddCrop, onUpdateCrop, onHarvest }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropName, setNewCropName] = useState('');

  const handleCreate = () => {
    if (!newCropName) return;
    onAddCrop({ name: newCropName });
    setNewCropName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Suivi des Cultures</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-agri-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-agri-dark"
          >
             <Plus size={18} /> Nouvelle Culture
          </button>
       </div>
       {showAddModal && (
         <div className="bg-white p-4 rounded-xl border border-green-200 shadow-lg mb-4 animate-slideUp">
            <h3 className="font-bold text-gray-800 mb-2">Ajouter une nouvelle culture</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nom de la culture" 
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
              />
              <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">Créer</button>
              <button onClick={() => setShowAddModal(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">Annuler</button>
            </div>
         </div>
       )}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
             <div key={crop.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-agri-primary">
                         <Sprout size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-800">{crop.name}</h3>
                         <p className="text-xs text-gray-500">Planté le {crop.planted}</p>
                      </div>
                   </div>
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      crop.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                      crop.health === 'Bon' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                      {crop.health}
                   </span>
                </div>
                <div className="p-5 space-y-4">
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-gray-600">Stade: <strong>{crop.stage}</strong></span>
                         <span className="font-bold text-agri-primary">{crop.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                         <div className="bg-agri-primary h-2 rounded-full transition-all duration-500" style={{width: `${crop.progress}%`}}></div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center pt-2 gap-2">
                      <button 
                        onClick={() => onUpdateCrop(crop.id, { progress: Math.min(100, crop.progress + 10) })}
                        className="flex-1 text-xs border border-gray-300 text-gray-600 px-3 py-2 rounded-lg font-bold hover:bg-gray-50"
                      >
                         Mettre à jour
                      </button>
                      <button 
                        onClick={() => onHarvest(crop.id)}
                        className={`flex-1 text-xs px-3 py-2 rounded-lg font-bold transition-colors ${
                          crop.stage === 'Récolte' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        disabled={crop.stage === 'Récolte'}
                      >
                         {crop.stage === 'Récolte' ? 'Récolté' : 'Déclarer Récolte'}
                      </button>
                   </div>
                </div>
             </div>
          ))}
          <button className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-agri-primary hover:text-agri-primary hover:bg-green-50/50 transition-all min-h-[200px]">
             <Tractor size={40} className="mb-2" />
             <span className="font-bold">Planifier une parcelle (IA)</span>
          </button>
       </div>
    </div>
  );
};

// 3. Catalog & Stock Tab
const CatalogTab: React.FC<CatalogTabProps> = ({ products, setProducts }) => {
  const [view, setView] = useState<'dashboard' | 'list' | 'form'>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);

  const StockDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold">Valeur Stock</p>
               <p className="text-2xl font-bold text-gray-800">2.4M F</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Package size={24}/></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold">Produits Actifs</p>
               <p className="text-2xl font-bold text-green-700">{products.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full"><CheckCircle size={24}/></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold">Ruptures</p>
               <p className="text-2xl font-bold text-red-700">{products.filter(p => p.stockQuantity <= 0).length}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-full"><AlertOctagon size={24}/></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-gray-500 text-xs uppercase font-bold">Mouvements (7j)</p>
               <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><History size={24}/></div>
         </div>
      </div>
      <div className="flex gap-4">
         <button onClick={() => setView('list')} className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-agri-primary hover:shadow-md transition-all text-left group">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-agri-primary mb-2 flex items-center gap-2"><Layers size={20}/> Gérer le Catalogue</h3>
            <p className="text-sm text-gray-500">Ajouter des produits, modifier les prix, gérer les photos et les fiches.</p>
         </button>
         <button className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all text-left group">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 mb-2 flex items-center gap-2"><Scan size={20}/> Inventaire Rapide</h3>
            <p className="text-sm text-gray-500">Scanner des codes-barres ou faire un comptage manuel du stock.</p>
         </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
         <h3 className="font-bold text-gray-800 mb-4">Derniers Mouvements de Stock</h3>
         <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
               <tr>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Produit</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2 text-right">Quantité</th>
               </tr>
            </thead>
            <tbody>
               <tr className="border-b border-gray-50">
                  <td className="py-3">15 Nov 14:30</td>
                  <td className="font-bold">Oignons Potou</td>
                  <td><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Production</span></td>
                  <td className="text-right font-mono text-green-600">+500 kg</td>
               </tr>
               <tr className="border-b border-gray-50">
                  <td className="py-3">15 Nov 10:15</td>
                  <td className="font-bold">Tomates Cerises</td>
                  <td><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Vente B2C</span></td>
                  <td className="text-right font-mono text-blue-600">-12 kg</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );

  const CatalogListView = () => {
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const filteredProducts = products.filter(p => filterStatus === 'all' || p.status === filterStatus);
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
           <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-bold"><ArrowLeft size={16} className="mr-1"/> Retour Dashboard</button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button onClick={() => setFilterStatus('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>Tous</button>
              <button onClick={() => setFilterStatus('active')} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>En vente</button>
              <button onClick={() => setFilterStatus('draft')} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterStatus === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>Brouillons</button>
           </div>
           <button onClick={() => { setEditingId(null); setView('form'); }} className="w-full md:w-auto bg-agri-primary text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-agri-dark shadow-sm">
              <Plus size={18} /> Nouveau Produit
           </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                <th className="p-4">Produit</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Lots</th>
                <th className="p-4">Prix B2C</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-0 group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative">
                         <img src={p.media?.[0]?.url || p.image} alt="" className="w-full h-full object-cover"/>
                       </div>
                       <div><p className="font-bold text-gray-800">{p.name}</p><p className="text-xs text-gray-500">{p.category}</p></div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold">{p.stockQuantity} {p.unit}</td>
                  <td className="p-4 text-center">{p.batches?.length || 0}</td>
                  <td className="p-4 font-mono">{p.pricing?.b2cPrice} F</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status === 'active' ? 'Actif' : 'Brouillon'}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                     <button onClick={() => { setEditingId(p.id); setView('form'); }} className="p-1 text-gray-500 hover:text-blue-600"><Edit2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CatalogFormView = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CatalogProduct>(
      editingId ? products.find(p => p.id === editingId) as CatalogProduct : {
        id: '', name: '', category: 'Légumes', price: 0, unit: 'kg', farmerName: '', location: '', coordinates: {lat:0, lng:0},
        image: '', available: true, rating: 0, freshness: 'recolte_du_jour', preparationTime: 0,
        status: 'draft', channels: 'B2C', description: '', media: [], batches: [], movements: [],
        specs: { variety: '', productionMode: 'Conventionnel', certifications: [], harvestDate: new Date(), origin: '', weightUnit: 'kg', quality: 'Standard' },
        pricing: { b2cPrice: 0, b2cMinQty: 1, b2bPrice: 0, b2bMinQty: 50 }, stockQuantity: 0, minStockThreshold: 10, soldQuantity: 0, views: 0, lastUpdated: new Date(),
        syncStatus: { b2c: 'pending', b2b: 'pending' }
      } as CatalogProduct
    );
    const handleSave = () => {
      const totalStock = formData.batches.length > 0 ? formData.batches.reduce((acc, b) => acc + b.currentQuantity, 0) : formData.stockQuantity;
      const finalData = { ...formData, stockQuantity: totalStock, lastUpdated: new Date() };
      setProducts(prev => editingId ? prev.map(p => p.id === editingId ? finalData : p) : [...prev, { ...finalData, id: Date.now().toString(), status: 'active' }]);
      setView('list');
    };
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
         <div className="flex justify-between items-center mb-6 pb-4 border-b">
           <div className="flex items-center gap-4"><button onClick={() => setView('list')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ArrowLeft size={18}/></button><h3 className="font-bold text-lg text-gray-900">{editingId ? 'Modifier' : 'Créer'}</h3></div>
           <button onClick={handleSave} className="px-6 py-2 bg-agri-primary text-white rounded-lg font-bold hover:bg-agri-dark flex items-center gap-2"><Save size={18}/> Enregistrer</button>
         </div>
         <div className="grid grid-cols-4 gap-2 mb-8">
            {['Infos', 'Images', 'Stock', 'Pub.'].map((label, i) => (
               <button key={i} onClick={() => setStep(i+1)} className={`py-2 text-center text-sm font-bold border-b-2 transition-colors ${step === i+1 ? 'border-agri-primary text-agri-primary' : 'border-gray-200 text-gray-400'}`}>{i+1}. {label}</button>
            ))}
         </div>
         <div className="min-h-[400px]">
            {step === 1 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
                     <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-lg"><option>Légumes</option><option>Fruits</option></select></div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                     <h4 className="font-bold text-gray-700">Prix</h4>
                     <input type="number" value={formData.pricing.b2cPrice} onChange={e => setFormData({...formData, pricing: {...formData.pricing, b2cPrice: parseFloat(e.target.value)}})} className="w-full p-3 border rounded-lg" placeholder="Prix B2C"/>
                  </div>
               </div>
            )}
            {step === 2 && <MediaManager media={formData.media} onChange={m => setFormData({...formData, media: m})} />}
            {step === 3 && <BatchManager batches={formData.batches} onChange={b => setFormData({...formData, batches: b})} />}
            {step === 4 && <div className="p-8 text-center text-gray-500"><Globe size={48} className="mx-auto mb-4 text-agri-primary"/><p className="font-bold">Prêt pour la synchronisation multi-canal.</p></div>}
         </div>
         <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && <button onClick={() => setStep(s => s-1)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Précédent</button>}
            {step < 4 ? <button onClick={() => setStep(s => s+1)} className="px-6 py-2 bg-agri-primary text-white font-bold rounded-lg ml-auto">Suivant</button> : <button onClick={handleSave} className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg ml-auto">Publier</button>}
         </div>
      </div>
    );
  };
  return view === 'dashboard' ? <StockDashboard /> : view === 'list' ? <CatalogListView /> : <CatalogFormView />;
};

// 4. Orders Tab
const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onProcessOrder }) => {
  const [shippingWizard, setShippingWizard] = useState<{open: boolean, step: number, orderId: string | null}>({open: false, step: 0, orderId: null});
  const openWizard = (id: string) => setShippingWizard({open: true, step: 1, orderId: id});
  const nextStep = () => {
    if (shippingWizard.step >= 3) {
      if (shippingWizard.orderId) onProcessOrder(shippingWizard.orderId);
      setShippingWizard({open: false, step: 0, orderId: null});
    } else setShippingWizard(prev => ({...prev, step: prev.step + 1}));
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-800">Commandes</h2>
      {shippingWizard.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck className="text-agri-primary"/> Expédition</h3>
            <div className="space-y-6">
               <div className="flex justify-between">{[1, 2, 3].map(s => <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${s <= shippingWizard.step ? 'bg-agri-primary text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>)}</div>
               {shippingWizard.step === 1 && <div className="text-center"><Box size={48} className="mx-auto text-blue-500 mb-2"/><p>Vérifiez le contenu du colis.</p></div>}
               {shippingWizard.step === 2 && <div className="text-center"><Truck size={48} className="mx-auto text-orange-500 mb-2"/><p>Sélectionnez un transporteur Tiak-Tiak.</p></div>}
               {shippingWizard.step === 3 && <div className="text-center"><CheckCircle size={48} className="mx-auto text-green-500 mb-2"/><p>Validez pour notifier le client.</p></div>}
               <button onClick={nextStep} className="w-full bg-agri-primary text-white py-3 rounded-xl font-bold">Continuer</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         {orders.map(order => (
            <div key={order.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 flex justify-between items-center">
               <div><p className="font-mono font-bold text-gray-500">#{order.id}</p><h3 className="font-bold text-gray-900">{order.customerName}</h3></div>
               <button onClick={() => openWizard(order.id)} className={`px-4 py-2 rounded-lg font-bold ${order.status === 'pending' ? 'bg-agri-primary text-white' : 'bg-gray-100 text-gray-500'}`}>{order.status === 'pending' ? 'Expédier' : 'Terminé'}</button>
            </div>
         ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'production' | 'catalog' | 'orders'>('overview');
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [crops, setCrops] = useState<Crop[]>([
    { id: 1, name: 'Parcelle A - Oignons', stage: 'Maturation', planted: '15 Sept', harvest: '15 Nov', progress: 80, health: 'Excellent' },
    { id: 2, name: 'Serre 2 - Tomates', stage: 'Croissance', planted: '01 Oct', harvest: '20 Déc', progress: 45, health: 'Bon' },
  ]);
  const [products, setProducts] = useState<CatalogProduct[]>([
    {
      id: '1', name: 'Oignons de Potou', category: 'Légumes', price: 450, unit: 'kg', stockQuantity: 150,
      minStockThreshold: 50, soldQuantity: 1200, farmerName: 'Moussa Diop', location: 'Niayes', coordinates: {lat:0, lng:0},
      image: 'https://picsum.photos/400/300?random=1', available: true, rating: 4.8, freshness: 'recolte_hier', preparationTime: 0,
      status: 'active', channels: 'BOTH', description: 'Oignons violets', media: [], batches: [], movements: [],
      specs: { variety: 'Violet', productionMode: 'Raisonné', certifications: [], harvestDate: new Date(), origin: 'Potou', weightUnit: 'kg', quality: 'Premium' },
      pricing: { b2cPrice: 450, b2cMinQty: 1, b2bPrice: 350, b2bMinQty: 100 }, views: 145, lastUpdated: new Date(), syncStatus: { b2c: 'synced', b2b: 'synced' }
    }
  ]);
  const [orders, setOrders] = useState<Order[]>([{ id: 'CMD-8492', customerName: 'Fatou Ndiaye', items: [], total: 2250, status: 'pending', deliveryAddress: 'Dakar', estimatedTime: new Date(), date: new Date() }]);

  const handleHarvest = (id: string | number) => {
    const crop = crops.find(c => c.id === id);
    if (!crop) return;
    if (confirm(`Récolter ${crop.name} ?`)) {
      setCrops(prev => prev.map(c => c.id === id ? { ...c, stage: 'Récolte', progress: 100 } : c));
      const newProduct: CatalogProduct = {
        id: Date.now().toString(), name: crop.name, category: 'Légumes', price: 0, unit: 'kg', farmerName: profile?.farmName || '',
        location: 'Ferme', coordinates: {lat:0, lng:0}, image: 'https://picsum.photos/400/300', available: true, rating: 0,
        freshness: 'recolte_du_jour', preparationTime: 0, status: 'draft', channels: 'B2C', description: 'Récolte fraîche',
        media: [], batches: [{ id: Date.now().toString(), batchNumber: `LOT-${crop.name.substring(0,3).toUpperCase()}`, harvestDate: new Date(), initialQuantity: 100, currentQuantity: 100 }],
        movements: [], specs: { variety: '', productionMode: 'Bio', certifications: [], harvestDate: new Date(), origin: '', weightUnit: 'kg', quality: 'Standard' },
        pricing: { b2cPrice: 0, b2cMinQty: 1, b2bPrice: 0, b2bMinQty: 0 }, stockQuantity: 100, minStockThreshold: 10, soldQuantity: 0, views: 0, lastUpdated: new Date(), syncStatus: { b2c: 'pending', b2b: 'pending' }
      };
      setProducts(prev => [newProduct, ...prev]);
      setActiveTab('catalog');
    }
  };

  if (!profile) return <FarmerOnboarding onComplete={setProfile} />;
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-slate-900 text-white flex-col z-40">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8"><div className="w-12 h-12 bg-agri-primary rounded-lg flex items-center justify-center font-bold text-xl">{profile.farmName.charAt(0)}</div><div><h2 className="font-bold text-sm leading-tight">{profile.farmName}</h2><p className="text-[10px] text-green-400">ERP Connecté</p></div></div>
            <div className="space-y-1">
                <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'overview' ? 'bg-agri-primary' : 'hover:bg-slate-800'}`}><TrendingUp size={18} /> Accueil</button>
                <button onClick={() => setActiveTab('production')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'production' ? 'bg-agri-primary' : 'hover:bg-slate-800'}`}><Sprout size={18} /> Cultures</button>
                <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'catalog' ? 'bg-agri-primary' : 'hover:bg-slate-800'}`}><Package size={18} /> Stock</button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'orders' ? 'bg-agri-primary' : 'hover:bg-slate-800'}`}><ShoppingBag size={18} /> Commandes</button>
            </div>
        </div>
      </div>
      <div className="md:ml-64 p-4 md:p-8 max-w-7xl mx-auto transition-all">
         {activeTab === 'overview' && <OverviewTab />}
         {activeTab === 'production' && <ProductionTab crops={crops} onAddCrop={c => setCrops([...crops, {...c, id: Date.now(), stage: 'Semis', planted: 'Aujourd\'hui', progress: 0, health: 'Bon'} as Crop])} onUpdateCrop={(id, up) => setCrops(crops.map(c => c.id === id ? {...c, ...up} : c))} onHarvest={handleHarvest} />}
         {activeTab === 'catalog' && <CatalogTab products={products} setProducts={setProducts} />}
         {activeTab === 'orders' && <OrdersTab orders={orders} onProcessOrder={id => setOrders(orders.map(o => o.id === id ? {...o, status: 'delivered'} : o))} />}
      </div>
    </div>
  );
};

export default FarmerDashboard;