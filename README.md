# THULIR (துளிர்)
> **Connected Care. Made Simple.**

A unified healthcare ecosystem connecting **Patients**, **Doctors**, and **Pharmacies** into a single, cohesive, interactive digital healthcare platform.

Built as an interactive frontend prototype for healthcare hackathons and jury presentations.

---

## 🌟 The Core Vision

**THULIR** (Tamil for *new sprout / tender leaf*) symbolizes growth, care, trust, and a fresh beginning in healthcare delivery. 

Traditional health apps are siloed:
- Patients keep loose paper prescription slips that get lost.
- Doctors have no instant insight into prior medications or emergency allergies during consultation.
- Pharmacies struggle with manual inventory, stock expirations, and verifying handwritten prescriptions.

**THULIR connects all three stakeholders in real time:**
1. **Patient**: Personal Health Passport, Camera Prescription Scanner (Simulated OCR), Offline-capable Health QR, Medicine Adherence Tracker, AI Health Companion, and Health Summary.
2. **Doctor**: Clinical OPD workstation, Patient Health QR Scanner, Longitudinal Health Chart, Electronic Prescription Builder with instant allergy safety alerts, and AI Clinical Decision Support.
3. **Pharmacy**: Healthcare Marketplace Feed, Instant Product Publishing, Stock & Expiry Availability Radar, Proximity Store Directory, Professional Pharmacist Vacancies, and Direct Inquiries.

---

## 🚀 Key Features

### 1. Patient Ecosystem
- **Smart Camera Prescription Scanner**: Live camera preview with animated scanning line and corner brackets, multi-stage OCR extraction simulation (*"Scanning document..." → "Detecting medicines..." → "Extracting instructions..."*), editable extracted medicines table, and direct automatic cascade into Health Records, Prescriptions, and Medical History!
- **My THULIR Health QR**: Distinctive digital health pass with cryptographic citizen token (`TH-P-8921`), download pass, and share actions.
- **Medicine Reminders & Adherence**: Daily dose tracker with "Mark as Taken" action, completion streak, and timestamps.
- **Interactive AI Health Assistant**: Conversational assistant answering queries on current medications, upcoming visits, health summary, and doctor consultation preparation.
- **Insurance Scheme Comparison**: Demo representation of Universal and Family Floater coverage (Schemes A, B, C, D).

### 2. Doctor Ecosystem
- **OPD Queue & Today's Schedule**: Outpatient consultation blocks and status management.
- **Patient QR Scanner & Search**: Instant lookup of patient allergies, chronic conditions, and previous visits by scanning QR or typing Patient ID.
- **Prescription Builder**: Multi-medicine prescription composer with automated allergy checks (e.g. Penicillin sensitivity detection) that updates shared patient records in real time.
- **AI Clinical Support**: Physician decision aid flagging lab trends, statin maintenance, and drug safety observations.
- **Diagnostic Pathology Hub**: Review of lipid profiles, glycated hemoglobin, and renal function tests.

### 3. Pharmacy Ecosystem
- **B2B & B2C Healthcare Marketplace**: Product catalog with manufacturer details, batch manufacturing/expiry dates, pricing, and discount percentages.
- **Create Product Post**: Instant publishing of medicine lots and diagnostic kits that automatically propagate to marketplace feeds and search results.
- **Inventory Matrix & FIFO Alerts**: Color-coded stock statuses (*Available*, *Low Stock*, *Expiring Soon*).
- **Proximity Store Radar**: Interactive map simulation displaying verified pharmacy locations, distance, and direct phone contact.
- **Pharmacy Job Vacancies**: Recruitment portal for registered pharmacists (B.Pharm / D.Pharm) with quick applications.
- **Cross-Network Messaging**: Real-time communication between patients, doctors, and pharmacies with attachment and voice memo simulations.

### 4. Multilingual & Accessibility
- Instant switching between **English**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)** across primary navigation, headings, and controls.

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **React Router DOM v7**
- **Tailwind CSS v4**
- **Lucide React** (Icons)
- **HTML5 WebRTC Camera APIs** (`navigator.mediaDevices.getUserMedia`)
- **Web Storage API** (Reactive persistent demo state)

---

## 🏃 Running Locally

Clone the project and start the development server:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Test production build
npm run build
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Hackathon Demonstration Walkthrough

Follow this 10-minute demo script to present the connected ecosystem to judges:

1. **Open THULIR Login**: Note the brand identity (Leaf + Heart + Medical Cross). Click **Demo Patient (Priya Sharma)**.
2. **Scan Prescription**:
   - On the Patient Dashboard, click **Scan Prescription**.
   - Watch the live camera feed (or click *Use Demo Prescription*).
   - Experience the multi-stage scanning animation.
   - Review and edit the extracted medicines table (Telmisartan 40mg, Metformin 500mg SR).
   - Click **Confirm & Save to Records**.
   - Notice the success toast, and check that **Health Records**, **Prescriptions**, and **Medical History** have all updated automatically!
3. **Show Health QR**:
   - Click **My Health QR** on the sidebar. View the scannable pass with citizen ID `TH-P-8921`.
4. **Log Out & Switch to Doctor**:
   - Log out, then click **Demo Doctor (Dr. Arvind Swaminathan)** on the login screen.
   - On the Doctor Dashboard, click **Scan Patient Health QR**.
   - Select *Use Demo QR (Priya Sharma)*. Notice the instant **Patient Profile Found** alert displaying her Penicillin allergy and clinical summary.
   - Click **Open Chart** to view her longitudinal timeline.
5. **Issue New Prescription**:
   - Go to **Create Prescription**. Notice the active allergy alert banner.
   - Add a medicine, preview the prescription slip, and click **Save & Transmit**.
6. **Log Out & Switch to Pharmacy**:
   - Log out, then click **Demo Pharmacy (Apollo Green Meds)**.
   - Go to **Create Post**, publish an Azithromycin 500mg lot at a 20% discount.
   - See it immediately appear on the **Marketplace Feed** and in **Stock Availability**.
   - Open **Messages** to view patient order inquiries.
   - Toggle the language selector in the top bar to **தமிழ்** or **हिन्दी** to demonstrate vernacular accessibility.

---

## ⚖️ Safety & Regulatory Disclaimer

THULIR is a hackathon frontend demonstration prototype. All patient records, doctor credentials, drug licenses, OCR extractions, and AI diagnostic aids are simulated for demonstration purposes and do not substitute for certified clinical advice.
