# Hospital Vaccine Booking System - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Vercel)                         │ │
│  │  https://hcl-tech-vaccine.vercel.app                         │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │ Home Page    │  │ Search       │  │ Booking      │       │ │
│  │  │              │  │ Hospitals    │  │ Flow         │       │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │ Login/Reg    │  │ My Bookings  │  │ Admin Panel  │       │ │
│  │  │              │  │              │  │              │       │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │ │
│  │                                                              │ │
│  │  [Tailwind CSS] [React Router] [Axios HTTP Client]          │ │
│  │  [React Hook Form] [Context API] [Hot Toast]                │ │
│  └──────────────────────────────┬───────────────────────────────┘ │
│                                 │                                  │
│                        HTTPS REST API Calls                        │
│                                 │                                  │
└─────────────────────────────────┼──────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │         Express.js Backend (Render)                          │ │
│  │  https://hcltech-vaccine.onrender.com                        │ │
│  │                                                              │ │
│  │  [CORS Middleware] [Helmet] [Auth Middleware]               │ │
│  │  [Rate Limiting] [Input Validation] [Error Handling]        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    ROUTES LAYER                              │ │
│  │                                                              │ │
│  │  GET/POST /api/auth          - Login, Register, Logout     │ │
│  │  GET      /api/hospitals     - Search, List                │ │
│  │  GET      /api/hospitals/:id - Details                     │ │
│  │  GET      /api/vaccines      - Vaccine list                │ │
│  │  POST     /api/bookings      - Create booking              │ │
│  │  GET      /api/bookings/:id  - Booking details             │ │
│  │  PUT      /api/bookings/:id  - Update booking              │ │
│  │  DELETE   /api/bookings/:id  - Cancel booking              │ │
│  │                                                              │ │
│  │  [ADMIN ROUTES] - Protected with JWT + role check          │ │
│  │  POST     /api/admin/hospitals    - Create hospital        │ │
│  │  PUT      /api/admin/hospitals/:id- Update hospital        │ │
│  │  POST     /api/admin/vaccines     - Manage vaccines        │ │
│  │  POST     /api/admin/slots        - Set daily slots        │ │
│  │  GET      /api/admin/bookings     - All bookings           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              CONTROLLER LAYER (Business Logic)              │ │
│  │                                                              │ │
│  │  AuthController         HospitalController                  │ │
│  │  ├─ Register           ├─ searchHospitals()               │ │
│  │  ├─ Login              ├─ getNearbyHospitals()            │ │
│  │  ├─ JWT validation     ├─ getHospitalById()               │ │
│  │  └─ Logout             ├─ createHospital()                │ │
│  │                        └─ updateHospital()                │ │
│  │                                                              │ │
│  │  VaccineController      BookingController                  │ │
│  │  ├─ listVaccines()      ├─ createBooking()               │ │
│  │  ├─ createVaccine()     ├─ getBooking()                 │ │
│  │  └─ updateVaccine()     ├─ cancelBooking()              │ │
│  │                         └─ getUserBookings()             │ │
│  │                                                              │ │
│  │  AdminController                                            │ │
│  │  ├─ getAllBookings()                                        │ │
│  │  ├─ completeBooking()                                       │ │
│  │  └─ dashboardStats()                                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            MIDDLEWARE LAYER (Security & Processing)        │ │
│  │                                                              │ │
│  │  ✓ JWT Authentication      - Validate tokens              │ │
│  │  ✓ Role-based Access       - Admin vs Patient             │ │
│  │  ✓ Input Validation        - express-validator            │ │
│  │  ✓ Data Sanitization       - XSS, NoSQL injection         │ │
│  │  ✓ Rate Limiting           - DDoS prevention              │ │
│  │  ✓ Error Handling          - Centralized AppError         │ │
│  │  ✓ Request Logging         - Morgan                       │ │
│  │  ✓ Security Headers        - Helmet                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Mongoose ODM (Object-Document Mapper)            │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │ User Schema  │  │ Hospital     │  │ Vaccine      │       │ │
│  │  │              │  │ Schema       │  │ Schema       │       │ │
│  │  │ - email      │  │              │  │              │       │ │
│  │  │ - password   │  │ - name       │  │ - name       │       │ │
│  │  │ - role       │  │ - address    │  │ - manufacturer       │ │
│  │  │ - phone      │  │ - location   │  │ - doses      │       │ │
│  │  │ - dateOfBirth│  │   (GeoJSON)  │  │ - ageMin/Max │       │ │
│  │  └──────────────┘  │ - vaccines[] │  │ - gapBetween│       │ │
│  │                    │ - operating  │  └──────────────┘       │ │
│  │  ┌──────────────┐  │   Hours      │                         │ │
│  │  │ Booking      │  │ - facilities │  [Geospatial Indexing] │ │
│  │  │ Schema       │  └──────────────┘  for "nearby" search    │ │
│  │  │              │                                           │ │
│  │  │ - user       │  [Validation]                             │ │
│  │  │ - hospital   │  - Email uniqueness                       │ │
│  │  │ - vaccine    │  - Date not in past                       │ │
│  │  │ - date       │  - Available slots                        │ │
│  │  │ - status     │  - Price ranges                           │ │
│  │  │ - refNo      │  - Required fields                        │ │
│  │  └──────────────┘                                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        MongoDB Atlas (Cloud Database)                       │ │
│  │                                                              │ │
│  │        Collections:                                         │ │
│  │        ├── users          (10+ hospitals, 100+ bookings)    │ │
│  │        ├── hospitals      (with geospatial indexes)         │ │
│  │        ├── vaccines                                         │ │
│  │        └── bookings       (with timestamps)                 │ │
│  │                                                              │ │
│  │        Backup: Automatic daily backups                      │ │
│  │        Scaling: Auto-scaling for high load                  │ │
│  │        Replication: 3-node replica set for HA               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: User Booking Vaccine Slot

```
1. USER INTERFACE (React)
   ↓
   User clicks "Book Now" on hospital page
   ↓
2. FRONTEND LOGIC
   ├─ Form validation (date, slot selection)
   ├─ Show loading spinner
   └─ Prepare booking data
   ↓
3. HTTP REQUEST (Axios)
   POST /api/bookings
   Headers: Authorization: Bearer <JWT_TOKEN>
   Body: {
     hospital: "123abc",
     vaccine: "456def",
     date: "2025-05-20",
     slot: "09:00-09:30"
   }
   ↓
4. BACKEND RECEIVES REQUEST (Express)
   ├─ CORS check ✓
   ├─ Parse JSON ✓
   ├─ Rate limit check ✓
   └─ Pass to middleware
   ↓
5. MIDDLEWARE LAYER
   ├─ Authentication middleware
   │  └─ Verify JWT token → Extract user ID
   │
   ├─ Authorization middleware (if admin-only route)
   │  └─ Check role = 'admin'
   │
   └─ Validation middleware
      └─ Check hospital exists, vaccine exists, slot available
   ↓
6. CONTROLLER (BookingController)
   ├─ Fetch hospital from DB
   ├─ Fetch vaccine from DB
   ├─ Check slot availability
   ├─ Generate booking reference (e.g., BOOK-20250520-1234)
   └─ Create Booking document
   ↓
7. DATABASE (MongoDB)
   ├─ Insert new booking document
   ├─ Atomically update hospital.vaccines[].dailySlots[]
   │  (mark slot as booked)
   └─ Return saved document with _id
   ↓
8. BACKEND RESPONSE
   Status: 201 Created
   Body: {
     status: "success",
     data: {
       booking: {
         _id: "789ghi",
         user: "111aaa",
         hospital: "123abc",
         vaccine: "456def",
         date: "2025-05-20",
         slot: "09:00-09:30",
         referenceNumber: "BOOK-20250520-1234",
         status: "confirmed"
       }
     }
   }
   ↓
9. FRONTEND RECEIVES RESPONSE
   ├─ Hide loading spinner
   ├─ Show success toast notification
   ├─ Store booking in context
   └─ Redirect to confirmation page
   ↓
10. CONFIRMATION PAGE (React)
    └─ Display booking details and reference number
```

## Authentication & Security Flow

```
┌─────────────────────────────────────────────────────────┐
│              LOGIN PROCESS (JWT Generation)              │
└─────────────────────────────────────────────────────────┘

1. User submits email & password
   ↓
2. Backend finds user in database
   ↓
3. Compare submitted password with bcrypt hash in DB
   ├─ If mismatch → Return 401 "Invalid credentials"
   └─ If match → Continue
   ↓
4. Generate JWT token:
   jwt.sign(
     { id: user._id },           ← payload
     process.env.JWT_SECRET,     ← secret key
     { expiresIn: '7d' }         ← expiration
   )
   ↓
5. Return JWT to frontend
   ├─ Frontend stores in localStorage
   └─ Frontend includes in Authorization header for future requests
   ↓
6. SUBSEQUENT REQUESTS:
   GET /api/user/bookings
   Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ↓
7. Backend verifies token:
   jwt.verify(token, JWT_SECRET)
   ├─ If valid → Continue processing
   ├─ If expired → Return 401, frontend redirects to login
   └─ If invalid → Return 401
```

## Deployment Architecture

```
┌──────────────────┐
│  GitHub Repo     │
│  (Source Code)   │
└────────┬─────────┘
         │
         │ Push code
         ├──────────────────┐
         │                  │
         ▼                  ▼
   ┌─────────────┐    ┌──────────────┐
   │ Vercel      │    │ Render       │
   │ Frontend CD │    │ Backend CD   │
   │             │    │              │
   │ Triggers:   │    │ Triggers:    │
   │ - Push to   │    │ - Push to    │
   │   main      │    │   main       │
   │             │    │              │
   │ Build:      │    │ Build:       │
   │ - npm build │    │ - npm start  │
   │ - Vite      │    │ - Node.js    │
   │             │    │              │
   │ Deploy to   │    │ Deploy to    │
   │ CDN (Edge)  │    │ Server       │
   └────────┬────┘    └──────┬───────┘
            │                │
            └────────┬───────┘
                     ▼
         ┌─────────────────────────┐
         │   MongoDB Atlas         │
         │   (Cloud Database)      │
         │                         │
         │  - Automatic backups    │
         │  - Replica set (HA)     │
         │  - Scaling              │
         └─────────────────────────┘

Frontend: Served globally via CDN (fast in all regions)
Backend: Runs on Render container (auto-restart on crash)
Database: Managed MongoDB (auto-scaling, backup)
```

## Key Design Patterns Used

```
1. MVC (Model-View-Controller)
   └─ Backend: Models (schemas) → Controllers (logic) → Views (JSON)
   └─ Frontend: Pages (views) → Components → Context (state)

2. Middleware Pipeline
   └─ Each request passes through: Auth → Validate → Process → Respond

3. Dependency Injection
   └─ Models passed to controllers, reducing tight coupling

4. Context API Provider Pattern
   └─ Global state (Auth, Booking) accessible from any component

5. Error Handling Strategy
   └─ Custom AppError class → Centralized error middleware → User-friendly responses

6. Protected Route Pattern
   └─ React Router: Check user/role before rendering component

7. Interceptor Pattern
   └─ Axios: Auto-add auth header, handle 401 globally

8. Factory Pattern
   └─ buildSearchQuery() creates dynamic MongoDB filters
```

