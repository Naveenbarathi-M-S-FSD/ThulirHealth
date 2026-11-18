import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Stethoscope, Store, ArrowRight, ArrowLeft, Check, Shield } from 'lucide-react';
import { ThulirLogo } from '../../components/common/ThulirLogo';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      name: 'PATIENT',
      tagline: 'Personal Health Passport & Companion',
      description: 'Manage clinical health records, scan paper prescriptions via camera, generate your digital Health QR, and track medicine schedules.',
      features: [
        'Camera Prescription Scanner & OCR extraction',
        'Offline-capable Health QR passport',
        'Medicine dose reminders & adherence tracking',
        'Access to hospital reports and lab results',
      ],
      icon: Heart,
      accentColor: 'border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-100',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      route: '/register/patient',
    },
    {
      id: 'doctor',
      name: 'DOCTOR',
      tagline: 'Clinical Practice & Telehealth Suite',
      description: 'Instant patient records access via QR scanner, write structured electronic prescriptions, view longitudinal lab charts, and utilize clinical AI support.',
      features: [
        'Scan patient THULIR Health QR at clinic',
        'Interactive prescription builder with auto-sync',
        'AI clinical reminders & lab correlation',
        'Daily outpatient schedule & patient follow-ups',
      ],
      icon: Stethoscope,
      accentColor: 'border-teal-200 hover:border-teal-500 hover:shadow-teal-100',
      buttonBg: 'bg-teal-600 hover:bg-teal-700',
      badgeBg: 'bg-teal-50 text-teal-800',
      route: '/register/doctor',
    },
    {
      id: 'pharmacy',
      name: 'PHARMACY',
      tagline: 'Inventory, Marketplace & Care Network',
      description: 'Post available medicine stock, discover wholesale offers, manage expiry alerts, connect directly with inquiring patients and other pharmacies.',
      features: [
        'Publish product posts to THULIR marketplace',
        'Live stock availability & expiry alert tracker',
        'Direct patient chat & prescription fulfillment',
        'Job vacancy postings for registered pharmacists',
      ],
      icon: Store,
      accentColor: 'border-cyan-200 hover:border-cyan-500 hover:shadow-cyan-100',
      buttonBg: 'bg-cyan-700 hover:bg-cyan-800',
      badgeBg: 'bg-cyan-50 text-cyan-800',
      route: '/register/pharmacy',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-teal-50/20 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Back & Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <ThulirLogo size="md" showTagline />
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Select Your Role
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How will you be using THULIR?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Choose your profile type to access tailored tools, workflows, and registration compliance.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className={`flex flex-col bg-white rounded-2xl p-6 border-2 transition-all duration-200 shadow-sm hover:shadow-xl ${r.accentColor}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-teal-700 border border-slate-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${r.badgeBg}`}>
                    {r.name}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{r.name}</h3>
                <p className="text-xs font-semibold text-teal-800 mb-2">{r.tagline}</p>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed flex-1">
                  {r.description}
                </p>

                {/* Feature bullets */}
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(r.route)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${r.buttonBg}`}
                >
                  <span>Continue as {r.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper */}
        <div className="mt-10 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-teal-700 hover:text-teal-800 underline">
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};
