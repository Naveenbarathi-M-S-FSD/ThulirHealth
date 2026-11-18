import React, { useState } from 'react';
import { MapPin, Phone, Clock, Store, ShieldCheck, Navigation, CheckCircle, Search, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PharmacyLocationItem {
  id: string;
  name: string;
  area: string;
  distance: string;
  address: string;
  phone: string;
  status: 'Open 24/7' | 'Open Now' | 'Closing Soon';
  rating: number;
  featuredStock: string[];
  latPercent: number; // For demo map canvas pin positioning
  lngPercent: number;
}

const DEMO_PHARMACY_LOCATIONS: PharmacyLocationItem[] = [
  {
    id: 'loc-1',
    name: 'Apollo Green Meds',
    area: 'Anna Nagar West, Chennai',
    distance: '0.8 km away',
    address: '14, 2nd Avenue, Near Roundtana, Anna Nagar West, Chennai 600040',
    phone: '+91 94444 88990',
    status: 'Open 24/7',
    rating: 4.9,
    featuredStock: ['Telmisartan 40mg', 'Metformin 500mg SR', 'Atorvastatin 10mg'],
    latPercent: 32,
    lngPercent: 40,
  },
  {
    id: 'loc-2',
    name: 'MedPlus Care Pharmacy',
    area: 'T. Nagar, Chennai',
    distance: '3.4 km away',
    address: '42, Usman Road, Panagal Park, T. Nagar, Chennai 600017',
    phone: '+91 94444 66778',
    status: 'Open Now',
    rating: 4.8,
    featuredStock: ['Accu-Chek Monitors', 'Budesonide Inhalers', 'Pantoprazole 40mg'],
    latPercent: 65,
    lngPercent: 60,
  },
  {
    id: 'loc-3',
    name: 'Thulir Community Chemist',
    area: 'Velachery Bypass, Chennai',
    distance: '5.1 km away',
    address: '88, Velachery Main Road, Opp Phoenix Mall, Chennai 600042',
    phone: '+91 94444 33221',
    status: 'Open Now',
    rating: 4.7,
    featuredStock: ['Vitamin D3 60k', 'Omron BP Monitors', 'Insulin Cartridges'],
    latPercent: 78,
    lngPercent: 48,
  },
];

export const PharmacyLocation: React.FC = () => {
  const { showToast } = useApp();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyLocationItem>(DEMO_PHARMACY_LOCATIONS[0]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Network Pharmacy Locations & Proximity Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Find nearby verified dispensing counters with live inventory verification and direct phone contact
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold self-start sm:self-auto">
          3 Verified Stores Nearby
        </span>
      </div>

      {/* Main Grid: Interactive Map Simulation + Store Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Simulated Vector Map Graphic */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-lg border border-slate-800">
          {/* Simulated Map Canvas Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2dd4bf" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Arterial road curves */}
              <path d="M 20 80 Q 200 150 400 90 T 700 200" fill="none" stroke="#0d9488" strokeWidth="3" />
              <path d="M 120 20 Q 250 220 380 320" fill="none" stroke="#0d9488" strokeWidth="2" />
            </svg>
          </div>

          {/* Map Top Bar */}
          <div className="relative z-10 flex justify-between items-center bg-slate-950/70 p-3 rounded-2xl border border-white/10 backdrop-blur-xs text-xs">
            <span className="font-bold flex items-center gap-1.5 text-teal-300">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Interactive Location Radar (Chennai Urban Cluster)
            </span>
            <span className="text-[11px] text-slate-400">GPS Simulation Active</span>
          </div>

          {/* Interactive Pins on Map */}
          <div className="relative z-10 h-64 w-full">
            {DEMO_PHARMACY_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedPharmacy(loc)}
                style={{ top: `${loc.latPercent}%`, left: `${loc.lngPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-2 rounded-xl transition-all ${
                  selectedPharmacy.id === loc.id
                    ? 'bg-teal-500 text-slate-950 font-bold scale-110 shadow-lg shadow-teal-500/30 ring-4 ring-white/20'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-white font-medium shadow-md'
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="text-xs whitespace-nowrap">{loc.name}</span>
              </button>
            ))}
          </div>

          {/* Map Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
            <span>Visual demonstration map. No real GPS coordinate telemetry transmitted.</span>
            <span className="text-emerald-400 font-bold">100% Drug License Compliant</span>
          </div>
        </div>

        {/* Right Column: Selected Store Detail Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPharmacy.name}</h3>
                <span className="text-teal-800 font-semibold">{selectedPharmacy.area}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {selectedPharmacy.status}
              </span>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{selectedPharmacy.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="font-bold text-slate-900">{selectedPharmacy.distance}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">{selectedPharmacy.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">Verified Active Medicines:</span>
              <ul className="space-y-1 text-slate-600">
                {selectedPharmacy.featuredStock.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{m} (In Stock)</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => showToast(`Calling ${selectedPharmacy.name}: ${selectedPharmacy.phone}`)}
                className="w-full py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
