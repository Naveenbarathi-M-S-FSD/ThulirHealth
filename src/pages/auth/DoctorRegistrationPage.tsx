import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, FileText, Trash2, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from '../../components/common/ThulirLogo';
import { DoctorUser } from '../../types';

export const DoctorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveDoctorRegistration, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('5512');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    username: 'drarvind',
    userId: 'DOC-TN-8820',
    email: 'arvind.swaminathan@thulirhealth.org',
    password: 'doctorpassword',
    confirmPassword: 'doctorpassword',
    phone: '+91 98840 55667',
    fullName: 'Dr. Arvind Swaminathan',
    gender: 'Male',
    age: 48,
    specialization: 'Cardiology & Internal Medicine',
    qualification: 'MD, DM (Cardiology), FACC',
    registrationNumber: 'TN-MED-48201',
    yearsOfExperience: 18,
    hospitalName: 'Apollo Speciality Hospitals, Greams Road',
    hospitalType: 'Private Super-Specialty' as 'Government' | 'Private Super-Specialty' | 'Clinic',
    location: 'Chennai, Tamil Nadu',
  });

  const [documents, setDocuments] = useState([
    {
      id: 'doc-cert',
      label: 'Medical Registration Certificate (State / National Council)',
      fileName: 'TN_Medical_Council_Registration_48201.pdf',
      status: 'Demo Verified' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
    {
      id: 'qual-cert',
      label: 'Super-Specialty Qualification Certificate (DM / DNB)',
      fileName: 'DM_Cardiology_Degree_GoldMedal.pdf',
      status: 'Demo Verified' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
    {
      id: 'hosp-cert',
      label: 'Hospital Verification & Clinical Privilege Document',
      fileName: 'Apollo_Hospitals_Privilege_Letter.pdf',
      status: 'Uploaded' as 'Not Uploaded' | 'Uploaded' | 'Under Review' | 'Demo Verified',
    },
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    showToast('Demo OTP sent: 5512');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '5512' || otpCode.trim().length === 4) {
      setIsOtpVerified(true);
      showToast('Doctor phone number verified successfully.');
    }
  };

  const handleFileUpload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, fileName: `Scanned_Clinical_Doc_${Date.now()}.pdf`, status: 'Uploaded' }
          : d
      )
    );
    showToast('Document uploaded successfully (Simulated)');
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
      const newDoctor: DoctorUser = {
        id: `doc-${Date.now()}`,
        doctorId: `TH-D-${Math.floor(1000 + Math.random() * 9000)}`,
        username: formData.username,
        email: formData.email,
        role: 'doctor',
        phone: formData.phone,
        fullName: formData.fullName,
        gender: formData.gender,
        age: Number(formData.age) || 48,
        specialization: formData.specialization,
        qualification: formData.qualification,
        registrationNumber: formData.registrationNumber,
        yearsOfExperience: Number(formData.yearsOfExperience) || 15,
        hospitalName: formData.hospitalName,
        hospitalType: formData.hospitalType,
        location: formData.location,
        rating: 4.9,
        isVerified: true,
        documents: documents.map((d) => ({
          name: d.fileName || d.label,
          status: d.status === 'Not Uploaded' ? 'Uploaded' : (d.status as any),
          uploadedAt: new Date().toISOString().split('T')[0],
        })),
        createdAt: new Date().toISOString(),
      };

      await saveDoctorRegistration(newDoctor, formData.password);
      showToast('Doctor profile registered & saved to Firestore database!');
      navigate('/doctor/dashboard');
    } catch (err: any) {
      console.error('Failed to register doctor in Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
                Doctor Registration
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Step {currentStep} of 4:{' '}
                {currentStep === 1 && 'Account & Credentials'}
                {currentStep === 2 && 'Phone Verification'}
                {currentStep === 3 && 'Biographical & Clinical Practice'}
                {currentStep === 4 && 'Document Upload & Review'}
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {/* STEP 1: Account Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Doctor Account Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor ID / Reference</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Phone Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Phone Number Verification
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Mobile Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    Send Demo OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <p className="text-xs text-teal-900">
                    Enter the simulated 4-digit code sent to your phone (Demo Code: <strong>5512</strong>)
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="5512"
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
                  Doctor mobile verified successfully.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Biographical & Professional */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Biographical & Professional Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / National Medical Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital or Clinic Name</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Type</label>
                  <select
                    value={formData.hospitalType}
                    onChange={(e) => handleInputChange('hospitalType', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Private Super-Specialty">Private Super-Specialty</option>
                    <option value="Government">Government / Public Hospital</option>
                    <option value="Clinic">Independent Private Clinic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City & State</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Documents & Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Medical Credential Document Uploads & Review
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
                            : doc.status === 'Uploaded'
                            ? 'bg-teal-100 text-teal-800'
                            : doc.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    {doc.fileName ? (
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-mono text-[11px] truncate">{doc.fileName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleFileUpload(doc.id)}
                            className="p-1 text-slate-500 hover:text-teal-700 text-[11px] font-medium"
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
                        className="flex items-center justify-center gap-1.5 w-full py-2 bg-white border border-dashed border-slate-300 hover:border-teal-500 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-700 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Credential Document
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hackathon Prototype Notice:</strong> Credential verification is simulated for demonstration purposes. No real regulatory submission is executed.
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
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
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAccount}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Account & Open Doctor Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
