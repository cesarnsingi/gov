# 🏛️ LuandaGov — Civic App for Luanda, Angola

> Inspired by civic reporting apps used in smart cities worldwide.  
> Built to connect citizens with their government digitally.

---

## 📋 Project Brief

### Purpose
**LuandaGov** is a citizen-facing mobile app that allows residents of Luanda to report city problems, access government services, track their reports, and engage with civic information — all from their phone. It aims to make government more accessible, transparent, and responsive.

### Problem Statement
Citizens in Luanda lack a unified digital channel to:
- Report infrastructure problems (potholes, broken lights, illegal dumping)
- Track what happens to their reports
- Access government services without queuing
- Pay government fees digitally
- Access election and civic information

### Target Users
| User | Description |
|------|-------------|
| 👤 Citizens | Residents reporting issues, paying fees, accessing ID |
| 🏛️ Government Staff | Admins reviewing and updating report statuses |
| 🔧 Field Workers | Technicians assigned to resolve reported issues |

---

## ✨ Features

### Civic Reporting
- 📸 Report potholes, broken street lights, illegal dumping, and more
- 📷 Upload photos directly from camera or gallery
- 📍 GPS-based location tagging (or manual map selection)
- 📊 Track report status (Submitted → Under Review → In Progress → Resolved)
- 🔔 Push notifications when status changes
- 🗺️ Map showing all reported problems in your area

### Government Services
- 💳 Digital ID wallet (store citizen documents)
- 💰 Pay government fees (licenses, certificates, fines)
- 🗳️ Election information (candidates, polling stations, results)
- 📋 Request official documents online
- 📞 Government service directory

### Smart City Map
- Real-time map of open issues by category
- Heat map of problem density by district
- Filter by issue type and status
- Navigate to nearest government office

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  LUANDAGOV MOBILE APP                     │
│          React Native (Expo) — iOS/Android                │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼──────────────────────────────────┐
│                   FASTAPI BACKEND                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Auth    │ │ Reports  │ │ Services │ │    Map     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐                               │
│  │ Payments │ │Elections │                               │
│  └──────────┘ └──────────┘                               │
└───────┬───────────────┬──────────────┬────────────────────┘
        │               │              │
┌───────▼──────┐ ┌──────▼─────┐ ┌─────▼──────────────────┐
│  PostgreSQL  │ │   Redis    │ │     S3 / R2            │
│  + PostGIS   │ │  (Cache +  │ │  (Photo Storage)       │
│              │ │  Sessions) │ │                        │
└──────────────┘ └────────────┘ └────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
-- Users & Auth
citizens (id, full_name, phone, email, bi_number, ward, created_at)
auth_sessions (id, citizen_id, token_hash, expires_at)

-- Civic Reports
reports (id, citizen_id, type, title, description, status, lat, lng, district, created_at)
report_photos (id, report_id, url, created_at)
report_updates (id, report_id, status, note, updated_by, created_at)

-- Report Categories
report_categories (id, name_pt, name_en, icon, color, sort_order)

-- Government Services
service_categories (id, name_pt, name_en, icon, description_pt, description_en)
fee_payments (id, citizen_id, service_type, amount_aoa, reference, status, paid_at)
document_requests (id, citizen_id, doc_type, status, reference, created_at)

-- Elections
election_cycles (id, name, election_date, type, active)
candidates (id, election_id, party, name, position, bio)
polling_stations (id, name, district, address, lat, lng)

-- Notifications
push_tokens (id, citizen_id, token, platform, active)
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register          Register with BI number + phone
POST   /auth/login             Login
POST   /auth/otp/send          Send SMS OTP
POST   /auth/otp/verify        Verify OTP
GET    /auth/me                Current citizen profile
```

### Civic Reports
```
GET    /reports                All reports (paginated, filterable)
GET    /reports/mine           Current user's reports
GET    /reports/map            All reports with coordinates (GeoJSON)
GET    /reports/{id}           Report detail + timeline
POST   /reports                Submit new report (with photos)
PATCH  /reports/{id}/status    Update status (admin/field worker)
GET    /reports/categories     Report categories
```

### Government Services
```
GET    /services               Available services list
POST   /services/payment       Pay a government fee
GET    /services/payment/{id}  Payment status
POST   /services/document      Request a document
GET    /services/document/{id} Document request status
```

### Map
```
GET    /map/reports             GeoJSON of all open reports
GET    /map/offices             Government offices near lat/lng
GET    /map/polling-stations    Polling stations by district
```

### Elections
```
GET    /elections/current       Current election info
GET    /elections/candidates    Candidate list
GET    /elections/stations      Polling stations near user
```

### Notifications
```
POST   /notifications/register  Register push token
```

---

## 📱 UI Screens

| Screen | Description |
|--------|-------------|
| Splash / Onboarding | Civic branding + language selection |
| Register / Login | BI number + phone + OTP verification |
| Dashboard (Home) | Quick actions, recent reports, news ticker |
| Report Map | Map view of all city issues |
| Submit Report | Category → photo → location → submit |
| My Reports | List + status timeline |
| Report Detail | Full report with photo + updates |
| Services | Government services grid |
| Fee Payment | Payment flow for government fees |
| Elections | Candidate info + polling stations |
| Digital ID | Citizen document wallet |
| Profile / Settings | Account info + language toggle |

---

## 🗺️ Product Roadmap

### ✅ MVP (Phase 1 — Current)
- [x] Civic report submission (category, photo, GPS)
- [x] Report status tracking
- [x] Map of reported issues
- [x] Government services directory
- [x] Election information
- [x] Push notifications
- [x] PT/EN bilingual
- [x] FastAPI + PostgreSQL + Docker

### 🔄 Phase 2
- [ ] Digital ID wallet (offline-capable)
- [ ] Fee payment via Multicaixa
- [ ] Document request and tracking
- [ ] SMS OTP verification
- [ ] Photo upload to S3/R2
- [ ] Admin dashboard (web)

### 🚀 Phase 3
- [ ] AI-powered issue categorisation from photos
- [ ] Real-time status updates via WebSocket
- [ ] Community upvoting of reports
- [ ] Open data API for journalists
- [ ] Integration with municipal systems

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Mobile | React Native (Expo) | Cross-platform |
| Maps | expo-location + react-native-maps | GPS + map display |
| State | Zustand | Lightweight |
| Navigation | React Navigation v6 | Standard |
| Backend | FastAPI (Python 3.12) | Fast async |
| Database | PostgreSQL + PostGIS | Geospatial queries |
| Cache | Redis | Sessions + rate limits |
| Storage | S3 / Cloudflare R2 | Photo uploads |
| Auth | JWT + OTP | Citizen verification |
| Push | Expo Push + FCM | Notifications |
| Infrastructure | Docker | Deployment |
| i18n | Custom Context | PT 🇦🇴 / EN 🇬🇧 |

---

## 🚀 Quick Start

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Docker
```bash
docker-compose up --build
```
API: `http://localhost:8000`  
Swagger: `http://localhost:8000/docs`

---

## 🌍 Environment Variables

### Mobile (`mobile/.env`)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/luandagov
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
S3_BUCKET=luandagov-photos
S3_REGION=af-south-1
```

---

## 📁 Project Structure

```
LuandaGov/
├── mobile/
│   ├── App.tsx
│   ├── package.json
│   └── src/
│       ├── screens/
│       │   ├── HomeScreen.tsx          # Dashboard
│       │   ├── MapScreen.tsx           # City issue map
│       │   ├── ReportScreen.tsx        # Submit report
│       │   ├── MyReportsScreen.tsx     # My reports + status
│       │   ├── ServicesScreen.tsx      # Government services
│       │   ├── ElectionsScreen.tsx     # Election info
│       │   └── ProfileScreen.tsx       # Settings + ID wallet
│       ├── components/
│       │   ├── ReportCard.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── CategoryPicker.tsx
│       │   └── LanguageSwitcher.tsx
│       ├── i18n/
│       │   ├── translations.ts
│       │   └── LanguageContext.tsx
│       ├── services/
│       │   ├── api.ts
│       │   └── notifications.ts
│       ├── store/
│       │   └── useAuthStore.ts
│       └── constants/
│           └── colors.ts
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── routers/
│       ├── auth.py
│       ├── reports.py
│       ├── services.py
│       ├── map.py
│       ├── elections.py
│       └── notifications.py
│
├── docker-compose.yml
└── README.md
```

---

## 🤝 Contributing

Built with 🇦🇴 for the citizens of Luanda.  
Inspired by smart city apps worldwide · Powered by FastAPI + React Native.
