import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, FileText, Trash2, Store, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from '../../components/common/ThulirLogo';
import { PharmacyUser } from '../../types';

export const PharmacyRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { savePharmacyRegistration, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('9940');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    username: 'apollogreen',
    userId: 'PH-CHE-1098',
    email: 'care@apollogreenmeds.in',
    password: 'pharmacypassword',
    confirmPassword: 'pharmacypassword',
    phone: '+91 94444 88990',
    pharmacyName: 'Apollo Green Meds',
    ownerName: 'G. Sundaram (Chief Pharmacist)',
    location: 'Anna Nagar West, Chennai',
    address: '14, 2nd Avenue, Near Roundtana, Anna Nagar West, Chennai 600040',
    pharmacyType: '24/7 Chemist' as 'Retail' | 'Hospital Attached' | 'Wholesale' | '24/7 Chemist',
    registrationNumber: 'TN-DRUG-LIC-2024-8871',
    gstNumber: '33AAACA1122K1Z9',
  });

  const [documents, setDocuments] = useState([
    {
      id: 'reg-cert',
      label: 'Pharmacy Registration Certificate (Form 20/21)',
      fileName: 'Tamil_Nadu_Pharmacy_Council_Reg_8871.pdf',
      status: 'Demo Verified' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
    {
      id: 'drug-lic',
      label: 'Retail Drug License & Schedule H Authorization',
      fileName: 'Form_20_Retail_Drug_License.pdf',
      status: 'Demo Verified' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
    {
      id: 'gst-cert',
      label: 'GSTIN Registration & Business Incorporation Document',
      fileName: 'GST_Certificate_33AAACA1122K1Z9.pdf',
      status: 'Demo Verified' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    showToast('Demo OTP sent: 9940');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '9940' || otpCode.trim().length === 4) {
      setIsOtpVerified(true);
      showToast('Pharmacy phone number verified successfully.');
    }
  };

  const handleFileUpload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, fileName: `License_Document_${Date.now()}.pdf`, status: 'Uploaded' }
          : d
      )
    );
    showToast('License document uploaded (Simulated)');
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, fileName: '', status: 'Not Uploaded' } : d
      )
    );
    showToast('Document removed', 'info');
  };

  const handleSaveAccount = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newPharmacy: PharmacyUser = {
        id: `ph-${Date.now()}`,
        pharmacyId: `TH-PH-${Math.floor(1000 + Math.random() * 9000)}`,
        username: formData.username,
        email: formData.email,
        role: 'pharmacy',
        phone: formData.phone,
        pharmacyName: formData.pharmacyName,
        ownerName: formData.ownerName,
        location: formData.location,
        address: formData.address,
        pharmacyType: formData.pharmacyType,
        registrationNumber: formData.registrationNumber,
        gstNumber: formData.gstNumber,
        isVerified: true,
        documents: documents.map((d) => ({
          name: d.fileName || d.label,
          status: d.status === 'Not Uploaded' ? 'Uploaded' : (d.status as any),
          uploadedAt: new Date().toISOString().split('T')[0],
        })),
        createdAt: new Date().toISOString(),
      };

      await savePharmacyRegistration(newPharmacy, formData.password);
      showToast('Pharmacy registered & saved to Firestore database!');
      navigate('/pharmacy/dashboard');
    } catch (err: any) {
      console.error('Failed to register pharmacy in Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/register"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Role Selection
          </Link>
          <ThulirLogo size="sm" />
          <div className="w-20" />
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Pharmacy Registration
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Step {currentStep} of 4:{' '}
                {currentStep === 1 && 'Account & Credentials'}
                {currentStep === 2 && 'Phone Verification'}
                {currentStep === 3 && 'Pharmacy Profile & GSTIN'}
                {currentStep === 4 && 'Drug License Uploads & Review'}
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-700 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Pharmacy Business Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Store User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Company Phone Number OTP Verification
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Company Phone</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
                  >
                    Send Demo OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <p className="text-xs text-teal-900">
                    Enter the simulated 4-digit code (Demo Code: <strong>9940</strong>)
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="9940"
                      className="w-28 text-center tracking-widest font-mono text-sm px-3 py-2 bg-white border border-teal-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {isOtpVerified && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Pharmacy phone verified successfully.
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Pharmacy Profile & Regulatory Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Pharmacy Name</label>
                <input
                  type="text"
                  value={formData.pharmacyName}
                  onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Chief Pharmacist</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pharmacy Type</label>
                  <select
                    value={formData.pharmacyType}
                    onChange={(e) => handleInputChange('pharmacyType', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="24/7 Chemist">24/7 Chemist</option>
                    <option value="Retail">Retail Pharmacy</option>
                    <option value="Hospital Attached">Hospital Attached</option>
                    <option value="Wholesale">Wholesale Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Drug License Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Neighborhood / City Area</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Anna Nagar West, Chennai"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Physical Store Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Drug License Documentation & Review
              </h3>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{doc.label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.status === 'Demo Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    {doc.fileName ? (
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-cyan-700 shrink-0" />
                          <span className="font-mono text-[11px] truncate">{doc.fileName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleFileUpload(doc.id)}
                            className="p-1 text-slate-500 hover:text-cyan-700 text-[11px] font-medium"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFileUpload(doc.id)}
                        className="flex items-center justify-center gap-1.5 w-full py-2 bg-white border border-dashed border-slate-300 hover:border-cyan-500 rounded-lg text-xs font-medium text-slate-600 hover:text-cyan-700"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload License Document
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hackathon Demo Disclaimer:</strong> License numbers and GST verification are simulated for this demonstration. No actual regulatory bodies are accessed.
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => p - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => p + 1)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAccount}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Account & Open Pharmacy Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
