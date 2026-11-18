import React, { useState } from 'react';
import { Pill, CheckCircle2, Plus, Clock, Trash2, Edit2, AlertCircle, Sparkles, X, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicineReminder } from '../../types';

export const MedicineReminders: React.FC = () => {
  const { medicineReminders, toggleMedicineTaken, addMedicineReminder, deleteMedicineReminder, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [time, setTime] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('Daily (Morning)');
  const [duration, setDuration] = useState('30 Days');

  const takenCount = medicineReminders.filter((m) => m.takenToday).length;
  const progressPercent = Math.round((takenCount / (medicineReminders.length || 1)) * 100);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Medicine name is required', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addMedicineReminder({
        patientId: 'TH-P-8921',
        medicineName: name.trim(),
        dosage,
        time,
        frequency,
        duration,
        takenToday: false,
        nextScheduled: `Today at ${time}`,
      });

      setShowAddModal(false);
      setName('');
    } catch (err: any) {
      console.error('Failed to create reminder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Daily Medicine Adherence & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track daily dosages, log timestamps, and maintain cardiovascular medication adherence
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dose Reminder</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="bg-linear-to-r from-teal-800 to-emerald-800 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              Today's Adherence Streak
            </span>
            <h2 className="text-lg font-bold">
              {takenCount} of {medicineReminders.length} Doses Logged
            </h2>
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-300">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {medicineReminders.map((rem) => (
          <div
            key={rem.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
              rem.takenToday
                ? 'bg-emerald-50/40 border-emerald-200/80'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start sm:items-center gap-4">
              <button
                onClick={() => toggleMedicineTaken(rem.id)}
                className={`p-2 rounded-xl transition-all ${
                  rem.takenToday
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 border border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-600'
                }`}
                title={rem.takenToday ? 'Mark as Not Taken' : 'Mark as Taken'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-bold ${
                      rem.takenToday ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {rem.medicineName}
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                    {rem.dosage}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Schedule: <strong>{rem.frequency}</strong> · Duration: {rem.duration}
                </p>

                {rem.takenAt && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ✓ Logged: {rem.takenAt}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono font-bold text-slate-800 block">
                  {rem.time}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    rem.takenToday ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {rem.takenToday ? 'Completed Today' : `Next: ${rem.nextScheduled}`}
                </span>
              </div>

              <button
                onClick={() => deleteMedicineReminder(rem.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note on alerts */}
      <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-500 flex items-start gap-2">
        <Bell className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Simulated Notifications:</strong> Reminders provide in-browser audio and banner prompts while the THULIR web app is open. Does not send OS background push notifications when browser is terminated.
        </span>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Add Medicine Reminder</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telmisartan 40mg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Daily (Morning)">Daily (Morning)</option>
                    <option value="Daily (Night)">Daily (Night)</option>
                    <option value="Twice Daily (Morning & Night)">Twice Daily</option>
                    <option value="Weekly (Sundays)">Weekly (Sundays)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Reminder'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
