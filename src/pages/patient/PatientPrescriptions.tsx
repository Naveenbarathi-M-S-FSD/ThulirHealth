import React, { useState } from 'react';
import {
  Pill,
  Camera,
  Download,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Prescription, MedicineItem } from '../../types';
import { PrescriptionScannerModal } from '../../components/common/PrescriptionScannerModal';

export const PatientPrescriptions: React.FC = () => {
  const { prescriptions, updatePrescription, deletePrescription, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Doctor Prescribed' | 'Camera Scan' | 'Previous'>('All');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [editingRx, setEditingRx] = useState<Prescription | null>(null);

  const filtered = prescriptions.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return p.status === 'Active';
    if (activeTab === 'Previous') return p.status === 'Completed' || p.status === 'Previous';
    if (activeTab === 'Doctor Prescribed') return p.source === 'Doctor Prescribed';
    if (activeTab === 'Camera Scan') return p.source === 'Camera Scan';
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRx) return;
    updatePrescription(editingRx.id, editingRx);
    setEditingRx(null);
  };

  const handleDownloadSummary = (rx: Prescription) => {
    showToast(`Prescription summary for ${rx.doctorName} (${rx.date}) downloaded as PDF`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Prescriptions & Medication Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Digital records of doctor prescriptions and camera-scanned slips
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Scan New Prescription</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {['All', 'Active', 'Doctor Prescribed', 'Camera Scan', 'Previous'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Prescriptions in this view</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Scan your physical doctor slip or wait for your doctor to issue a digital prescription.
            </p>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
            >
              Scan Prescription with Camera
            </button>
          </div>
        ) : (
          filtered.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-200 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rx.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rx.status}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                      Source: {rx.source}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{rx.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{rx.diagnosis || 'Prescription'}</h3>
                  <p className="text-xs text-teal-800 font-semibold">{rx.doctorName}</p>
                  <p className="text-[11px] text-slate-500">{rx.hospitalClinic}</p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedRx(rx)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>
                  <button
                    onClick={() => setEditingRx(rx)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadSummary(rx)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Download Summary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePrescription(rx.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Medicines Table */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-2 pr-4 font-semibold">Medicine</th>
                      <th className="py-2 px-3 font-semibold">Dosage</th>
                      <th className="py-2 px-3 font-semibold">Frequency</th>
                      <th className="py-2 px-3 font-semibold">Duration</th>
                      <th className="py-2 pl-3 font-semibold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rx.medicines.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 pr-4 font-bold text-slate-900">{med.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{med.dosage}</td>
                        <td className="py-2.5 px-3 text-slate-700">{med.frequency}</td>
                        <td className="py-2.5 px-3 font-medium text-teal-800">{med.duration}</td>
                        <td className="py-2.5 pl-3 text-slate-500">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.notes && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                  <strong className="text-slate-800">Doctor Advice:</strong> {rx.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-teal-50/60">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Prescription Details · {selectedRx.date}
                </h3>
              </div>
              <button onClick={() => setSelectedRx(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Doctor</span>
                  <span className="font-bold text-slate-900">{selectedRx.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hospital / Clinic</span>
                  <span className="text-slate-800">{selectedRx.hospitalClinic}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Diagnosis</span>
                  <span className="font-semibold text-teal-800">{selectedRx.diagnosis}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Source Verification</span>
                  <span className="text-slate-800">{selectedRx.source}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Prescribed Items ({selectedRx.medicines.length})</h4>
                <div className="space-y-2">
                  {selectedRx.medicines.map((m) => (
                    <div key={m.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="font-mono text-teal-700 font-semibold">{m.dosage}</span>
                      </div>
                      <p className="text-slate-600">
                        Frequency: <strong>{m.frequency}</strong> · Duration: <strong>{m.duration}</strong>
                      </p>
                      <p className="text-slate-500 mt-1 italic">Directions: {m.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Prescription Record</h3>
              <button onClick={() => setEditingRx(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={editingRx.diagnosis}
                  onChange={(e) => setEditingRx({ ...editingRx, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={editingRx.doctorName}
                  onChange={(e) => setEditingRx({ ...editingRx, doctorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Remarks / Advice</label>
                <textarea
                  rows={2}
                  value={editingRx.notes || ''}
                  onChange={(e) => setEditingRx({ ...editingRx, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingRx.status}
                  onChange={(e) => setEditingRx({ ...editingRx, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Previous">Previous</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRx(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Camera Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
