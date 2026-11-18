import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Plus, Trash2, CheckCircle, Eye, AlertTriangle, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicineItem, Prescription } from '../../types';

export const DoctorPrescriptionBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { patients, selectedDoctorPatientId, addPrescription, showToast, currentUser } = useApp();

  const [patientId, setPatientId] = useState<string>(selectedDoctorPatientId || 'TH-P-8921');
  const [diagnosis, setDiagnosis] = useState<string>('Essential Hypertension Stage 1 & Lipid Regulation');
  const [notes, setNotes] = useState<string>('Follow low-sodium diet. Monitor blood pressure weekly. Repeat fasting lipid panel in 6 weeks.');
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'builder-1',
      name: 'Telmisartan 40mg',
      dosage: '40 mg',
      frequency: '1-0-0 (Morning)',
      duration: '30 Days',
      instructions: 'Take once daily before breakfast with water',
      timing: 'Morning',
    },
    {
      id: 'builder-2',
      name: 'Atorvastatin 10mg',
      dosage: '10 mg',
      frequency: '0-0-1 (Night)',
      duration: '30 Days',
      instructions: 'Take at bedtime with water',
      timing: 'Night',
    },
  ]);

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const selectedPatient = patients.find((p) => p.patientId === patientId) || patients[0];

  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      id: `builder-${Date.now()}`,
      name: 'New Medicine',
      dosage: '500 mg',
      frequency: '1-0-1 (After Food)',
      duration: '5 Days',
      instructions: 'Take with warm water',
      timing: 'Morning & Night',
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleMedicineChange = (id: string, field: keyof MedicineItem, value: string) => {
    // Allergy warning simulation
    if (field === 'name' && value.toLowerCase().includes('penicillin') && selectedPatient.allergies.some(a => a.toLowerCase().includes('penicillin'))) {
      showToast('Safety Alert: Patient has documented Penicillin allergy!', 'error');
    }
    setMedicines(medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSavePrescription = async () => {
    if (medicines.length === 0) {
      showToast('Please add at least one medication to the prescription', 'error');
      return;
    }
    if (!diagnosis.trim()) {
      showToast('Please enter a clinical diagnosis', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const doctorName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'Dr. Arvind Swaminathan';
      const doctorId = currentUser && 'doctorId' in currentUser ? currentUser.doctorId : 'TH-D-4012';

      await addPrescription({
        patientId: selectedPatient.patientId,
        patientName: selectedPatient.fullName,
        doctorName,
        doctorId,
        hospitalClinic: 'Apollo Speciality Hospitals, Greams Road',
        date: new Date().toISOString().split('T')[0],
        medicines,
        diagnosis: diagnosis.trim(),
        status: 'Active',
        source: 'Doctor Prescribed',
        notes,
      });

      showToast(`Prescription saved to Firestore & synced with ${selectedPatient.fullName}'s records!`);
      navigate('/doctor/patients');
    } catch (err: any) {
      console.error('Failed to save prescription:', err);
      showToast('Database error: Failed to save prescription. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Clinical Order Entry
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Electronic Prescription Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Write structured prescriptions with instant patient allergy cross-check and real-time portal synchronization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Slip</span>
          </button>
          <button
            onClick={handleSavePrescription}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors disabled:bg-slate-400"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Saving to Firestore...' : 'Save & Transmit'}</span>
          </button>
        </div>
      </div>

      {/* Patient Selection & Allergy Warning Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.patientId}>
                  {p.fullName} ({p.patientId}) - Blood {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Dynamic Patient Allergy Warning Banner */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-rose-950">Patient Drug Allergy Alert: </span>
              <span className="font-bold text-rose-800">
                {selectedPatient.allergies.join(', ') || 'No known drug allergies reported'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-rose-600 font-semibold uppercase">
            Auto Safety Check Active
          </span>
        </div>
      </div>

      {/* Medicines Table Builder */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Medications ({medicines.length})
          </h3>
          <button
            onClick={handleAddMedicine}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medication Item</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Medicine Name</th>
                <th className="py-2.5 px-2 font-semibold">Dosage</th>
                <th className="py-2.5 px-2 font-semibold">Frequency</th>
                <th className="py-2.5 px-2 font-semibold">Duration</th>
                <th className="py-2.5 px-3 font-semibold">Instructions</th>
                <th className="py-2.5 px-2 font-semibold text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="p-2">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleMedicineChange(m.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={m.dosage}
                      onChange={(e) => handleMedicineChange(m.id, 'dosage', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={m.frequency}
                      onChange={(e) => handleMedicineChange(m.id, 'frequency', e.target.value)}
                      className="w-28 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) => handleMedicineChange(m.id, 'duration', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={m.instructions}
                      onChange={(e) => handleMedicineChange(m.id, 'instructions', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleRemoveMedicine(m.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctor Remarks / Advice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Doctor Clinical Advice & Dietary Instructions
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Prescription Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-teal-50/70">
              <h3 className="text-sm font-bold text-slate-900">Digital Prescription Preview</h3>
              <button onClick={() => setShowPreviewModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-base text-slate-900">Dr. Arvind Swaminathan</h4>
                  <p className="text-slate-500">MD, DM (Cardiology), FACC · Reg: TN-MED-48201</p>
                  <p className="text-teal-800 font-semibold">Apollo Speciality Hospitals, Greams Road</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-400">Date: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-slate-900">{selectedPatient.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient ID</span>
                  <span className="font-mono font-bold text-teal-800">{selectedPatient.patientId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Diagnosis</span>
                  <span className="font-semibold text-slate-800">{diagnosis}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 mb-2">Rx Medications</h5>
                <ul className="space-y-2">
                  {medicines.map((m, idx) => (
                    <li key={m.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {m.name}</span>
                        <span className="font-mono text-teal-800">{m.dosage}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        {m.frequency} · Duration: {m.duration} · {m.instructions}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">Doctor Advice:</span>
                  <p className="text-slate-600">{notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Back to Edit
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSavePrescription();
                }}
                className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
              >
                Confirm & Issue Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
