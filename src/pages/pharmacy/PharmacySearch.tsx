import React, { useState } from 'react';
import { Search, Filter, MapPin, Tag, Boxes, Store, Phone, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacySearch: React.FC = () => {
  const { pharmacyProducts, showToast } = useApp();

  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);

  const locations = ['All', 'Anna Nagar', 'T. Nagar', 'Velachery'];

  const filtered = pharmacyProducts.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      p.productName.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q) ||
      p.pharmacyName.toLowerCase().includes(q);

    const matchesLoc =
      selectedLocation === 'All' || p.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesOffers = !onlyOffers || p.isOffer || p.discountPercentage > 0;
    const matchesAvail = !availabilityOnly || p.stockStatus === 'Available';
    const matchesPrice = p.offerPrice <= maxPrice;

    return matchesQuery && matchesLoc && matchesOffers && matchesAvail && matchesPrice;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Medicine & Pharmacy Universal Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Find medicines, verify stock availability, and locate verified pharmacies nearby
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicines, pharmacies or products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
          />
        </div>

        {/* Filters Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Filter Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Max Price: ₹{maxPrice}</label>
            <input
              type="range"
              min="50"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full mt-2 accent-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={(e) => setOnlyOffers(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span>Special Offers Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-500 px-1">
          <span>Search Results ({filtered.length} products found)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors flex items-start justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">{item.category}</span>
                <h3 className="text-sm font-bold text-slate-900">{item.productName}</h3>
                <p className="text-slate-500">{item.companyName}</p>

                <div className="pt-2 flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-900">₹{item.offerPrice}</span>
                  {item.discountPercentage > 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {item.discountPercentage}% OFF
                    </span>
                  )}
                  <span className="text-slate-400 font-mono">Stock: {item.availableQuantity}</span>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{item.pharmacyName}</span>
                  <span>·</span>
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              <button
                onClick={() => showToast(`Inquiring with ${item.pharmacyName}: ${item.contactNumber}`)}
                className="px-3 py-1.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-2xs shrink-0 self-center"
              >
                Inquire
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
