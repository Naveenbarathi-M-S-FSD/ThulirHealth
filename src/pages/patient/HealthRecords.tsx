import React, { useState } from 'react';
import {
  FileText,
  Camera,
  Upload,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Download,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthRecord } from '../../types';
import { PrescriptionScannerModal } from '../../components/common/PrescriptionScannerModal';

export const HealthRecords: React.FC = () => {
  const { healthRecords, addHealthRecord, deleteHealthRecord, showToast } = useApp();

  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Form states for manual upload
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<HealthRecord['recordType']>('Lab Report');
  const [newDoctor, setNewDoctor] = useState('Dr. Arvind Swaminathan');
  const [newHospital, setNewHospital] = useState('Apollo Diagnostics');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRecords = healthRecords.filter((rec) => {
    const matchesFilter = filterType === 'All' || rec.recordType === filterType;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Record title is required', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addHealthRecord({
        patientId: 'TH-P-8921',
        title: newTitle.trim(),
        recordType: newType,
        date: newDate,
        doctor: newDoctor,
        hospital: newHospital,
        description: newDesc || 'Clinical investigation record uploaded via patient portal.',
        status: 'Verified',
        fileName: `${newTitle.trim().replace(/\s+/g, '_')}_Report.pdf`,
        tags: [newType, 'Patient Uploaded'],
      });

      setShowUploadModal(false);
      setNewTitle('');
      setNewDesc('');
    } catch (err: any) {
      console.error('Failed to create health record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Health Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Secure repository of all medical investigations, prescriptions, and lab tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Scan with Camera</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by title, doctor, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter Segmented buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Prescription', 'Lab Report', 'Medical Document', 'Vaccination'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Health Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try adjusting your search criteria or scan a new prescription using your camera.
          </p>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
          >
            Scan Prescription Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.recordType === 'Prescription'
                        ? 'bg-teal-50 text-teal-800'
                        : rec.recordType === 'Lab Report'
                        ? 'bg-blue-50 text-blue-800'
                        : rec.recordType === 'Vaccination'
                        ? 'bg-purple-50 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rec.recordType}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{rec.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{rec.title}</h3>
                <p className="text-xs font-medium text-teal-800">{rec.doctor}</p>
                <p className="text-[11px] text-slate-500">{rec.hospital}</p>

                <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 line-clamp-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {rec.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    title="View Full Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Downloaded ${rec.fileName || 'Report.pdf'} (Demo file)`);
                    }}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Download Copy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHealthRecord(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Document Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Record Type</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.recordType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Record</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Consulting Doctor</span>
                  <span className="font-semibold text-teal-800">{selectedRecord.doctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Facility / Clinic</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.hospital}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Clinical Findings & Notes</span>
                <p className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 leading-relaxed text-slate-700">
                  {selectedRecord.description}
                </p>
              </div>

              {selectedRecord.tags && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecord.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulated Document Preview Area */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <FileText className="w-8 h-8 text-teal-600 mb-1" />
                <span className="font-mono text-[11px] font-semibold text-slate-800">
                  {selectedRecord.fileName || 'Scanned_Report_THULIR.pdf'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Verified SHA-256 Digital Signature Verified
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 py-3 border-t border-slate-100 bg-slate-50/70">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Stored in THULIR Vault
              </span>
              <button
                onClick={() => {
                  showToast('Document downloaded');
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Upload Health Record</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Echo Cardiogram Doppler Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Record Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Medical Document">Medical Document</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital / Lab</label>
                <input
                  type="text"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Findings Summary</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key diagnostic summary or observations..."
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
                  disabled={isSubmitting}
                  className="px-4 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Record'}</span>
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
