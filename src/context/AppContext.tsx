import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CurrentUser,
  UserRole,
  Language,
  PatientUser,
  DoctorUser,
  PharmacyUser,
  Prescription,
  HealthRecord,
  MedicalHistoryEvent,
  Appointment,
  MedicineReminder,
  LabReport,
  PharmacyProduct,
  PharmacyVacancy,
  Conversation,
  MessageItem,
  NotificationItem,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_PHARMACIES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_MEDICAL_HISTORY,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICINE_REMINDERS,
  INITIAL_LAB_REPORTS,
  INITIAL_PHARMACY_PRODUCTS,
  INITIAL_PHARMACY_VACANCIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
} from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import {
  isFirebaseConfigured,
  testConnection,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutFirebaseUser,
} from '../services/firebase';
import {
  fetchPatientsFromFirestore,
  savePatientToFirestore,
  updatePatientInFirestore,
  fetchDoctorsFromFirestore,
  saveDoctorToFirestore,
  fetchPharmaciesFromFirestore,
  savePharmacyToFirestore,
  fetchPrescriptionsFromFirestore,
  createPrescriptionInFirestore,
  updatePrescriptionInFirestore,
  deletePrescriptionFromFirestore,
  fetchAppointmentsFromFirestore,
  createAppointmentInFirestore,
  updateAppointmentInFirestore,
  fetchHealthRecordsFromFirestore,
  createHealthRecordInFirestore,
  deleteHealthRecordFromFirestore,
  fetchMedicineRemindersFromFirestore,
  createMedicineReminderInFirestore,
  updateMedicineReminderInFirestore,
  deleteMedicineReminderFromFirestore,
  fetchPharmacyProductsFromFirestore,
  createPharmacyProductInFirestore,
  updatePharmacyProductInFirestore,
  deletePharmacyProductFromFirestore,
  seedInitialFirestoreDataIfEmpty,
} from '../services/dbService';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AppContextType {
  currentUser: CurrentUser | null;
  role: UserRole | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loginAs: (role: UserRole, customUser?: CurrentUser) => void;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<UserRole>;
  loginWithEmailPassword: (identifier: string, password: string) => Promise<UserRole>;
  logout: () => void;
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState['type']) => void;

  // Real Database status
  isFirestoreConnected: boolean;
  isDatabaseLoading: boolean;
  databaseError: string | null;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  refreshDatabase: () => Promise<void>;

  // Data states & actions (real Firestore integration)
  patients: PatientUser[];
  updatePatientProfile: (updated: Partial<PatientUser>) => Promise<void>;
  savePatientRegistration: (patient: PatientUser, password?: string) => Promise<PatientUser>;
  saveDoctorRegistration: (doctor: DoctorUser, password?: string) => Promise<DoctorUser>;
  savePharmacyRegistration: (pharmacy: PharmacyUser, password?: string) => Promise<PharmacyUser>;

  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Promise<Prescription>;
  updatePrescription: (id: string, updated: Partial<Prescription>) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;

  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<HealthRecord>;
  deleteHealthRecord: (id: string) => Promise<void>;

  medicalHistory: MedicalHistoryEvent[];
  addMedicalHistoryEvent: (event: Omit<MedicalHistoryEvent, 'id'>) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;

  medicineReminders: MedicineReminder[];
  toggleMedicineTaken: (id: string) => Promise<void>;
  addMedicineReminder: (reminder: Omit<MedicineReminder, 'id'>) => Promise<MedicineReminder>;
  deleteMedicineReminder: (id: string) => Promise<void>;

  labReports: LabReport[];
  addLabReport: (report: Omit<LabReport, 'id'>) => void;

  pharmacyProducts: PharmacyProduct[];
  addPharmacyProduct: (product: Omit<PharmacyProduct, 'id' | 'publishedAt'>) => Promise<PharmacyProduct>;
  updatePharmacyProduct: (id: string, updates: Partial<PharmacyProduct>) => Promise<void>;
  deletePharmacyProduct: (id: string) => Promise<void>;

  vacancies: PharmacyVacancy[];
  applyToVacancy: (vacancyId: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  conversations: Conversation[];
  messages: MessageItem[];
  sendMessage: (conversationId: string, text: string, attachmentName?: string, isAudio?: boolean) => void;

  // Selected patient for doctor view
  selectedDoctorPatientId: string;
  setSelectedDoctorPatientId: (patientId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`thulir_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`thulir_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getStorage('lang', 'en'));
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getStorage('user', null));
  const [role, setRole] = useState<UserRole | null>(() => getStorage('role', null));
  const [toast, setToast] = useState<ToastState | null>(null);

  // Firestore status states
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(isFirebaseConfigured);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isFirebaseConfigured);

  // Entities
  const [patients, setPatients] = useState<PatientUser[]>(() => getStorage('patients', INITIAL_PATIENTS));
  const [doctors, setDoctors] = useState<DoctorUser[]>(() => INITIAL_DOCTORS);
  const [pharmacies, setPharmacies] = useState<PharmacyUser[]>(() => INITIAL_PHARMACIES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => getStorage('prescriptions', INITIAL_PRESCRIPTIONS));
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => getStorage('records', INITIAL_HEALTH_RECORDS));
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryEvent[]>(() => getStorage('history', INITIAL_MEDICAL_HISTORY));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStorage('appointments', INITIAL_APPOINTMENTS));
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>(() => getStorage('reminders', INITIAL_MEDICINE_REMINDERS));
  const [labReports, setLabReports] = useState<LabReport[]>(() => getStorage('labReports', INITIAL_LAB_REPORTS));
  const [pharmacyProducts, setPharmacyProducts] = useState<PharmacyProduct[]>(() => getStorage('products', INITIAL_PHARMACY_PRODUCTS));
  const [vacancies] = useState<PharmacyVacancy[]>(() => getStorage('vacancies', INITIAL_PHARMACY_VACANCIES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStorage('notifications', INITIAL_NOTIFICATIONS));
  const [conversations, setConversations] = useState<Conversation[]>(() => getStorage('conversations', INITIAL_CONVERSATIONS));
  const [messages, setMessages] = useState<MessageItem[]>(() => getStorage('messages', INITIAL_MESSAGES));
  const [selectedDoctorPatientId, setSelectedDoctorPatientId] = useState<string>('TH-P-8921');

  // Local storage synchronization as secondary buffer
  useEffect(() => setStorage('lang', language), [language]);
  useEffect(() => setStorage('user', currentUser), [currentUser]);
  useEffect(() => setStorage('role', role), [role]);
  useEffect(() => setStorage('patients', patients), [patients]);
  useEffect(() => setStorage('prescriptions', prescriptions), [prescriptions]);
  useEffect(() => setStorage('records', healthRecords), [healthRecords]);
  useEffect(() => setStorage('history', medicalHistory), [medicalHistory]);
  useEffect(() => setStorage('appointments', appointments), [appointments]);
  useEffect(() => setStorage('reminders', medicineReminders), [medicineReminders]);
  useEffect(() => setStorage('labReports', labReports), [labReports]);
  useEffect(() => setStorage('products', pharmacyProducts), [pharmacyProducts]);
  useEffect(() => setStorage('notifications', notifications), [notifications]);
  useEffect(() => setStorage('conversations', conversations), [conversations]);
  useEffect(() => setStorage('messages', messages), [messages]);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /**
   * Refreshes all collections from Firestore.
   */
  const refreshDatabase = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setIsFirestoreConnected(false);
      setIsDemoMode(true);
      setIsDatabaseLoading(false);
      setDatabaseError(null);
      return;
    }

    setIsDatabaseLoading(true);
    setDatabaseError(null);
    try {
      const [
        remotePatients,
        remoteDoctors,
        remotePharmacies,
        remoteRx,
        remoteApts,
        remoteRecords,
        remoteReminders,
        remoteProducts,
      ] = await Promise.all([
        fetchPatientsFromFirestore().catch(() => null),
        fetchDoctorsFromFirestore().catch(() => null),
        fetchPharmaciesFromFirestore().catch(() => null),
        fetchPrescriptionsFromFirestore().catch(() => null),
        fetchAppointmentsFromFirestore().catch(() => null),
        fetchHealthRecordsFromFirestore().catch(() => null),
        fetchMedicineRemindersFromFirestore().catch(() => null),
        fetchPharmacyProductsFromFirestore().catch(() => null),
      ]);

      if (remotePatients && remotePatients.length > 0) setPatients(remotePatients);
      if (remoteDoctors && remoteDoctors.length > 0) setDoctors(remoteDoctors);
      if (remotePharmacies && remotePharmacies.length > 0) setPharmacies(remotePharmacies);
      if (remoteRx && remoteRx.length > 0) setPrescriptions(remoteRx);
      if (remoteApts && remoteApts.length > 0) setAppointments(remoteApts);
      if (remoteRecords && remoteRecords.length > 0) setHealthRecords(remoteRecords);
      if (remoteReminders && remoteReminders.length > 0) setMedicineReminders(remoteReminders);
      if (remoteProducts && remoteProducts.length > 0) setPharmacyProducts(remoteProducts);

      setIsFirestoreConnected(true);
      setIsDemoMode(false);
    } catch (err: any) {
      console.error('Failed to refresh from Firestore:', err);
      setIsFirestoreConnected(false);
      setIsDemoMode(true);
      setDatabaseError(err?.message || 'Database refresh failed');
      showToast('Could not reach Firestore database. Using local storage.', 'warning');
    } finally {
      setIsDatabaseLoading(false);
    }
  }, []);

  // Initialize and load real Firestore database on boot (or fall back cleanly to local storage)
  useEffect(() => {
    let isMounted = true;
    async function bootFirestore() {
      if (!isFirebaseConfigured) {
        if (isMounted) {
          setIsFirestoreConnected(false);
          setIsDemoMode(true);
          setIsDatabaseLoading(false);
          setDatabaseError(null);
        }
        return;
      }

      setIsDatabaseLoading(true);
      try {
        // Step 1: Test connection
        const connected = await testConnection();
        if (!connected) {
          if (isMounted) {
            setIsFirestoreConnected(false);
            setIsDemoMode(true);
            setIsDatabaseLoading(false);
          }
          return;
        }
        if (isMounted) {
          setIsFirestoreConnected(true);
          setIsDemoMode(false);
        }

        // Step 2: Seed baseline records if Firestore is completely empty
        await seedInitialFirestoreDataIfEmpty();

        // Step 3: Fetch real records from Firestore
        if (isMounted) {
          await refreshDatabase();
        }
      } catch (err: any) {
        console.error('Firestore initialization error:', err);
        if (isMounted) {
          setIsFirestoreConnected(false);
          setIsDemoMode(true);
          setDatabaseError(err?.message || 'Firestore connection could not be established');
          setIsDatabaseLoading(false);
        }
      }
    }

    bootFirestore();
    return () => {
      isMounted = false;
    };
  }, [refreshDatabase]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const loginAs = (targetRole: UserRole, customUser?: CurrentUser) => {
    let userToSet: CurrentUser;
    if (customUser) {
      userToSet = customUser;
    } else if (targetRole === 'patient') {
      userToSet = patients[0] || INITIAL_PATIENTS[0];
    } else if (targetRole === 'doctor') {
      userToSet = doctors[0] || INITIAL_DOCTORS[0];
    } else {
      userToSet = pharmacies[0] || INITIAL_PHARMACIES[0];
    }
    setCurrentUser(userToSet);
    setRole(targetRole);
    showToast(
      `Logged in as ${userToSet.role.toUpperCase()}: ${
        'fullName' in userToSet ? userToSet.fullName : (userToSet as PharmacyUser).pharmacyName
      }`
    );
  };

  const findExistingUserByEmail = (email: string): CurrentUser | null => {
    const normalized = email.trim().toLowerCase();
    const matchedPatient = patients.find((p) => p.email?.toLowerCase() === normalized);
    if (matchedPatient) return matchedPatient;
    const matchedDoctor = doctors.find((d) => d.email?.toLowerCase() === normalized);
    if (matchedDoctor) return matchedDoctor;
    const matchedPharmacy = pharmacies.find((ph) => ph.email?.toLowerCase() === normalized);
    if (matchedPharmacy) return matchedPharmacy;
    return null;
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'patient'): Promise<UserRole> => {
    const fbUser = await signInWithGoogle();
    const email = fbUser?.email || '';
    const existing = email ? findExistingUserByEmail(email) : null;
    if (existing) {
      loginAs(existing.role, existing);
      return existing.role;
    }

    if (preferredRole === 'doctor') {
      const base = doctors[0] || INITIAL_DOCTORS[0];
      const user: DoctorUser = {
        ...base,
        id: fbUser?.uid || base.id,
        fullName: fbUser?.displayName || base.fullName,
        email: email || base.email,
      };
      loginAs('doctor', user);
      return 'doctor';
    }

    if (preferredRole === 'pharmacy') {
      const base = pharmacies[0] || INITIAL_PHARMACIES[0];
      const user: PharmacyUser = {
        ...base,
        id: fbUser?.uid || base.id,
        pharmacyName: fbUser?.displayName || base.pharmacyName,
        email: email || base.email,
      };
      loginAs('pharmacy', user);
      return 'pharmacy';
    }

    const base = patients[0] || INITIAL_PATIENTS[0];
    const user: PatientUser = {
      ...base,
      id: fbUser?.uid || base.id,
      fullName: fbUser?.displayName || base.fullName,
      email: email || base.email,
    };
    loginAs('patient', user);
    return 'patient';
  };

  const loginWithEmailPassword = async (identifier: string, password: string): Promise<UserRole> => {
    const trimmed = identifier.trim();
    const isEmail = trimmed.includes('@');

    // If Firebase Auth is configured and user entered an email, authenticate via Firebase first
    if (isFirebaseConfigured && isEmail) {
      try {
        const fbUser = await signInWithEmail(trimmed, password);
        const existing = findExistingUserByEmail(fbUser.email || trimmed);
        if (existing) {
          loginAs(existing.role, existing);
          return existing.role;
        }
        const base = patients[0] || INITIAL_PATIENTS[0];
        const fallbackPatient: PatientUser = {
          ...base,
          id: fbUser.uid,
          email: fbUser.email || trimmed,
          fullName: fbUser.displayName || trimmed.split('@')[0],
        };
        loginAs('patient', fallbackPatient);
        return 'patient';
      } catch (err: any) {
        // Re-throw real auth credential errors when user attempted email login
        const code = err?.code || '';
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/user-not-found' ||
          code === 'auth/too-many-requests' ||
          code === 'auth/invalid-email'
        ) {
          throw err;
        }
        console.warn('Firebase email sign-in notice, falling back to profile match:', err);
      }
    }

    // Match registered profile by email or username, or demo role keywords
    const existing = findExistingUserByEmail(trimmed);
    if (existing) {
      loginAs(existing.role, existing);
      return existing.role;
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes('doc') || lower.includes('arvind')) {
      loginAs('doctor');
      return 'doctor';
    }
    if (lower.includes('pharm') || lower.includes('apollo')) {
      loginAs('pharmacy');
      return 'pharmacy';
    }
    loginAs('patient');
    return 'patient';
  };

  const logout = () => {
    signOutFirebaseUser().catch(() => {});
    setCurrentUser(null);
    setRole(null);
    showToast('Logged out successfully', 'info');
  };

  // ==========================================
  // FIRESTORE / LOCAL STORAGE WRITE OPERATIONS
  // ==========================================

  const updatePatientProfile = async (updated: Partial<PatientUser>) => {
    if (!currentUser || currentUser.role !== 'patient') return;
    const targetPatientId = (currentUser as PatientUser).patientId;
    const updatedUser = { ...currentUser, ...updated } as PatientUser;

    try {
      if (isFirestoreConnected) {
        await updatePatientInFirestore(targetPatientId, updated);
      }
      setCurrentUser(updatedUser);
      setPatients((prev) => prev.map((p) => (p.patientId === targetPatientId ? updatedUser : p)));
      showToast(isFirestoreConnected ? 'Profile updated and saved to Firestore!' : 'Profile updated and saved locally!');
    } catch (err: any) {
      console.error('Failed to update patient profile in Firestore:', err);
      showToast('Failed to update profile in database. Please retry.', 'error');
      throw err;
    }
  };

  const savePatientRegistration = async (
    newPatient: PatientUser,
    password?: string
  ): Promise<PatientUser> => {
    try {
      if (isFirebaseConfigured && newPatient.email && password && password.length >= 6) {
        try {
          await signUpWithEmail(newPatient.email, password);
        } catch (authErr: any) {
          if (authErr?.code !== 'auth/email-already-in-use') {
            console.warn('Firebase Auth registration notice:', authErr?.code || authErr);
          }
        }
      }
      const saved = isFirestoreConnected
        ? await savePatientToFirestore(newPatient)
        : { ...newPatient, id: newPatient.patientId || newPatient.id };
      setPatients((prev) => [saved, ...prev.filter((p) => p.patientId !== saved.patientId)]);
      loginAs('patient', saved);
      showToast(
        isFirestoreConnected
          ? 'Patient account registered & saved to Firestore!'
          : 'Patient account registered & saved locally!'
      );
      return saved;
    } catch (err: any) {
      console.error('Failed to register patient in Firestore:', err);
      showToast('Database error: Unable to save registration. Please retry.', 'error');
      throw err;
    }
  };

  const saveDoctorRegistration = async (
    newDoctor: DoctorUser,
    password?: string
  ): Promise<DoctorUser> => {
    try {
      if (isFirebaseConfigured && newDoctor.email && password && password.length >= 6) {
        try {
          await signUpWithEmail(newDoctor.email, password);
        } catch (authErr: any) {
          if (authErr?.code !== 'auth/email-already-in-use') {
            console.warn('Firebase Auth registration notice:', authErr?.code || authErr);
          }
        }
      }
      const saved = isFirestoreConnected
        ? await saveDoctorToFirestore(newDoctor)
        : { ...newDoctor, id: newDoctor.doctorId || newDoctor.id };
      setDoctors((prev) => [saved, ...prev.filter((d) => d.doctorId !== saved.doctorId)]);
      loginAs('doctor', saved);
      showToast(
        isFirestoreConnected
          ? 'Doctor credentials registered & saved to Firestore!'
          : 'Doctor credentials registered & saved locally!'
      );
      return saved;
    } catch (err: any) {
      console.error('Failed to register doctor in Firestore:', err);
      showToast('Database error: Unable to save registration. Please retry.', 'error');
      throw err;
    }
  };

  const savePharmacyRegistration = async (
    newPharmacy: PharmacyUser,
    password?: string
  ): Promise<PharmacyUser> => {
    try {
      if (isFirebaseConfigured && newPharmacy.email && password && password.length >= 6) {
        try {
          await signUpWithEmail(newPharmacy.email, password);
        } catch (authErr: any) {
          if (authErr?.code !== 'auth/email-already-in-use') {
            console.warn('Firebase Auth registration notice:', authErr?.code || authErr);
          }
        }
      }
      const saved = isFirestoreConnected
        ? await savePharmacyToFirestore(newPharmacy)
        : { ...newPharmacy, id: newPharmacy.pharmacyId || newPharmacy.id };
      setPharmacies((prev) => [saved, ...prev.filter((ph) => ph.pharmacyId !== saved.pharmacyId)]);
      loginAs('pharmacy', saved);
      showToast(
        isFirestoreConnected
          ? 'Pharmacy license registered & saved to Firestore!'
          : 'Pharmacy license registered & saved locally!'
      );
      return saved;
    } catch (err: any) {
      console.error('Failed to register pharmacy in Firestore:', err);
      showToast('Database error: Unable to save registration. Please retry.', 'error');
      throw err;
    }
  };

  const addPrescription = async (newRxData: Omit<Prescription, 'id'>): Promise<Prescription> => {
    try {
      const savedPrescription: Prescription = isFirestoreConnected
        ? await createPrescriptionInFirestore(newRxData)
        : { ...newRxData, id: `rx-${Date.now()}` };

      const recordTitle = `${newRxData.diagnosis || 'Clinical Prescription'} (${newRxData.doctorName})`;
      const medsSummary = newRxData.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ');
      const recordPayload: Omit<HealthRecord, 'id'> = {
        patientId: newRxData.patientId,
        title: recordTitle,
        recordType: 'Prescription',
        date: newRxData.date,
        doctor: newRxData.doctorName,
        hospital: newRxData.hospitalClinic || 'THULIR Digital Care Network',
        description: `Prescribed medicines: ${medsSummary}. ${newRxData.notes || ''}`,
        status: 'Verified',
        fileName: `Prescription_${newRxData.date}.pdf`,
        tags: ['Prescription', newRxData.source],
      };
      const savedRecord: HealthRecord = isFirestoreConnected
        ? await createHealthRecordInFirestore(recordPayload)
        : { ...recordPayload, id: `rec-${Date.now()}` };

      setPrescriptions((prev) => [savedPrescription, ...prev]);
      setHealthRecords((prev) => [savedRecord, ...prev]);

      // Timeline event
      const newHist: MedicalHistoryEvent = {
        id: `hist-${Date.now()}`,
        patientId: newRxData.patientId,
        date: newRxData.date,
        eventType: newRxData.source === 'Camera Scan' ? 'Prescription Scan' : 'Doctor Prescription',
        title: `${newRxData.source === 'Camera Scan' ? 'Prescription Scanned' : 'New Doctor Prescription'}: ${newRxData.diagnosis || 'Medicines Issued'}`,
        doctorOrSource: newRxData.doctorName,
        details: `Prescribed: ${medsSummary}. Source: ${newRxData.source}.`,
        badgeColor: newRxData.source === 'Camera Scan' ? 'purple' : 'emerald',
      };
      setMedicalHistory((prev) => [newHist, ...prev]);

      // Add Notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        targetRole: 'patient',
        targetUserId: newRxData.patientId,
        title: 'New Prescription Added',
        message: `${newRxData.doctorName} prescribed ${newRxData.medicines.length} medicine(s).`,
        timestamp: 'Just now',
        type: 'prescription',
        isRead: false,
        link: '/patient/prescriptions',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      showToast(
        isFirestoreConnected
          ? 'Prescription saved to Firestore and linked with patient records!'
          : 'Prescription saved and linked with patient records!'
      );
      return savedPrescription;
    } catch (err: any) {
      console.error('Failed to create prescription in Firestore:', err);
      showToast('Failed to save prescription to database. Please retry.', 'error');
      throw err;
    }
  };

  const updatePrescription = async (id: string, updated: Partial<Prescription>) => {
    try {
      if (isFirestoreConnected) {
        await updatePrescriptionInFirestore(id, updated);
      }
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      showToast(isFirestoreConnected ? 'Prescription updated in Firestore' : 'Prescription updated');
    } catch (err: any) {
      console.error('Failed to update prescription in Firestore:', err);
      showToast('Failed to update prescription in database', 'error');
      throw err;
    }
  };

  const deletePrescription = async (id: string) => {
    try {
      if (isFirestoreConnected) {
        await deletePrescriptionFromFirestore(id);
      }
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      showToast(isFirestoreConnected ? 'Prescription deleted from Firestore' : 'Prescription deleted', 'info');
    } catch (err: any) {
      console.error('Failed to delete prescription from Firestore:', err);
      showToast('Failed to delete prescription from database', 'error');
      throw err;
    }
  };

  const addHealthRecord = async (recordData: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
    try {
      const savedRecord: HealthRecord = isFirestoreConnected
        ? await createHealthRecordInFirestore(recordData)
        : { ...recordData, id: `rec-${Date.now()}` };
      setHealthRecords((prev) => [savedRecord, ...prev]);

      const newHist: MedicalHistoryEvent = {
        id: `hist-${Date.now()}`,
        patientId: recordData.patientId,
        date: recordData.date,
        eventType: recordData.recordType === 'Lab Report' ? 'Lab Report' : 'Doctor Visit',
        title: recordData.title,
        doctorOrSource: recordData.doctor,
        details: recordData.description,
        badgeColor: recordData.recordType === 'Lab Report' ? 'blue' : 'teal',
      };
      setMedicalHistory((prev) => [newHist, ...prev]);

      showToast(
        isFirestoreConnected
          ? 'Health record uploaded and saved to Firestore'
          : 'Health record uploaded and saved'
      );
      return savedRecord;
    } catch (err: any) {
      console.error('Failed to add health record in Firestore:', err);
      showToast('Failed to save health record to database', 'error');
      throw err;
    }
  };

  const deleteHealthRecord = async (id: string) => {
    try {
      if (isFirestoreConnected) {
        await deleteHealthRecordFromFirestore(id);
      }
      setHealthRecords((prev) => prev.filter((r) => r.id !== id));
      showToast(isFirestoreConnected ? 'Record deleted from Firestore' : 'Record deleted', 'info');
    } catch (err: any) {
      console.error('Failed to delete health record:', err);
      showToast('Failed to delete record from database', 'error');
      throw err;
    }
  };

  const addMedicalHistoryEvent = (eventData: Omit<MedicalHistoryEvent, 'id'>) => {
    const newHist: MedicalHistoryEvent = { ...eventData, id: `hist-${Date.now()}` };
    setMedicalHistory((prev) => [newHist, ...prev]);
  };

  const addAppointment = async (aptData: Omit<Appointment, 'id'>): Promise<Appointment> => {
    try {
      const savedApt: Appointment = isFirestoreConnected
        ? await createAppointmentInFirestore(aptData)
        : { ...aptData, id: `apt-${Date.now()}` };
      setAppointments((prev) => [savedApt, ...prev]);

      // Notifications
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-p`,
          targetRole: 'patient',
          targetUserId: aptData.patientId,
          title: 'Appointment Scheduled',
          message: `Confirmed with ${aptData.doctorName} on ${aptData.date} at ${aptData.time}.`,
          timestamp: 'Just now',
          type: 'appointment',
          isRead: false,
          link: '/patient/appointments',
        },
        ...prev,
      ]);

      showToast(
        isFirestoreConnected ? 'Appointment booked and saved to Firestore!' : 'Appointment booked successfully!'
      );
      return savedApt;
    } catch (err: any) {
      console.error('Failed to save appointment to Firestore:', err);
      showToast('Failed to save appointment to database', 'error');
      throw err;
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      if (isFirestoreConnected) {
        await updateAppointmentInFirestore(id, { status });
      }
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast(
        isFirestoreConnected
          ? `Appointment status updated to ${status} in Firestore`
          : `Appointment status updated to ${status}`
      );
    } catch (err: any) {
      console.error('Failed to update appointment in Firestore:', err);
      showToast('Failed to update appointment status in database', 'error');
      throw err;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      if (isFirestoreConnected) {
        await updateAppointmentInFirestore(id, { status: 'Cancelled' });
      }
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a)));
      showToast(
        isFirestoreConnected ? 'Appointment cancelled in Firestore' : 'Appointment cancelled',
        'warning'
      );
    } catch (err: any) {
      console.error('Failed to cancel appointment in Firestore:', err);
      showToast('Failed to cancel appointment in database', 'error');
      throw err;
    }
  };

  const toggleMedicineTaken = async (id: string) => {
    const target = medicineReminders.find((r) => r.id === id);
    if (!target) return;
    const nextState = !target.takenToday;
    const takenAt = nextState
      ? `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : '';

    try {
      if (isFirestoreConnected) {
        await updateMedicineReminderInFirestore(id, { takenToday: nextState, takenAt });
      }
      setMedicineReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, takenToday: nextState, takenAt } : r))
      );
      showToast(isFirestoreConnected ? 'Medicine status updated in Firestore' : 'Medicine status updated');
    } catch (err: any) {
      console.error('Failed to update reminder in Firestore:', err);
      showToast('Failed to update reminder in database', 'error');
    }
  };

  const addMedicineReminder = async (
    reminderData: Omit<MedicineReminder, 'id'>
  ): Promise<MedicineReminder> => {
    try {
      const savedRem: MedicineReminder = isFirestoreConnected
        ? await createMedicineReminderInFirestore(reminderData)
        : { ...reminderData, id: `rem-${Date.now()}` };
      setMedicineReminders((prev) => [savedRem, ...prev]);
      showToast(
        isFirestoreConnected
          ? 'Medicine reminder created and saved to Firestore!'
          : 'Medicine reminder created!'
      );
      return savedRem;
    } catch (err: any) {
      console.error('Failed to create reminder in Firestore:', err);
      showToast('Failed to save reminder to database', 'error');
      throw err;
    }
  };

  const deleteMedicineReminder = async (id: string) => {
    try {
      if (isFirestoreConnected) {
        await deleteMedicineReminderFromFirestore(id);
      }
      setMedicineReminders((prev) => prev.filter((r) => r.id !== id));
      showToast(isFirestoreConnected ? 'Reminder deleted from Firestore' : 'Reminder deleted', 'info');
    } catch (err: any) {
      console.error('Failed to delete reminder in Firestore:', err);
      showToast('Failed to delete reminder from database', 'error');
    }
  };

  const addLabReport = (reportData: Omit<LabReport, 'id'>) => {
    const newReport: LabReport = { ...reportData, id: `lab-${Date.now()}` };
    setLabReports((prev) => [newReport, ...prev]);

    // Also add to health records
    addHealthRecord({
      patientId: reportData.patientId,
      title: `${reportData.testName} Report`,
      recordType: 'Lab Report',
      date: reportData.date,
      doctor: reportData.doctorNotes ? 'Consulting Pathologist' : 'Diagnostic Centre',
      hospital: reportData.labName,
      description: `Result: ${reportData.result}. Reference Range: ${reportData.referenceRange}`,
      status: 'Verified',
      fileName: `${reportData.testName.replace(/\s+/g, '_')}_Report.pdf`,
      tags: ['Lab Report', reportData.status],
    });
  };

  const addPharmacyProduct = async (
    productData: Omit<PharmacyProduct, 'id' | 'publishedAt'>
  ): Promise<PharmacyProduct> => {
    try {
      const savedProduct: PharmacyProduct = isFirestoreConnected
        ? await createPharmacyProductInFirestore(productData)
        : {
            ...productData,
            id: `prod-${Date.now()}`,
            publishedAt: new Date().toISOString().split('T')[0],
          };
      setPharmacyProducts((prev) => [savedProduct, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-ph`,
          targetRole: 'pharmacy',
          title: 'Product Published to Marketplace',
          message: `${savedProduct.productName} is now live in the Marketplace.`,
          timestamp: 'Just now',
          type: 'stock',
          isRead: false,
          link: '/pharmacy/my-posts',
        },
        ...prev,
      ]);

      showToast(
        isFirestoreConnected
          ? 'Product published and permanently saved to Firestore Marketplace!'
          : 'Product published to Marketplace!'
      );
      return savedProduct;
    } catch (err: any) {
      console.error('Failed to add product to Firestore:', err);
      showToast('Database error: Unable to publish product to Firestore.', 'error');
      throw err;
    }
  };

  const updatePharmacyProduct = async (id: string, updates: Partial<PharmacyProduct>) => {
    try {
      if (isFirestoreConnected) {
        await updatePharmacyProductInFirestore(id, updates);
      }
      setPharmacyProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      showToast(isFirestoreConnected ? 'Product updated in Firestore' : 'Product updated');
    } catch (err: any) {
      console.error('Failed to update product in Firestore:', err);
      showToast('Failed to update product in database', 'error');
      throw err;
    }
  };

  const deletePharmacyProduct = async (id: string) => {
    try {
      if (isFirestoreConnected) {
        await deletePharmacyProductFromFirestore(id);
      }
      setPharmacyProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(isFirestoreConnected ? 'Product deleted from Firestore' : 'Product deleted', 'info');
    } catch (err: any) {
      console.error('Failed to delete product from Firestore:', err);
      showToast('Failed to delete product from database', 'error');
      throw err;
    }
  };

  const applyToVacancy = (vacancyId: string) => {
    const vac = vacancies.find((v) => v.id === vacancyId);
    showToast(`Application submitted successfully for ${vac?.position || 'role'}! The pharmacy recruiter will reach out.`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const sendMessage = (conversationId: string, text: string, attachmentName?: string, isAudio?: boolean) => {
    if (!currentUser) return;
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: 'fullName' in currentUser ? currentUser.fullName : (currentUser as PharmacyUser).pharmacyName,
      senderRole: currentUser.role,
      text,
      timestamp: 'Just now',
      attachmentName,
      isAudio,
    };
    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: isAudio ? 'Voice message' : attachmentName ? `Attachment: ${attachmentName}` : text,
              lastMessageTime: 'Just now',
            }
          : c
      )
    );

    setTimeout(() => {
      const autoReplyText =
        currentUser.role === 'patient'
          ? 'Thank you for reaching out. Your request has been acknowledged. Our care coordinator is monitoring this channel.'
          : 'Understood. We have logged this update in THULIR health logs.';

      const replyMsg: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        conversationId,
        senderId: 'sys-reply',
        senderName: 'Care Coordinator',
        senderRole: currentUser.role === 'patient' ? 'doctor' : 'pharmacy',
        text: autoReplyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, replyMsg]);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: autoReplyText, lastMessageTime: 'Just now' } : c))
      );
    }, 1500);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        language,
        setLanguage,
        t,
        loginAs,
        loginWithGoogle,
        loginWithEmailPassword,
        logout,
        toast,
        showToast,
        isFirestoreConnected,
        isDatabaseLoading,
        databaseError,
        isDemoMode,
        setIsDemoMode,
        refreshDatabase,
        patients,
        updatePatientProfile,
        savePatientRegistration,
        saveDoctorRegistration,
        savePharmacyRegistration,
        prescriptions,
        addPrescription,
        updatePrescription,
        deletePrescription,
        healthRecords,
        addHealthRecord,
        deleteHealthRecord,
        medicalHistory,
        addMedicalHistoryEvent,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        medicineReminders,
        toggleMedicineTaken,
        addMedicineReminder,
        deleteMedicineReminder,
        labReports,
        addLabReport,
        pharmacyProducts,
        addPharmacyProduct,
        updatePharmacyProduct,
        deletePharmacyProduct,
        vacancies,
        applyToVacancy,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        conversations,
        messages,
        sendMessage,
        selectedDoctorPatientId,
        setSelectedDoctorPatientId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
