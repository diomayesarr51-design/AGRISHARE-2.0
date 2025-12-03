import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, PieChart as PieChartIcon, Wallet, ArrowRight, Activity, 
  Globe, ShieldCheck, Users, FileText, Bell, Search, Calculator, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Briefcase, Filter, MessageSquare
} from 'lucide-react';

// --- MOCK DATA ---
const performanceData = [
  { month: 'Jan', value: 12.5, benchmark: 10 },
  { month: 'Fév', value: 13.2, benchmark: 10.5 },
  { month: 'Mar', value: 12.8, benchmark: 11 },
  { month: 'Avr', value: 14.5, benchmark: 11.2 },
  { month: 'Mai', value: 15.8, benchmark: 11.5 },
  { month: 'Juin', value: 16.4, benchmark: 12 },
];

const portfolioAllocation = [
  { name: 'Maraîchage (Niayes)', value: 45, color: '#10b981' }, // Green
  { name: 'Riziculture (Vallée)', value: 25, color: '#f59e0b' }, // Amber
  { name: 'Anacarde (Sud)', value: 20, color: '#8b5cf6' }, // Purple
  { name: 'Aviculture', value: 10, color: '#3b82f6' }, // Blue
];

const marketTrends = [
  { name: 'Oignon', price: 450, trend: '+12%', history: [380, 400, 410, 450, 450, 460] },
  { name: 'Mangue', price: 1200, trend: '-5%', history: [1400, 1350, 1300, 1250, 1200, 1180] },
  { name: 'Arachide', price: 350, trend: '+2%', history: [330, 335, 340, 345, 348, 350] },
  { name: 'Riz Paddy', price: 190, trend: '+1%', history: [180, 182, 185, 188, 189, 190] },
];

const activeInvestments = [
  { id: 'INV-001', project: 'Ferme Solaire Thiès', amount: '5.0M', date: '12 Jan 2024', status: 'Actif', roi: '+18%' },
  { id: 'INV-002', project: 'Coop. Casamance', amount: '2.5M', date: '03 Fév 2024', status: 'Actif', roi: '+24%' },
  { id: 'INV-003', project: 'Agro-Tech Dakar', amount: '8.0M', date: '15 Mar 2024', status: 'En attente', roi: 'N/A' },
];

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="flex items-center text-sm">
      {trend && (
        <span className={`flex items-center font-bold mr-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
          {trend.startsWith('+') ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
          {trend}
        </span>
      )}
      <span className="text-gray-400">{subtext}</span>
    </div>
  </div>
);

// 1. VUE D'ENSEMBLE
const OverviewTab = () => (
  <div className="space-y-6 animate-fadeIn">
    {/* KPI Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Valeur Portefeuille" 
        value="15.5M CFA" 
        subtext="vs mois dernier" 
        trend="+12%" 
        icon={Wallet} 
        colorClass="bg-purple-600 text-purple-600" 
      />
      <StatCard 
        title="ROI Global (YTD)" 
        value="16.4%" 
        subtext="Objectif: 15%" 
        trend="+1.4%" 
        icon={TrendingUp} 
        colorClass="bg-green-600 text-green-600" 
      />
      <StatCard 
        title="Projets Actifs" 
        value="7" 
        subtext="2 en cours de validation" 
        icon={Briefcase} 
        colorClass="bg-blue-600 text-blue-600" 
      />
      <StatCard 
        title="Cash Disponible" 
        value="4.2M CFA" 
        subtext="Prêt à investir" 
        icon={Activity} 
        colorClass="bg-orange-500 text-orange-500" 
      />
    </div>

    {/* Main Content Split */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Performance vs Marché</h3>
          <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 p-2">
            <option>Cette année</option>
            <option>6 derniers mois</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="value" name="Mon Portefeuille" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              <Area type="monotone" dataKey="benchmark" name="Indice Agri Sénégal" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notifications & Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center">
          <Bell size={20} className="mr-2 text-agri-primary" /> Alertes & News
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-xs font-bold text-green-700 uppercase mb-1 block">Opportunité</span>
            <p className="text-sm font-medium text-gray-800">Nouveau projet "Ferme Solaire" ouvert au financement à Thiès.</p>
            <span className="text-xs text-gray-500 mt-2 block">Il y a 2h</span>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <span className="text-xs font-bold text-yellow-700 uppercase mb-1 block">Rapport Récolte</span>
            <p className="text-sm font-medium text-gray-800">La récolte d'Oignons à Potou dépasse les prévisions de 15%.</p>
            <span className="text-xs text-gray-500 mt-2 block">Il y a 5h</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             <div>
                <p className="text-sm text-gray-600">Document légal "Coop. Casamance" en attente de signature.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. ANALYSE PORTEFEUILLE
const PortfolioTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Allocation */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">Allocation Sectorielle</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioAllocation}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Investments Table */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Investissements Actifs</h3>
          <button className="text-agri-primary text-sm font-bold hover:underline">Télécharger Rapport</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4">Projet</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">ROI Actuel</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {activeInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{inv.project}</td>
                  <td className="p-4 text-gray-600">{inv.amount} F</td>
                  <td className="p-4 text-gray-500">{inv.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-green-600">{inv.roi}</td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-agri-primary"><ChevronRight size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    {/* Documents */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText size={20} /> Documents & Contrats
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
           <div key={i} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-agri-primary cursor-pointer group">
              <div className="p-2 bg-gray-100 group-hover:bg-purple-100 rounded text-gray-500 group-hover:text-purple-600 transition-colors">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">Contrat_Invest_2024_{i}.pdf</p>
                <p className="text-xs text-gray-500">Ajouté le 12/10/2024</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. ANALYSE MARCHÉ
const MarketTab = () => (
  <div className="space-y-6 animate-fadeIn">
    {/* Market Tickers */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketTrends.map((item, idx) => (
         <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold text-gray-700">{item.name}</h4>
               <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {item.trend}
               </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-4">{item.price} F <span className="text-xs text-gray-400 font-normal">/kg</span></p>
            {/* Mini Sparkline Chart Mockup */}
            <div className="h-10 flex items-end gap-1">
               {item.history.map((val, i) => (
                  <div key={i} style={{height: `${(val / 1500) * 100}%`}} className={`flex-1 rounded-t-sm ${item.trend.startsWith('+') ? 'bg-green-200' : 'bg-red-200'}`}></div>
               ))}
            </div>
         </div>
      ))}
    </div>

    {/* AI Analysis */}
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
       <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-white/10 rounded-lg"><Activity className="text-blue-400"/></div>
             <h3 className="text-xl font-bold">Analyses Prédictives IA</h3>
          </div>
          <p className="text-slate-300 max-w-2xl mb-6">
            L'analyse des données satellites et météorologiques suggère une hausse de rendement de <strong>20% pour la filière Anacarde</strong> dans la région de Ziguinchor pour le prochain trimestre. Risque climatique faible.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">
            Voir le rapport complet
          </button>
       </div>
       {/* Decor */}
       <Globe className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
    </div>

    {/* Regional Heatmap Placeholder */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
       <Globe className="text-gray-300 w-24 h-24 mb-4" />
       <h3 className="text-lg font-bold text-gray-800">Carte des opportunités régionales</h3>
       <p className="text-gray-500 max-w-md">
         Visualisation interactive des zones à fort potentiel agricole basée sur les données pédologiques et climatiques.
       </p>
       <button className="mt-4 text-agri-primary font-bold hover:underline">Explorer la carte</button>
    </div>
  </div>
);

// 4. OPPORTUNITÉS & OUTILS
const OpportunitiesTab = () => {
  const [roiAmount, setRoiAmount] = useState(1000000);
  const [roiDuration, setRoiDuration] = useState(12);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Search & List */}
      <div className="lg:col-span-2 space-y-6">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
               <input type="text" placeholder="Rechercher des projets (ex: Bio, Solaire...)" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-primary"/>
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
         </div>

         {[1, 2, 3].map((i) => (
           <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg object-cover flex items-center justify-center">
                      <Briefcase className="text-gray-400"/>
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900">Extension Ferme Bio {i}</h3>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold">VÉRIFIÉ</span>
                       </div>
                       <p className="text-sm text-gray-500 mb-3">Mbour, Sénégal • Agro-écologie</p>
                       <div className="flex gap-4 text-sm">
                          <div><span className="block font-bold text-gray-800">18%</span><span className="text-gray-400 text-xs">ROI Est.</span></div>
                          <div><span className="block font-bold text-gray-800">12 mois</span><span className="text-gray-400 text-xs">Durée</span></div>
                          <div><span className="block font-bold text-gray-800">Faible</span><span className="text-gray-400 text-xs">Risque</span></div>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <button className="bg-agri-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-agri-dark transition-colors">
                      Investir
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Ticket min: 500k</p>
                 </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                 <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> Due diligence complétée</div>
                 <div className="flex items-center gap-1"><Users size={14} className="text-blue-500"/> 45 investisseurs</div>
              </div>
           </div>
         ))}
      </div>

      {/* Simulator Sidebar */}
      <div className="space-y-6">
         <div className="bg-agri-dark text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calculator size={20}/> Simulateur ROI
            </h3>
            
            <div className="space-y-4 mb-6">
               <div>
                  <label className="text-xs text-gray-300 mb-1 block">Montant Investissement</label>
                  <input 
                    type="range" min="100000" max="10000000" step="100000" 
                    value={roiAmount} onChange={(e) => setRoiAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-agri-primary"
                  />
                  <div className="text-right font-bold text-xl">{roiAmount.toLocaleString()} F</div>
               </div>
               <div>
                  <label className="text-xs text-gray-300 mb-1 block">Durée (Mois)</label>
                  <input 
                    type="range" min="6" max="36" step="3" 
                    value={roiDuration} onChange={(e) => setRoiDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-agri-primary"
                  />
                  <div className="text-right font-bold text-xl">{roiDuration} Mois</div>
               </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
               <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Rendement Est. (18%)</span>
                  <span className="font-bold text-green-400">+{(roiAmount * 0.18).toLocaleString()} F</span>
               </div>
               <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-200 font-bold">Total Final</span>
                  <span className="font-bold text-xl">{(roiAmount * 1.18).toLocaleString()} F</span>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Critères ESG</h3>
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Impact Environnemental</span>
                  <div className="flex gap-1">
                     <div className="w-8 h-2 bg-green-500 rounded"></div>
                     <div className="w-8 h-2 bg-green-500 rounded"></div>
                     <div className="w-8 h-2 bg-green-500 rounded"></div>
                     <div className="w-8 h-2 bg-gray-200 rounded"></div>
                  </div>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Impact Social</span>
                  <div className="flex gap-1">
                     <div className="w-8 h-2 bg-blue-500 rounded"></div>
                     <div className="w-8 h-2 bg-blue-500 rounded"></div>
                     <div className="w-8 h-2 bg-blue-500 rounded"></div>
                     <div className="w-8 h-2 bg-blue-500 rounded"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// 5. RÉSEAU
const NetworkTab = () => (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div className="lg:col-span-2 space-y-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <div className="w-10 h-10 bg-agri-light rounded-full flex items-center justify-center text-agri-primary"><MessageSquare size={20}/></div>
            <input type="text" placeholder="Partagez une idée ou posez une question..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm"/>
            <button className="bg-agri-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Publier</button>
         </div>

         {[1, 2].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                     <h4 className="font-bold text-gray-900">Jean Dupont</h4>
                     <p className="text-xs text-gray-500">Expert Agro-Business • Il y a 2h</p>
                  </div>
               </div>
               <p className="text-gray-700 text-sm mb-4">
                  Les nouvelles régulations sur l'exportation de la mangue vers l'UE ouvrent de grandes opportunités pour les unités de séchage locales. Qui s'intéresse à ce créneau ?
               </p>
               <div className="flex gap-4 border-t border-gray-50 pt-3">
                  <button className="text-xs font-bold text-gray-500 hover:text-agri-primary">J'aime (12)</button>
                  <button className="text-xs font-bold text-gray-500 hover:text-agri-primary">Répondre (4)</button>
               </div>
            </div>
         ))}
      </div>
      
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Prochains Webinars</h3>
            <div className="space-y-4">
               <div className="border-l-4 border-agri-primary pl-3">
                  <p className="text-xs text-gray-500">15 Nov • 10:00</p>
                  <h4 className="font-bold text-sm text-gray-800">Tendances Investissement 2025</h4>
                  <button className="text-xs text-agri-primary font-bold mt-1">S'inscrire</button>
               </div>
               <div className="border-l-4 border-blue-500 pl-3">
                  <p className="text-xs text-gray-500">22 Nov • 14:00</p>
                  <h4 className="font-bold text-sm text-gray-800">Rencontre Producteurs Bio</h4>
                  <button className="text-xs text-blue-500 font-bold mt-1">S'inscrire</button>
               </div>
            </div>
         </div>
      </div>
   </div>
);


const InvestorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'market' | 'opportunities' | 'network'>('overview');

  const tabs = [
    { id: 'overview', label: 'Synthèse', icon: Activity },
    { id: 'portfolio', label: 'Portefeuille', icon: Wallet },
    { id: 'market', label: 'Marché', icon: TrendingUp },
    { id: 'opportunities', label: 'Opportunités', icon: Briefcase },
    { id: 'network', label: 'Réseau', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Desktop Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6 sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-purple-600" /> Espace Investisseur Pro
            </h1>
            <p className="text-gray-500 text-sm mt-1">Gérez votre impact et vos rendements</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'market' && <MarketTab />}
        {activeTab === 'opportunities' && <OpportunitiesTab />}
        {activeTab === 'network' && <NetworkTab />}
      </div>
    </div>
  );
};

export default InvestorDashboard;