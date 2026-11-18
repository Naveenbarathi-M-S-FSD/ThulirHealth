import React, { useState } from 'react';
import { Boxes, Search, Filter, AlertTriangle, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PharmacyProduct } from '../../types';

export const PharmacyStock: React.FC = () => {
  const { pharmacyProducts, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = pharmacyProducts.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.stockStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PharmacyProduct['stockStatus']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800';
      case 'Low Stock':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'Expiring Soon':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'Out of Stock':
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Stock Availability Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time batch quantities, unit pricing, manufacturer data, and expiry status alerts
          </p>
        </div>

        <button
          onClick={() => showToast('Stock audit report exported as CSV')}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          Export Stock CSV
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory by medicine or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Available', 'Low Stock', 'Expiring Soon'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-bold">Product Name</th>
                <th className="py-3 px-3 font-semibold">Manufacturer</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold text-right">Available Stock</th>
                <th className="py-3 px-3 font-semibold text-right">Offer Price</th>
                <th className="py-3 px-3 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.productName}</td>
                  <td className="py-3 px-3 text-slate-600">{item.companyName}</td>
                  <td className="py-3 px-3 text-teal-800 font-semibold">{item.category}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {item.availableQuantity} Units
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-teal-800">
                    ₹{item.offerPrice}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{item.expiryDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full ${getStatusBadge(
                        item.stockStatus
                      )}`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
