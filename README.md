# Smart Medical System

A comprehensive full-stack medical management platform enabling doctors and patients to manage appointments, treatments, vitals, analytics, AI-driven suggestions, and secure reports. Built using the latest modern web technologies with a clean UI and scalable backend.

## 🚀 Features
### 👨‍⚕️ Doctor Module
- View and manage patients
- Add treatments, prescriptions, and advice
- Upload and manage patient reports
- Search patients by Patient ID (PID)
- View analytics and vitals charts

### 🧑‍🤝‍🧑 Patient Module
- View health vitals trends
- Access medical reports
- View treatments and doctor advice
- Secure password update
- Analytics dashboard

### 🤖 AI Engine (Optional)
- Generates insights from vitals
- Suggests preventive care recommendations
- Natural language summary generator

## 🛠 Tech Stack
### Frontend
- React.js
- Tailwind CSS
- Recharts
- Lucide Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer file upload

### DevOps / Tools
- Git & GitHub
- VS Code
- Postman / Thunder Client

## 📁 Folder Structure
```
smart-medical-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
└── README.md
```

## ⚙️ Installation & Setup
### 1. Clone the repo
```
git clone https://github.com/yourusername/smart-medical-system.git
```

### 2. Install frontend
```
cd frontend
npm install
npm start
```

### 3. Install backend
```
cd backend
npm install
node server.js
```

### 4. Environment variables (IMPORTANT)
Create `.env` in **backend**:
```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

## 📊 Vitals & Analytics
The patient dashboard includes:
- Heart rate graphs
- Temperature trends
- BP charts
- Oxygen level tracking
- Doctor insights

## 📸 Screenshots (Add yours here)
```
![Dashboard Screenshot](path_to_image)
![Login Screen](path_to_image)
```

## 📄 API Endpoints
### Patients
- `GET /patients/profile/me`
- `GET /patients/:id`
- `PUT /patients/update-password`

### Treatments
- `POST /treatments/:id`
- `GET /treatments/:id`

### Reports
- `POST /reports/upload/:id`
- `GET /reports/:id`

## 🔐 Security
- JWT authentication
- Password hashing
- Role-based access control
- GitHub secret protection
- `.env` secured with `.gitignore`

## 🧪 Testing
Use Postman or Thunder Client to test API routes.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

## 📜 License
MIT License

---
Made with ❤️ by Satish
