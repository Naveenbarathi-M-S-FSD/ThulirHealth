import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Boxes,
  AlertTriangle,
  Tag,
  Clock,
  PlusCircle,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  MapPin,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyDashboard: React.FC = () => {
  const { pharmacyProducts, conversations } = useApp();

  const totalProducts = pharmacyProducts.length;
  const availableStock = pharmacyProducts.reduce((acc, p) => acc + p.availableQuantity, 0);
  const lowStockCount = pharmacyProducts.filter((p) => p.stockStatus === 'Low Stock').length;
  const activeOffersCount = pharmacyProducts.filter((p) => p.isOffer).length;
  const expiringSoonCount = pharmacyProducts.filter((p) => p.stockStatus === 'Expiring Soon').length;

  return (
    <div className="space-y-6">
      {/* Pharmacy Header Banner */}
      <div className="bg-linear-to-r from-cyan-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Healthcare Inventory & Marketplace
              </span>
              <span className="text-xs text-slate-400">Apollo Green Meds · ID: TH-PH-1098</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pharmacy Network Hub
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">
              Broadcast medicine batches, manage stock alerts, discover wholesale peer offers, and fulfill digital patient prescriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pharmacy/create-post"
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Product Post</span>
            </Link>

            <Link
              to="/pharmacy/marketplace"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-300" />
              <span>Marketplace Feed</span>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Catalog Items</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{totalProducts}</span>
          <span className="text-[10px] text-teal-700 font-semibold block mt-1">Active Listings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Available Units</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{availableStock}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">In Stock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Low Stock Alert</span>
          <span className="text-xl font-extrabold text-rose-700 font-mono tabular-nums">{lowStockCount}</span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">Reorder Required</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Active Offers</span>
          <span className="text-xl font-extrabold text-amber-700 font-mono tabular-nums">{activeOffersCount}</span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">Special Discount</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Expiring &lt; 4 Mos</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{expiringSoonCount}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">Discount Action</span>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Marketplace Recent Posts & Stock Alert */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Products Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recently Posted Products
                </h3>
              </div>
              <Link
                to="/pharmacy/marketplace"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                View Marketplace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pharmacyProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-cyan-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 line-clamp-1">{p.productName}</span>
                      <span className="font-mono text-xs font-bold text-teal-900">₹{p.offerPrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{p.companyName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Stock: <strong>{p.availableQuantity}</strong></span>
                      <span>·</span>
                      <span className="font-mono">Exp: {p.expiryDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/80 text-[11px]">
                    <span className="text-slate-500 truncate max-w-[140px]">{p.pharmacyName}</span>
                    <span
                      className={`font-semibold ${
                        p.stockStatus === 'Available' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {p.stockStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Alerts Notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Automated FIFO & Expiry Tracking</strong>
              Budesonide 200 Inhaler batch expires in July 2026. Auto-promoted to 25% discount on the THULIR B2B marketplace to optimize inventory turns.
            </div>
          </div>
        </div>

        {/* Right Column: Customer Inquiries & Quick Links */}
        <div className="space-y-6">
          {/* Incoming Inquiries */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Medicine Inquiries
                </h3>
              </div>
              <Link to="/pharmacy/messages" className="text-xs font-semibold text-teal-700">
                Inbox
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {conversations.slice(0, 2).map((c) => (
                <Link
                  key={c.id}
                  to="/pharmacy/messages"
                  className="block p-3 bg-slate-50 hover:bg-cyan-50/40 rounded-xl border border-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">Customer Inquiry</span>
                    <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{c.lastMessage}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Pharmacy Recruitment Teaser */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 text-xs">
            <h3 className="font-bold text-slate-900">Pharmacy Talent & Hiring</h3>
            <p className="text-slate-500">
              Looking for registered B.Pharm / D.Pharm staff for 24/7 retail coverage?
            </p>
            <Link
              to="/pharmacy/vacancies"
              className="inline-block mt-2 font-bold text-teal-700 hover:text-teal-800"
            >
              Browse & Post Pharmacy Jobs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
