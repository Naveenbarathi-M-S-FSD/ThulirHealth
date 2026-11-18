import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Edit2, CheckCircle, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientUser } from '../../types';

export const PatientProfile: React.FC = () => {
  const { currentUser, updatePatientProfile, showToast } = useApp();

  const patient =
    currentUser && currentUser.role === 'patient'
      ? (currentUser as PatientUser)
      : {
          fullName: 'Priya Sharma',
          patientId: 'TH-P-8921',
          email: 'priya.sharma@example.com',
          phone: '+91 98401 23456',
          gender: 'Female' as const,
          dob: '1992-06-15',
          age: 34,
          bloodGroup: 'B+',
          location: 'Anna Nagar, Chennai, Tamil Nadu',
          allergies: ['Penicillin', 'Sulfa Drugs'],
          existingConditions: ['Type 2 Diabetes (Mild)', 'Essential Hypertension'],
          emergencyContact: {
            name: 'Rohan Sharma',
            relation: 'Spouse',
            phone: '+91 98401 98765',
          },
          overallHealthStatus: 'Stable' as const,
        };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: patient.fullName,
    phone: patient.phone,
    email: patient.email,
    location: patient.location,
    bloodGroup: patient.bloodGroup,
    allergies: patient.allergies.join(', '),
    existingConditions: patient.existingConditions.join(', '),
    emergencyName: patient.emergencyContact.name,
    emergencyRelation: patient.emergencyContact.relation,
    emergencyPhone: patient.emergencyContact.phone,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Full name is required', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updatePatientProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies.split(',').map((s) => s.trim()).filter(Boolean),
        existingConditions: formData.existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
        emergencyContact: {
          name: formData.emergencyName.trim(),
          relation: formData.emergencyRelation.trim(),
          phone: formData.emergencyPhone.trim(),
        },
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update patient profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Health Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Personal demographic information, allergies, and emergency points of contact
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        {/* Top Info Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {patient.fullName.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{patient.fullName}</h2>
                <span className="font-mono text-xs font-semibold text-teal-700">
                  Patient ID: {patient.patientId}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold self-center sm:self-start">
                Status: {patient.overallHealthStatus}
              </span>
            </div>

            <p className="text-xs text-slate-500 pt-1">
              Registered Citizen Profile · {patient.age} Years Old · {patient.gender}
            </p>
          </div>
        </div>

        {/* View vs Edit Mode */}
        {!isEditing ? (
          <div className="pt-6 space-y-6 text-xs">
            {/* Demographics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Blood Group</span>
                <span className="font-bold text-rose-700 text-sm">{patient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                <span className="font-semibold text-slate-800">{patient.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Primary Contact</span>
                <span className="font-semibold text-slate-800">{patient.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <span className="font-semibold text-slate-800">{patient.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Residential Address</span>
                <span className="font-semibold text-slate-800">{patient.location}</span>
              </div>
            </div>

            {/* Medical Alerts & Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="font-bold text-rose-950 block mb-1">Drug Allergies</span>
                <p className="font-medium text-rose-800">
                  {patient.allergies.join(', ') || 'None Reported'}
                </p>
                <span className="text-[10px] text-rose-600 block mt-1">
                  High alert: Broad-spectrum penicillin contraindicated.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-950 block mb-1">Existing Conditions</span>
                <p className="font-medium text-amber-800">
                  {patient.existingConditions.join(', ') || 'None Reported'}
                </p>
                <span className="text-[10px] text-amber-600 block mt-1">
                  Monitored via routine quarterly blood assays.
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Emergency Contact Information</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Name</span>
                  <span className="font-semibold text-slate-800">{patient.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Relationship</span>
                  <span className="font-semibold text-slate-800">{patient.emergencyContact.relation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold font-mono text-teal-800">{patient.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="pt-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Drug Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Existing Medical Conditions
                </label>
                <input
                  type="text"
                  value={formData.existingConditions}
                  onChange={(e) => setFormData({ ...formData, existingConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Emergency Contact</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-xl shadow-xs transition-colors"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
