import React from 'react';
import { QrCode, Shield, Download, Share2, Info, CheckCircle2, User, Heart, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthQRCodeCard } from '../../components/common/HealthQRCodeCard';

export const PatientHealthQR: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const patient =
    currentUser && currentUser.role === 'patient'
      ? currentUser
      : {
          fullName: 'Priya Sharma',
          patientId: 'TH-P-8921',
          bloodGroup: 'B+',
          age: 34,
          gender: 'Female' as const,
          location: 'Anna Nagar, Chennai',
        };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
          Digital Health Passport
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          My THULIR Health QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your secure, portable electronic identification code for clinical triage, doctor consultations, and pharmacy prescription verification.
        </p>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: The Digital QR Pass Card */}
        <div className="w-full">
          <HealthQRCodeCard
            patientId={patient.patientId}
            patientName={patient.fullName}
            bloodGroup={patient.bloodGroup}
            age={patient.age}
            gender={patient.gender}
            showActions={true}
          />
        </div>

        {/* Right: How It Works & Privacy Safeguards */}
        <div className="space-y-6">
          {/* Card: How to use */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              How Your THULIR QR Works
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Show to Doctor at OPD Reception</h4>
                  <p className="text-slate-500 mt-0.5">
                    Your doctor scans this code with their THULIR Clinical workstation to pull up your verified allergy profile and prescription timeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Scan at Pharmacy Counters</h4>
                  <p className="text-slate-500 mt-0.5">
                    Partner pharmacists scan the QR to dispense genuine medications directly from verified active doctor orders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Emergency First-Responder Access</h4>
                  <p className="text-slate-500 mt-0.5">
                    Displays immediate critical life-saving alerts (e.g. Penicillin sensitivity) during urgent care emergencies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Compliance Card */}
          <div className="bg-teal-50/60 rounded-2xl p-6 border border-teal-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-teal-900 font-bold">
              <Lock className="w-4 h-4 text-teal-700" />
              Healthcare Privacy & Security Safeguards
            </div>
            <p className="text-teal-800 leading-relaxed">
              This QR code contains only your cryptographic citizen reference token (<code>{patient.patientId}</code>). It never transmits raw sensitive diagnoses over public networks. Access to detailed scans requires authenticated healthcare role authorization.
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              HIPAA & ABDM FHIR Architectural Standard Demonstration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
