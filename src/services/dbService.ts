import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import {
  db,
  auth,
  isFirebaseConfigured,
  ensureAuth,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  PatientUser,
  DoctorUser,
  PharmacyUser,
  Prescription,
  Appointment,
  HealthRecord,
  MedicineReminder,
  PharmacyProduct,
  NotificationItem,
  MedicalHistoryEvent,
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
  INITIAL_PHARMACY_PRODUCTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  PHARMACIES: 'pharmacies',
  PRESCRIPTIONS: 'prescriptions',
  APPOINTMENTS: 'appointments',
  HEALTH_RECORDS: 'healthRecords',
  MEDICINE_REMINDERS: 'medicineReminders',
  PHARMACY_PRODUCTS: 'pharmacyProducts',
  NOTIFICATIONS: 'notifications',
  MEDICAL_HISTORY: 'medicalHistory',
};

function requireDb(): Firestore {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }
  return db;
}

// ==========================================
// 1. PATIENT OPERATIONS
// ==========================================

export async function fetchPatientsFromFirestore(): Promise<PatientUser[]> {
  const path = COLLECTIONS.PATIENTS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const patients: PatientUser[] = [];
    querySnapshot.forEach((docSnap) => {
      patients.push({ ...docSnap.data(), id: docSnap.id } as PatientUser);
    });
    return patients;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function savePatientToFirestore(patient: PatientUser): Promise<PatientUser> {
  const path = COLLECTIONS.PATIENTS;
  try {
    await ensureAuth();
    const docId = patient.patientId || patient.id;
    const docRef = doc(requireDb(), path, docId);
    const dataToSave = {
      ...patient,
      id: docId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave as PatientUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${patient.patientId}`);
  }
}

export async function updatePatientInFirestore(
  patientId: string,
  updates: Partial<PatientUser>
): Promise<void> {
  const path = COLLECTIONS.PATIENTS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, patientId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${patientId}`);
  }
}

// ==========================================
// 2. DOCTOR OPERATIONS
// ==========================================

export async function fetchDoctorsFromFirestore(): Promise<DoctorUser[]> {
  const path = COLLECTIONS.DOCTORS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const doctors: DoctorUser[] = [];
    querySnapshot.forEach((docSnap) => {
      doctors.push({ ...docSnap.data(), id: docSnap.id } as DoctorUser);
    });
    return doctors;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveDoctorToFirestore(doctor: DoctorUser): Promise<DoctorUser> {
  const path = COLLECTIONS.DOCTORS;
  try {
    await ensureAuth();
    const docId = doctor.doctorId || doctor.id;
    const docRef = doc(requireDb(), path, docId);
    const dataToSave = {
      ...doctor,
      id: docId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave as DoctorUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${doctor.doctorId}`);
  }
}

// ==========================================
// 3. PHARMACY OPERATIONS
// ==========================================

export async function fetchPharmaciesFromFirestore(): Promise<PharmacyUser[]> {
  const path = COLLECTIONS.PHARMACIES;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const pharmacies: PharmacyUser[] = [];
    querySnapshot.forEach((docSnap) => {
      pharmacies.push({ ...docSnap.data(), id: docSnap.id } as PharmacyUser);
    });
    return pharmacies;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function savePharmacyToFirestore(pharmacy: PharmacyUser): Promise<PharmacyUser> {
  const path = COLLECTIONS.PHARMACIES;
  try {
    await ensureAuth();
    const docId = pharmacy.pharmacyId || pharmacy.id;
    const docRef = doc(requireDb(), path, docId);
    const dataToSave = {
      ...pharmacy,
      id: docId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave as PharmacyUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${pharmacy.pharmacyId}`);
  }
}

// ==========================================
// 4. PRESCRIPTION OPERATIONS
// ==========================================

export async function fetchPrescriptionsFromFirestore(): Promise<Prescription[]> {
  const path = COLLECTIONS.PRESCRIPTIONS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const prescriptions: Prescription[] = [];
    querySnapshot.forEach((docSnap) => {
      prescriptions.push({ ...docSnap.data(), id: docSnap.id } as Prescription);
    });
    return prescriptions;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createPrescriptionInFirestore(
  prescription: Omit<Prescription, 'id'> & { id?: string }
): Promise<Prescription> {
  const path = COLLECTIONS.PRESCRIPTIONS;
  try {
    await ensureAuth();
    const newId = prescription.id || `rx-${Date.now()}`;
    const docRef = doc(requireDb(), path, newId);
    const dataToSave: Prescription = {
      ...prescription,
      id: newId,
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePrescriptionInFirestore(
  id: string,
  updates: Partial<Prescription>
): Promise<void> {
  const path = COLLECTIONS.PRESCRIPTIONS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function deletePrescriptionFromFirestore(id: string): Promise<void> {
  const path = COLLECTIONS.PRESCRIPTIONS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// ==========================================
// 5. APPOINTMENT OPERATIONS
// ==========================================

export async function fetchAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = COLLECTIONS.APPOINTMENTS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const appointments: Appointment[] = [];
    querySnapshot.forEach((docSnap) => {
      appointments.push({ ...docSnap.data(), id: docSnap.id } as Appointment);
    });
    return appointments;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createAppointmentInFirestore(
  appointment: Omit<Appointment, 'id'> & { id?: string }
): Promise<Appointment> {
  const path = COLLECTIONS.APPOINTMENTS;
  try {
    await ensureAuth();
    const newId = appointment.id || `apt-${Date.now()}`;
    const docRef = doc(requireDb(), path, newId);
    const dataToSave: Appointment = {
      ...appointment,
      id: newId,
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateAppointmentInFirestore(
  id: string,
  updates: Partial<Appointment>
): Promise<void> {
  const path = COLLECTIONS.APPOINTMENTS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// ==========================================
// 6. HEALTH RECORD OPERATIONS
// ==========================================

export async function fetchHealthRecordsFromFirestore(): Promise<HealthRecord[]> {
  const path = COLLECTIONS.HEALTH_RECORDS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const records: HealthRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({ ...docSnap.data(), id: docSnap.id } as HealthRecord);
    });
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createHealthRecordInFirestore(
  record: Omit<HealthRecord, 'id'> & { id?: string }
): Promise<HealthRecord> {
  const path = COLLECTIONS.HEALTH_RECORDS;
  try {
    await ensureAuth();
    const newId = record.id || `rec-${Date.now()}`;
    const docRef = doc(requireDb(), path, newId);
    const dataToSave: HealthRecord = {
      ...record,
      id: newId,
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteHealthRecordFromFirestore(id: string): Promise<void> {
  const path = COLLECTIONS.HEALTH_RECORDS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// ==========================================
// 7. MEDICINE REMINDERS
// ==========================================

export async function fetchMedicineRemindersFromFirestore(): Promise<MedicineReminder[]> {
  const path = COLLECTIONS.MEDICINE_REMINDERS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const reminders: MedicineReminder[] = [];
    querySnapshot.forEach((docSnap) => {
      reminders.push({ ...docSnap.data(), id: docSnap.id } as MedicineReminder);
    });
    return reminders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createMedicineReminderInFirestore(
  reminder: Omit<MedicineReminder, 'id'> & { id?: string }
): Promise<MedicineReminder> {
  const path = COLLECTIONS.MEDICINE_REMINDERS;
  try {
    await ensureAuth();
    const newId = reminder.id || `rem-${Date.now()}`;
    const docRef = doc(requireDb(), path, newId);
    const dataToSave: MedicineReminder = {
      ...reminder,
      id: newId,
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMedicineReminderInFirestore(
  id: string,
  updates: Partial<MedicineReminder>
): Promise<void> {
  const path = COLLECTIONS.MEDICINE_REMINDERS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function deleteMedicineReminderFromFirestore(id: string): Promise<void> {
  const path = COLLECTIONS.MEDICINE_REMINDERS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// ==========================================
// 8. PHARMACY PRODUCT OPERATIONS
// ==========================================

export async function fetchPharmacyProductsFromFirestore(): Promise<PharmacyProduct[]> {
  const path = COLLECTIONS.PHARMACY_PRODUCTS;
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(requireDb(), path));
    const products: PharmacyProduct[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ ...docSnap.data(), id: docSnap.id } as PharmacyProduct);
    });
    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createPharmacyProductInFirestore(
  product: Omit<PharmacyProduct, 'id' | 'publishedAt'> & { id?: string; publishedAt?: string }
): Promise<PharmacyProduct> {
  const path = COLLECTIONS.PHARMACY_PRODUCTS;
  try {
    await ensureAuth();
    const newId = product.id || `prod-${Date.now()}`;
    const docRef = doc(requireDb(), path, newId);
    const dataToSave: PharmacyProduct = {
      ...product,
      id: newId,
      publishedAt: product.publishedAt || new Date().toISOString().split('T')[0],
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePharmacyProductInFirestore(
  id: string,
  updates: Partial<PharmacyProduct>
): Promise<void> {
  const path = COLLECTIONS.PHARMACY_PRODUCTS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function deletePharmacyProductFromFirestore(id: string): Promise<void> {
  const path = COLLECTIONS.PHARMACY_PRODUCTS;
  try {
    await ensureAuth();
    const docRef = doc(requireDb(), path, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
}

// ==========================================
// 9. INITIAL DATABASE SEEDING
// ==========================================

/**
 * Initializes Firestore with baseline healthcare records if the collections
 * are currently empty. This ensures the user immediately sees a working database
 * while guaranteeing that newly submitted forms persist directly in Firestore.
 */
export async function seedInitialFirestoreDataIfEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    return false;
  }
  try {
    await ensureAuth();
    const patientsSnapshot = await getDocs(collection(requireDb(), COLLECTIONS.PATIENTS));

    // If records already exist in Firestore, do not re-seed
    if (!patientsSnapshot.empty) {
      console.log('Firestore already contains data. Skipping initial seeding.');
      return false;
    }

    console.log('Firestore database is empty. Seeding initial THULIR records...');

    // Seed Patients
    for (const p of INITIAL_PATIENTS) {
      await setDoc(doc(requireDb(), COLLECTIONS.PATIENTS, p.patientId), p);
    }

    // Seed Doctors
    for (const d of INITIAL_DOCTORS) {
      await setDoc(doc(requireDb(), COLLECTIONS.DOCTORS, d.doctorId), d);
    }

    // Seed Pharmacies
    for (const ph of INITIAL_PHARMACIES) {
      await setDoc(doc(requireDb(), COLLECTIONS.PHARMACIES, ph.pharmacyId), ph);
    }

    // Seed Prescriptions
    for (const rx of INITIAL_PRESCRIPTIONS) {
      await setDoc(doc(requireDb(), COLLECTIONS.PRESCRIPTIONS, rx.id), rx);
    }

    // Seed Appointments
    for (const apt of INITIAL_APPOINTMENTS) {
      await setDoc(doc(requireDb(), COLLECTIONS.APPOINTMENTS, apt.id), apt);
    }

    // Seed Health Records
    for (const hr of INITIAL_HEALTH_RECORDS) {
      await setDoc(doc(requireDb(), COLLECTIONS.HEALTH_RECORDS, hr.id), hr);
    }

    // Seed Medicine Reminders
    for (const rem of INITIAL_MEDICINE_REMINDERS) {
      await setDoc(doc(requireDb(), COLLECTIONS.MEDICINE_REMINDERS, rem.id), rem);
    }

    // Seed Pharmacy Products
    for (const prod of INITIAL_PHARMACY_PRODUCTS) {
      await setDoc(doc(requireDb(), COLLECTIONS.PHARMACY_PRODUCTS, prod.id), prod);
    }

    // Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      await setDoc(doc(requireDb(), COLLECTIONS.NOTIFICATIONS, notif.id), notif);
    }

    console.log('Firestore seeding completed successfully.');
    return true;
  } catch (err) {
    console.warn('Initial seeding note (will continue with live database):', err);
    return false;
  }
}
