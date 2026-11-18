import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  PlusCircle,
  Tag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
  Eye,
  X,
  Boxes,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PharmacyProduct } from '../../types';

export const PharmacyMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const { pharmacyProducts, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<PharmacyProduct | null>(null);

  const filtered = pharmacyProducts.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.companyName.toLowerCase().includes(search.toLowerCase()) ||
      p.pharmacyName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleContactPharmacy = (phone: string, name: string) => {
    showToast(`Dialing pharmacy ${name}: ${phone}`);
  };

  const handleMessagePharmacy = (p: PharmacyProduct) => {
    navigate('/pharmacy/messages');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Healthcare Marketplace & Stock Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover verified medicine batches, compare pricing, and transact between licensed pharmacies
          </p>
        </div>

        <Link
          to="/pharmacy/create-post"
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Product Post</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine, salt, manufacturer, pharmacy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Cardiovascular', 'Diabetes Care', 'Pulmonology', 'Diagnostic Devices', 'Vitamins & Supplements'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Marketplace Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Image / Header Graphic */}
            <div className="relative h-44 bg-slate-100 overflow-hidden group">
              <img
                src={prod.imageUrl}
                alt={prod.productName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Fallback pattern behind if image error */}
              <div className="absolute inset-0 bg-linear-to-tr from-teal-900/30 to-slate-900/10 pointer-events-none" />

              {/* Discount Tag */}
              {prod.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase rounded-lg shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {prod.discountPercentage}% OFF
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold rounded-md shadow-2xs">
                {prod.stockStatus}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-teal-800 font-semibold">
                  <span>{prod.companyName}</span>
                  <span className="font-mono text-slate-400">Mfg: {prod.mfgDate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prod.productName}
                </h3>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Pricing & Stock block */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">
                      MRP ₹{prod.originalPrice}
                    </span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      ₹{prod.offerPrice}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Available Units</span>
                    <span className="text-sm font-bold font-mono text-teal-800">
                      {prod.availableQuantity} in Stock
                    </span>
                  </div>
                </div>

                {/* Expiry and Seller */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {prod.pharmacyName}
                    </span>
                    <span className="font-mono text-amber-700 font-semibold">
                      Exp: {prod.expiryDate}
                    </span>
                  </div>
                  <p className="text-slate-400 truncate">{prod.location}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-3">
                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="flex items-center justify-center gap-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => handleContactPharmacy(prod.contactNumber, prod.pharmacyName)}
                  className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Store</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">{selectedProduct.productName}</h3>
              <button onClick={() => setSelectedProduct(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Manufacturer</span>
                  <span className="font-bold text-slate-900">{selectedProduct.companyName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Offer Price</span>
                  <span className="text-lg font-mono font-black text-teal-800">
                    ₹{selectedProduct.offerPrice}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Mfg Date</span>
                  <span className="font-mono font-semibold">{selectedProduct.mfgDate}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Expiry Date</span>
                  <span className="font-mono font-bold text-amber-700">{selectedProduct.expiryDate}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Available Units</span>
                  <span className="font-bold">{selectedProduct.availableQuantity}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Pharmacy</span>
                  <span className="font-bold truncate block">{selectedProduct.pharmacyName}</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedProduct.description}
              </p>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-teal-900 space-y-1">
                <span className="font-bold block">Seller Contact Details</span>
                <p>Phone: {selectedProduct.contactNumber}</p>
                <p>Email: {selectedProduct.email}</p>
                <p>Location: {selectedProduct.location}</p>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  handleMessagePharmacy(selectedProduct);
                }}
                className="flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Seller</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
