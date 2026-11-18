import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, Eye, PhoneCall, Download, X } from 'lucide-react';
import { INITIAL_INSURANCE_SCHEMES } from '../../data/mockData';
import { InsuranceScheme } from '../../types';
import { useApp } from '../../context/AppContext';

export const PatientInsurance: React.FC = () => {
  const { showToast } = useApp();
  const [selectedScheme, setSelectedScheme] = useState<InsuranceScheme | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Healthcare Insurance & Entitlement Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fictional demonstration insurance coverage policies for cashless hospitalization simulation
          </p>
        </div>

        <button
          onClick={() => showToast('Claims support helpline connected: 1800-425-DEMO')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors self-start sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Cashless Desk Help</span>
        </button>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Hackathon Demonstration Disclaimer:</strong>
          These policies (Schemes A, B, C, D) are educational representations designed to show healthcare policy interoperability. They do not constitute actual government insurance guarantees.
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_INSURANCE_SCHEMES.map((scheme, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800">
                    Scheme {letter}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scheme.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {scheme.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{scheme.schemeName}</h3>
                  <p className="text-xs text-slate-500">{scheme.policyName}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sum Insured</span>
                    <span className="text-sm font-bold text-teal-900 font-mono">{scheme.coverage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Validity</span>
                    <span className="font-semibold text-slate-800">{scheme.validity}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Policy Identifier</span>
                    <span className="font-mono text-slate-700 font-semibold">{scheme.policyNumber}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1.5">Key Benefits Included:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {scheme.benefits.slice(0, 3).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                  {scheme.provider}
                </span>

                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">{selectedScheme.schemeName}</h3>
              </div>
              <button onClick={() => setSelectedScheme(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Policy Number</span>
                  <span className="font-mono font-bold text-slate-900">{selectedScheme.policyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Annual Coverage</span>
                  <span className="font-mono font-bold text-teal-800">{selectedScheme.coverage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <span className="font-semibold text-emerald-700">{selectedScheme.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Underwritten By</span>
                  <span className="font-medium text-slate-700">{selectedScheme.provider}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Complete Schedule of Benefits</h4>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-[11px] text-teal-900">
                To initiate a cashless pre-authorization, present this card or your THULIR Health QR code at network admissions counters.
              </div>
            </div>

            <div className="flex justify-between items-center px-6 py-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  showToast('E-Card downloaded (Demo Insurance Pass.pdf)');
                  setSelectedScheme(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                Download E-Card
              </button>
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-1.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
