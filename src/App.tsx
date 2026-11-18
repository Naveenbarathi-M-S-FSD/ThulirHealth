import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { PatientRegistrationPage } from './pages/auth/PatientRegistrationPage';
import { DoctorRegistrationPage } from './pages/auth/DoctorRegistrationPage';
import { PharmacyRegistrationPage } from './pages/auth/PharmacyRegistrationPage';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientProfile } from './pages/patient/PatientProfile';
import { HealthRecords } from './pages/patient/HealthRecords';
import { MedicalHistory } from './pages/patient/MedicalHistory';
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { MedicineReminders } from './pages/patient/MedicineReminders';
import { PatientInsurance } from './pages/patient/PatientInsurance';
import { PatientHealthQR } from './pages/patient/PatientHealthQR';
import { PatientHealthSummary } from './pages/patient/PatientHealthSummary';
import { ImportantHealthIssues } from './pages/patient/ImportantHealthIssues';
import { PatientAIAssistant } from './pages/patient/PatientAIAssistant';
import { PatientNotifications } from './pages/patient/PatientNotifications';
import { PatientSettings } from './pages/patient/PatientSettings';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorMyPatients } from './pages/doctor/DoctorMyPatients';
import { DoctorPatientHealth } from './pages/doctor/DoctorPatientHealth';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { DoctorLabReports } from './pages/doctor/DoctorLabReports';
import { DoctorPrescriptionBuilder } from './pages/doctor/DoctorPrescriptionBuilder';
import { DoctorAIClinical } from './pages/doctor/DoctorAIClinical';
import { DoctorNotifications } from './pages/doctor/DoctorNotifications';
import { DoctorProfile } from './pages/doctor/DoctorProfile';

// Pharmacy Pages
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { PharmacyProfile } from './pages/pharmacy/PharmacyProfile';
import { PharmacyCreatePost } from './pages/pharmacy/PharmacyCreatePost';
import { PharmacyMyPosts } from './pages/pharmacy/PharmacyMyPosts';
import { PharmacyMarketplace } from './pages/pharmacy/PharmacyMarketplace';
import { PharmacyStock } from './pages/pharmacy/PharmacyStock';
import { PharmacyOffers } from './pages/pharmacy/PharmacyOffers';
import { PharmacySearch } from './pages/pharmacy/PharmacySearch';
import { PharmacyLocation } from './pages/pharmacy/PharmacyLocation';
import { PharmacyVacancies } from './pages/pharmacy/PharmacyVacancies';
import { PharmacyMessages } from './pages/pharmacy/PharmacyMessages';
import { PharmacyNotifications } from './pages/pharmacy/PharmacyNotifications';

import { UserRole } from './types';

// Route guard component
const RoleRoute: React.FC<{ allowedRole: UserRole; children: React.ReactNode }> = ({
  allowedRole,
  children,
}) => {
  const { currentUser, role } = useApp();

  if (!currentUser || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    if (role === 'patient') return <Navigate to="/patient/dashboard" replace />;
    if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { currentUser, role } = useApp();

  if (!currentUser || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'patient') return <Navigate to="/patient/dashboard" replace />;
  if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  if (role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Index & Auth */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RoleSelectionPage />} />
          <Route path="/register/patient" element={<PatientRegistrationPage />} />
          <Route path="/register/doctor" element={<DoctorRegistrationPage />} />
          <Route path="/register/pharmacy" element={<PharmacyRegistrationPage />} />

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <RoleRoute allowedRole="patient">
                <DashboardLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="health-records" element={<HealthRecords />} />
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="medicine-reminders" element={<MedicineReminders />} />
            <Route path="insurance" element={<PatientInsurance />} />
            <Route path="health-qr" element={<PatientHealthQR />} />
            <Route path="health-summary" element={<PatientHealthSummary />} />
            <Route path="important-issues" element={<ImportantHealthIssues />} />
            <Route path="ai-assistant" element={<PatientAIAssistant />} />
            <Route path="notifications" element={<PatientNotifications />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <RoleRoute allowedRole="doctor">
                <DashboardLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<DoctorMyPatients />} />
            <Route path="patient-health" element={<DoctorPatientHealth />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="schedule" element={<DoctorSchedule />} />
            <Route path="medical-records" element={<HealthRecords />} />
            <Route path="lab-reports" element={<DoctorLabReports />} />
            <Route path="prescription-builder" element={<DoctorPrescriptionBuilder />} />
            <Route path="ai-clinical" element={<DoctorAIClinical />} />
            <Route path="notifications" element={<DoctorNotifications />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy"
            element={
              <RoleRoute allowedRole="pharmacy">
                <DashboardLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
            <Route path="dashboard" element={<PharmacyDashboard />} />
            <Route path="profile" element={<PharmacyProfile />} />
            <Route path="create-post" element={<PharmacyCreatePost />} />
            <Route path="my-posts" element={<PharmacyMyPosts />} />
            <Route path="marketplace" element={<PharmacyMarketplace />} />
            <Route path="stock" element={<PharmacyStock />} />
            <Route path="offers" element={<PharmacyOffers />} />
            <Route path="search" element={<PharmacySearch />} />
            <Route path="location" element={<PharmacyLocation />} />
            <Route path="vacancies" element={<PharmacyVacancies />} />
            <Route path="messages" element={<PharmacyMessages />} />
            <Route path="notifications" element={<PharmacyNotifications />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
