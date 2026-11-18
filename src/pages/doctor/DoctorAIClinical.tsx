import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, XCircle, AlertTriangle, MessageSquare, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClinicalSuggestion {
  id: string;
  category: 'Drug Interaction' | 'Lab Follow-up' | 'Therapy Optimization' | 'Lifestyle Guidance';
  title: string;
  description: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  doctorNote?: string;
}

const INITIAL_SUGGESTIONS: ClinicalSuggestion[] = [
  {
    id: 'sug-1',
    category: 'Drug Interaction',
    title: 'Penicillin Cross-Reactivity Guard',
    description: 'Patient Priya Sharma has severe documented allergy to Penicillin. All beta-lactams (Amoxicillin, Ampicillin, Piperacillin) flagged as hard contraindications.',
    status: 'Accepted',
    doctorNote: 'Confirmed. Regimen restricted to macrolides or fluoroquinolones if antibiotic required.',
  },
  {
    id: 'sug-2',
    category: 'Therapy Optimization',
    title: 'Lipid Target Achieved - Statin Maintenance',
    description: 'LDL reduced from 142 mg/dL to 102 mg/dL over 6 months on Atorvastatin 10mg daily. Recommend continuing baseline statin dose.',
    status: 'Pending',
  },
  {
    id: 'sug-3',
    category: 'Lab Follow-up',
    title: 'Serum Vitamin D3 Re-evaluation',
    description: 'Baseline 25-OH Vitamin D was 18.2 ng/mL (Sub-optimal). Patient completing 8-week 60,000 IU replacement. Schedule follow-up test in May 2026.',
    status: 'Pending',
  },
  {
    id: 'sug-4',
    category: 'Lifestyle Guidance',
    title: 'Metformin Renal Safety Monitoring',
    description: 'Current eGFR is 92 mL/min (Normal). Recommend annual serum creatinine assay while patient maintains Metformin 500mg SR twice daily.',
    status: 'Pending',
  },
];

export const DoctorAIClinical: React.FC = () => {
  const { showToast, patients, selectedDoctorPatientId } = useApp();
  const [suggestions, setSuggestions] = useState<ClinicalSuggestion[]>(INITIAL_SUGGESTIONS);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const patient = patients.find((p) => p.patientId === selectedDoctorPatientId) || patients[0];

  const handleUpdateStatus = (id: string, newStatus: 'Accepted' | 'Rejected') => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showToast(`Clinical suggestion marked as ${newStatus}`);
  };

  const handleSaveNote = (id: string) => {
    if (!noteInput.trim()) return;
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, doctorNote: noteInput } : s))
    );
    setActiveNoteId(null);
    setNoteInput('');
    showToast('Doctor clinical note saved to recommendation.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Augmented Clinical Decision Support
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            AI Clinical Support & Risk Correlation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evidence-based observations correlating patient medications, pathology trends, and drug allergies
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold self-start sm:self-auto">
          Active Case: {patient.fullName} ({patient.patientId})
        </span>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Important Clinical AI Notice:</strong>
          All suggestions are algorithmic decision aids designed for physician review. They do not constitute autonomous medical advice or final clinical decisions. <strong>Doctor review is strictly required.</strong>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    item.category === 'Drug Interaction'
                      ? 'bg-rose-100 text-rose-800'
                      : item.category === 'Lab Follow-up'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded self-start sm:self-auto ${
                  item.status === 'Accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'Rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>

            {item.doctorNote && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">Doctor Decision Note:</strong>
                {item.doctorNote}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <span className="text-[10px] text-slate-400">
                THULIR Clinical Knowledge Graph Rule Engine
              </span>

              <div className="flex items-center gap-2">
                {activeNoteId === item.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Enter physician note..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      onClick={() => handleSaveNote(item.id)}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setActiveNoteId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveNoteId(item.id);
                      setNoteInput(item.doctorNote || '');
                    }}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{item.doctorNote ? 'Edit Note' : 'Add Note'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleUpdateStatus(item.id, 'Accepted')}
                  className="px-3 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>

                <button
                  onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                  className="px-3 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
