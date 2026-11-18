import React from 'react';
import { Settings, Globe, Bell, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const PatientSettings: React.FC = () => {
  const { language, setLanguage, showToast } = useApp();

  const handleResetData = () => {
    localStorage.clear();
    showToast('Local prototype database reset to initial demonstration state. Please refresh page.', 'info');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Patient Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Application language, accessibility options, and local demo preferences
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Globe className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Regional Language Preference</h3>
        </div>

        <p className="text-xs text-slate-500">
          Select your primary display language. Navigation and medical instructions will adapt accordingly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en' as Language, label: 'English', sub: 'Default International' },
            { code: 'ta' as Language, label: 'தமிழ் (Tamil)', sub: 'தமிழ்நாடு பிராந்திய பயன்பாடு' },
            { code: 'hi' as Language, label: 'हिन्दी (Hindi)', sub: 'राष्ट्रीय भाषा प्राथमिकता' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLanguage(item.code);
                showToast(`Language switched to ${item.label}`);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                language === item.code
                  ? 'bg-teal-50 border-teal-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{item.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Simulation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Care Notification Channels</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 block">Medicine Dose Alarms</span>
              <span className="text-slate-500 text-[11px]">Audio and visual reminders for scheduled prescriptions</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 block">Doctor Consultation Reminders</span>
              <span className="text-slate-500 text-[11px]">Alerts 24 hours prior to appointment time</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded" />
          </label>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Prototype Storage Reset</h3>
        </div>

        <p className="text-slate-500">
          Restore the initial hackathon mock dataset (clears locally scanned prescriptions and posts).
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
        >
          Reset Prototype LocalStorage
        </button>
      </div>
    </div>
  );
};
