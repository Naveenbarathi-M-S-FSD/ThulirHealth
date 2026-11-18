import React from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Trash2, Edit3, Eye, Tag, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyMyPosts: React.FC = () => {
  const { pharmacyProducts, showToast, currentUser } = useApp();

  const pharmacyId =
    currentUser && 'pharmacyId' in currentUser ? currentUser.pharmacyId : 'TH-PH-1098';

  const myPosts = pharmacyProducts.filter(
    (p) => p.pharmacyId === pharmacyId || p.pharmacyName.includes('Apollo')
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Published Product Posts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your store's active marketplace listings, quantities, and promotional discounts
          </p>
        </div>

        <Link
          to="/pharmacy/create-post"
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product Post</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-40 bg-slate-100 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                Units: {post.availableQuantity}
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                {post.stockStatus}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-teal-800 block">{post.category}</span>
                <h3 className="text-sm font-bold text-slate-900">{post.productName}</h3>
                <p className="text-[11px] text-slate-500">{post.companyName}</p>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl mt-2 font-mono">
                  <span className="font-bold text-slate-900 text-sm">₹{post.offerPrice}</span>
                  <span className="text-slate-400 line-through text-[11px]">MRP ₹{post.originalPrice}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">Exp: {post.expiryDate}</span>
                <button
                  onClick={() => showToast('Listing updated in store catalog')}
                  className="px-3 py-1.5 font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg"
                >
                  Edit Stock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
