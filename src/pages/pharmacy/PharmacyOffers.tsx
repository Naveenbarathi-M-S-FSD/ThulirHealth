import React from 'react';
import { Tag, Phone, ShoppingBag, Eye, Percent, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyOffers: React.FC = () => {
  const { pharmacyProducts, showToast } = useApp();

  const offerProducts = pharmacyProducts.filter((p) => p.isOffer || p.discountPercentage > 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Special Pharmacy Offers & Bulk Promotions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Exclusive discounted medicine lots, seasonal clearance deals, and B2B wholesale pricing
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold self-start sm:self-auto">
          {offerProducts.length} Active Deals
        </span>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-sm flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>{p.discountPercentage}% DISCOUNT</span>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-teal-800 font-bold uppercase">{p.category}</span>
                <h3 className="text-base font-bold text-slate-900">{p.productName}</h3>
                <p className="text-slate-500 text-[11px]">{p.companyName}</p>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">MRP ₹{p.originalPrice}</span>
                    <span className="text-xl font-black text-amber-900 font-mono">₹{p.offerPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Stock</span>
                    <span className="font-mono font-bold text-slate-800">{p.availableQuantity} Units</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{p.pharmacyName}</span>
                  <span className="font-mono">Exp: {p.expiryDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => showToast(`Contacting ${p.pharmacyName}: ${p.contactNumber}`)}
                  className="w-full py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Claim Offer / Contact</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
