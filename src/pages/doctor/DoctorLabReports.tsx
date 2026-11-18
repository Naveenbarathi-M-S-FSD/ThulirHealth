import React, { useState } from 'react';
import { Microscope, Upload, Eye, Download, Plus, CheckCircle, Search, X, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LabReport } from '../../types';

export const DoctorLabReports: React.FC = () => {
  const { labReports, addLabReport, showToast, patients } = useApp();

  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  // Upload state
  const [patientId, setPatientId] = useState('TH-P-8921');
  const [testName, setTestName] = useState('Serum Electrolytes (Na, K, Cl)');
  const [result, setResult] = useState('Sodium: 138 mEq/L | Potassium: 4.2 mEq/L | Chloride: 101 mEq/L');
  const [refRange, setRefRange] = useState('Na: 135-145, K: 3.5-5.0, Cl: 98-107');
  const [status, setStatus] = useState<LabReport['status']>('Normal');
  const [doctorNotes, setDoctorNotes] = useState('Electrolyte balance optimal for ongoing antihypertensive therapy.');

  const filtered = labReports.filter((r) =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.testName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.patientId === patientId) || patients[0];
    addLabReport({
      patientId: p.patientId,
      patientName: p.fullName,
      testName,
      date: new Date().toISOString().split('T')[0],
      result,
      referenceRange: refRange,
      status,
      doctorNotes,
      labName: 'Apollo Clinical Pathology Central',
    });
    setShowUploadModal(false);
    showToast('Lab report uploaded & synced with patient record');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Pathology & Lab Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review lab investigations, reference intervals, and verify abnormal biomarkers
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by test name or patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-200 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{report.testName}</h3>
                  <span className="font-semibold text-teal-800">
                    Patient: {report.patientName} ({report.patientId})
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    report.status === 'Normal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.status === 'Needs Attention'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl font-mono text-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Investigation Findings</span>
                <span className="font-bold">{report.result}</span>
              </div>

              <div className="text-[11px] text-slate-500">
                Reference Range: <span className="font-mono">{report.referenceRange}</span>
              </div>

              {report.doctorNotes && (
                <div className="p-2.5 bg-teal-50/50 rounded-xl text-teal-900 text-[11px] border border-teal-100">
                  <strong>Pathologist / Doctor Observation:</strong> {report.doctorNotes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">{report.date}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => showToast(`Downloaded ${report.testName}_Report.pdf (Demo)`)}
                  className="px-2.5 py-1 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Upload Diagnostic Report</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.patientId}>
                      {p.fullName} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Result Summary</label>
                <input
                  type="text"
                  required
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Range</label>
                <input
                  type="text"
                  required
                  value={refRange}
                  onChange={(e) => setRefRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Normal">Normal</option>
                  <option value="Needs Attention">Needs Attention</option>
                  <option value="Elevated">Elevated</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Notes</label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Upload & Transmit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{selectedReport.testName}</h3>
              <button onClick={() => setSelectedReport(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="font-bold text-teal-800">
              Patient: {selectedReport.patientName} ({selectedReport.patientId})
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-slate-800">
              {selectedReport.result}
            </div>
            <p className="text-slate-500">Facility: {selectedReport.labName}</p>
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg"
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
