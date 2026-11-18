import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, ShieldCheck, User, Phone, Heart, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from '../../components/common/ThulirLogo';
import { PatientUser } from '../../types';

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { savePatientRegistration, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('4082');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form fields
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    username: 'priyasharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    // Step 2: Verification
    phone: '+91 98401 23456',
    // Step 3: Personal Info
    fullName: 'Priya Sharma',
    gender: 'Female' as 'Female' | 'Male' | 'Other',
    dob: '1992-06-15',
    age: 34,
    location: 'Anna Nagar, Chennai, Tamil Nadu',
    bloodGroup: 'B+',
    // Step 4: Health Info
    medicalHistory: 'Mild Hypertension diagnosed in 2023. Routine cardiologist checkups.',
    allergies: 'Penicillin, Sulfa Drugs',
    existingConditions: 'Type 2 Diabetes (Mild), Essential Hypertension',
    emergencyContactName: 'Rohan Sharma',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+91 98401 98765',
  });

  const steps = [
    { number: 1, title: 'Account' },
    { number: 2, title: 'Verification' },
    { number: 3, title: 'Personal Info' },
    { number: 4, title: 'Health Info' },
    { number: 5, title: 'Review & Save' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSendOtp = () => {
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Please enter a valid mobile number' });
      return;
    }
    setOtpSent(true);
    showToast('Demo OTP sent: 4082 (Enter this code to verify)');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '4082' || otpCode.trim().length === 4) {
      setIsOtpVerified(true);
      showToast('Mobile number verified successfully.');
    } else {
      setErrors({ otp: 'Invalid OTP. Please enter 4082 for demo.' });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 2) {
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
      if (!isOtpVerified) newErrors.otp = 'Please verify your mobile number with OTP (use 4082)';
    } else if (currentStep === 3) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveAccount = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newPatient: PatientUser = {
        id: `pat-${Date.now()}`,
        patientId: `TH-P-${Math.floor(1000 + Math.random() * 9000)}`,
        username: formData.username,
        email: formData.email,
        role: 'patient',
        phone: formData.phone,
        fullName: formData.fullName,
        gender: formData.gender,
        dob: formData.dob,
        age: Number(formData.age) || 34,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        allergies: formData.allergies.split(',').map((s) => s.trim()).filter(Boolean),
        existingConditions: formData.existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone,
        },
        overallHealthStatus: 'Stable',
        createdAt: new Date().toISOString(),
      };

      await savePatientRegistration(newPatient, formData.password);
      showToast('Registration successful! Saved to Firestore database.');
      navigate('/patient/dashboard');
    } catch (err: any) {
      console.error('Failed to register patient in Firestore:', err);
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

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Patient Registration
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Step {currentStep} of 5: {steps[currentStep - 1].title}
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {Math.round((currentStep / 5) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-1 mt-4 text-center">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`text-[10px] font-semibold truncate ${
                  s.number === currentStep
                    ? 'text-teal-700 font-bold'
                    : s.number < currentStep
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {/* STEP 1: Account Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Create Your Account Credentials
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                {errors.username && <p className="text-rose-600 text-[11px] mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
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
                  {errors.password && <p className="text-rose-600 text-[11px] mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  {errors.confirmPassword && <p className="text-rose-600 text-[11px] mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Mobile Number OTP Verification
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98401 23456"
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
                {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              {otpSent && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <p className="text-xs text-teal-900">
                    Enter the simulated 4-digit OTP sent to your phone (Demo Code: <strong>4082</strong>)
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="4082"
                      className="w-28 text-center tracking-widest font-mono text-sm px-3 py-2 bg-white border border-teal-300 rounded-lg focus:outline-none focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                    >
                      Verify OTP
                    </button>
                  </div>
                  {errors.otp && <p className="text-rose-600 text-[11px]">{errors.otp}</p>}
                </div>
              )}

              {isOtpVerified && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Mobile number verified successfully.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Personal Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Personal Demographic Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  {errors.dob && <p className="text-rose-600 text-[11px] mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Address</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Anna Nagar, Chennai"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                {errors.location && <p className="text-rose-600 text-[11px] mt-1">{errors.location}</p>}
              </div>
            </div>
          )}

          {/* STEP 4: Health Information */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Baseline Medical History & Emergency Contact
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Medical Conditions (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.existingConditions}
                  onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Mild Hypertension"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Drug Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Past Medical History Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Phone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Save */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Review Profile Information Before Saving
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs border border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Full Name</span>
                    <span className="font-semibold text-slate-900">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group</span>
                    <span className="font-bold text-rose-700">{formData.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email & Phone</span>
                    <span className="text-slate-700">{formData.email} · {formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="text-slate-700">{formData.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Drug Allergies</span>
                  <span className="font-semibold text-rose-700">{formData.allergies || 'None'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Existing Conditions</span>
                  <span className="text-slate-800">{formData.existingConditions || 'None'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency Contact</span>
                  <span className="text-slate-800">
                    {formData.emergencyContactName} ({formData.emergencyContactRelation}) - {formData.emergencyContactPhone}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span>
                  By creating this account, a unique <strong>THULIR Health QR</strong> will be automatically provisioned for your medical passport.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
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
                <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Account & Open Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
