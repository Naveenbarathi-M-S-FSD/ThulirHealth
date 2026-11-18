export type UserRole = 'patient' | 'doctor' | 'pharmacy';

export type Language = 'en' | 'ta' | 'hi';

export interface BaseUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export interface PatientUser extends BaseUser {
  role: 'patient';
  patientId: string; // e.g. TH-P-8921
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  bloodGroup: string;
  location: string;
  allergies: string[];
  existingConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  overallHealthStatus: 'Optimal' | 'Stable' | 'Needs Attention';
}

export interface DoctorUser extends BaseUser {
  role: 'doctor';
  doctorId: string; // e.g. TH-D-4012
  fullName: string;
  gender: string;
  age: number;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  yearsOfExperience: number;
  hospitalName: string;
  hospitalType: 'Government' | 'Private Super-Specialty' | 'Clinic';
  location: string;
  rating: number;
  isVerified: boolean;
  documents: {
    name: string;
    status: 'Demo Verified' | 'Uploaded' | 'Under Review';
    uploadedAt: string;
  }[];
}

export interface PharmacyUser extends BaseUser {
  role: 'pharmacy';
  pharmacyId: string; // e.g. TH-PH-1098
  pharmacyName: string;
  ownerName: string;
  location: string;
  address: string;
  pharmacyType: 'Retail' | 'Hospital Attached' | 'Wholesale' | '24/7 Chemist';
  registrationNumber: string;
  gstNumber: string;
  isVerified: boolean;
  documents: {
    name: string;
    status: 'Demo Verified' | 'Uploaded' | 'Under Review';
    uploadedAt: string;
  }[];
}

export type CurrentUser = PatientUser | DoctorUser | PharmacyUser;

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string; // e.g. 500mg
  frequency: string; // e.g. 1-0-1 (After Food)
  duration: string; // e.g. 5 Days
  instructions: string; // e.g. Take with warm water after dinner
  timing?: 'Morning' | 'Afternoon' | 'Night' | 'Morning & Night';
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorId?: string;
  hospitalClinic: string;
  date: string;
  medicines: MedicineItem[];
  diagnosis: string;
  status: 'Active' | 'Completed' | 'Previous';
  source: 'Doctor Prescribed' | 'Camera Scan' | 'Uploaded Document';
  notes?: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  title: string;
  recordType: 'Prescription' | 'Lab Report' | 'Medical Document' | 'Vaccination' | 'Discharge Summary';
  date: string;
  doctor: string;
  hospital: string;
  description: string;
  status: 'Verified' | 'Pending Review' | 'Archived';
  fileUrl?: string;
  fileName?: string;
  tags?: string[];
}

export interface MedicalHistoryEvent {
  id: string;
  patientId: string;
  date: string;
  eventType: 'Doctor Visit' | 'Prescription Scan' | 'Doctor Prescription' | 'Lab Report' | 'Health Issue' | 'Medicine Update';
  title: string;
  doctorOrSource: string;
  details: string;
  badgeColor?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'In Consultation';
  notes?: string;
}

export interface MedicineReminder {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  time: string; // e.g. "08:30 AM"
  frequency: string; // e.g. "Daily"
  duration: string;
  takenToday: boolean;
  takenAt?: string;
  nextScheduled: string;
}

export interface ImportantHealthIssue {
  id: string;
  patientId: string;
  issueName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Normal';
  dateIdentified: string;
  currentStatus: 'Active' | 'Under Observation' | 'Controlled' | 'Resolved';
  doctor: string;
  followUpDate: string;
  notes: string;
}

export interface InsuranceScheme {
  id: string;
  schemeName: string;
  policyName: string;
  policyNumber: string;
  coverage: string; // e.g. "₹5,00,000 / Year"
  validity: string;
  status: 'Active' | 'Expiring Soon' | 'Pending Renewal';
  benefits: string[];
  provider: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  date: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Elevated' | 'Needs Attention' | 'Pending';
  doctorNotes?: string;
  labName: string;
}

export interface PharmacyProduct {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  productName: string;
  companyName: string;
  category: string;
  mfgDate: string;
  expiryDate: string;
  contactNumber: string;
  email: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  availableQuantity: number;
  location: string;
  description: string;
  imageUrl: string;
  stockStatus: 'Available' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
  isOffer: boolean;
  publishedAt: string;
}

export interface PharmacyVacancy {
  id: string;
  pharmacyName: string;
  position: string;
  location: string;
  experienceRequired: string;
  salaryRange: string;
  contactDetails: {
    phone: string;
    email: string;
  };
  jobDescription: string;
  timing: string;
  postedDate: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachmentName?: string;
  isAudio?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [id: string]: string };
  participantRoles: { [id: string]: UserRole };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'reminder' | 'prescription' | 'record' | 'stock' | 'offer' | 'message';
  isRead: boolean;
  link?: string;
}
