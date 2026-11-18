import React from 'react';
import { Store, ShieldCheck, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyProfile: React.FC = () => {
  const { currentUser } = useApp();

  const pharmacy =
    currentUser && currentUser.role === 'pharmacy'
      ? currentUser
      : {
          pharmacyName: 'Apollo Green Meds',
          pharmacyId: 'TH-PH-1098',
          ownerName: 'G. Sundaram (Chief Pharmacist)',
          location: 'Anna Nagar West, Chennai',
          address: '14, 2nd Avenue, Near Roundtana, Anna Nagar West, Chennai 600040',
          pharmacyType: '24/7 Chemist',
          registrationNumber: 'TN-DRUG-LIC-2024-8871',
          gstNumber: '33AAACA1122K1Z9',
          phone: '+91 94444 88990',
          email: 'care@apollogreenmeds.in',
          documents: [
            { name: 'Form 20/21 Retail Drug License.pdf', status: 'Demo Verified', uploadedAt: '2025-01-08' },
            { name: 'GST Certificate.pdf', status: 'Demo Verified', uploadedAt: '2025-01-08' },
          ],
        };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Pharmacy Business Profile & Licensure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          State Drug Control administration licenses, GST verification, and retail operations
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-cyan-800 text-white flex items-center justify-center font-black text-2xl shadow-md">
            <Store className="w-10 h-10" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{pharmacy.pharmacyName}</h2>
                <span className="font-mono text-xs font-semibold text-teal-800">
                  Store ID: {pharmacy.pharmacyId} · License: {pharmacy.registrationNumber}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 self-center sm:self-start">
                <CheckCircle className="w-3.5 h-3.5" /> Demo Verified
              </span>
            </div>

            <p className="text-xs text-teal-800 font-semibold pt-1">
              {pharmacy.pharmacyType} · In-Charge: {pharmacy.ownerName}
            </p>
            <p className="text-xs text-slate-500">{pharmacy.address}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Drug Authority License</span>
            <span className="font-mono font-bold text-teal-800">{pharmacy.registrationNumber}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">GSTIN Number</span>
            <span className="font-mono font-bold text-slate-900">{pharmacy.gstNumber}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Contact Helpline</span>
            <span className="font-semibold text-slate-800">{pharmacy.phone}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Official Email</span>
            <span className="font-semibold text-slate-800 truncate block">{pharmacy.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
            <span className="text-slate-400 block text-[10px]">Neighborhood & Region</span>
            <span className="font-semibold text-slate-800">{pharmacy.location}</span>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            State Drug Authority Verified Documents
          </h3>

          <div className="space-y-2 text-xs">
            {pharmacy.documents?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{doc.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
