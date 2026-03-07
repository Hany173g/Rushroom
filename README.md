# Rushroom

Rushroom هو تطبيق ويب حديث لإدارة الملفات الشخصية مع مصادقة Google OAuth، مصمم بواسطة React و Node.js مع MongoDB.

## 🚀 المميزات

### 🔐 المصادقة
- تسجيل الدخول باستخدام Google OAuth 2.0
- JWT tokens للمصادقة الآمنة
- إدارة حالة المستخدم (مفعل/معلق)

### 👤 الملف الشخصي
- صفحة بروفايل عامة قابلة للمشاركة
- تعديل الملف الشخصي (الاسم، النوع، الصورة)
- رفع الصور عبر Cloudinary
- تحديث فوري للبيانات

### 🎨 واجهة المستخدم
- تصميم عصري باستخدام TailwindCSS
- Toast notifications للتنبيهات
- Responsive design للجوال والكمبيوتر
- Loading states و error handling

## 🛠️ التكنولوجيا

### Frontend
- **React 19.2.0** - UI Framework
- **TypeScript** - Type Safety
- **React Router v6** - Navigation
- **TailwindCSS** - Styling
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **TypeScript** - Type Safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image Upload

## 📦 Installation

### المتطلبات
- Node.js 18+
- MongoDB
- Google Cloud Console Project

### إعداد المشروع

1. **Clone المشروع**
```bash
git clone <repository-url>
cd Rushroom
```

2. **إعداد Backend**
```bash
cd backend
npm install
```

3. **إعداد Frontend**
```bash
cd frontend
npm install
```

4. **إعداد المتغيرات البيئية**

**Backend (.env)**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rushroom
ACCESS_TOKEN=your-secret-jwt-key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚀 تشغيل المشروع

### تشغيل Backend
```bash
cd backend
npm run dev
```

### تشغيل Frontend
```bash
cd frontend
npm run dev
```

## 📁 هيكل المشروع

```
Rushroom/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app setup
│   │   ├── auth/               # Google OAuth setup
│   │   ├── config/             # Cloudinary config
│   │   ├── controller/         # Route controllers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Helper functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   ├── pages/              # Page components
│   │   └── types/              # TypeScript types
│   └── package.json
└── README.md
```

## 🔗 API Endpoints

### المصادقة
- `POST /auth/google` - Google OAuth login
- `POST /auth/completeUserProfile` - Complete profile after first login

### الملف الشخصي
- `GET /user/getUserProfile?id={userId}` - Get user profile
- `PATCH /user/updateProfileData` - Update profile data

## 🎯 استخدام التطبيق

1. **تسجيل الدخول**
   - اضغط "تسجيل الدخول بحساب Google"
   - اختر حساب Google الخاص بك
   - أكمل بيانات الملف الشخصي (أول مرة فقط)

2. **الملف الشخصي**
   - الوصول إلى `/profile/{userId}` لعرض أي بروفايل
   - الوصول إلى `/profile` لبروفايلك الشخصي
   - اضغط "تعديل الملف الشخصي" للتعديل

3. **مشاركة البروفايل**
   - انسخ رابط البروفايل من Navbar
   - شارك الرابط مع الآخرين
   - يمكن لأي شخص مشاهدة البروفايل بدون تسجيل دخول

## 🔧 إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API
4. أنشئ OAuth 2.0 Client ID
5. أضف `http://localhost:5173` كـ Authorized redirect URI
6. انسخ Client ID و Client Secret إلى `.env`

## 🔧 إعداد Cloudinary

1. سجل في [Cloudinary](https://cloudinary.com/)
2. أنشئ حساب جديد
3. انسخ Cloud name, API key, و API secret
4. أضفها إلى `.env` في Backend

## 🐛 Debugging

### مشاكل شائعة

1. **CORS Errors**
   - تأكد من `FRONTEND_URL` في `.env` صحيح
   - تحقق من أن CORS methods تحتوي على PATCH

2. **JWT Errors**
   - تأكد من `ACCESS_TOKEN` في `.env` قوي وفريد
   - تحقق من انتهاء صلاحية Token

3. **MongoDB Connection**
   - تأكد من MongoDB يعمل
   - تحقق من `MONGODB_URI` صحيح

4. **Google OAuth**
   - تحقق من Client ID و Client Secret
   - تأكد من Redirect URI صحيح في Google Console

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add some amazing feature'`)
4. Push إلى الـ branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 License

هذا المشروع تحت رخصة MIT - انظر [LICENSE](LICENSE) file للتفاصيل.

## 👥 الفريق

- **Hany173g** - Developer & Maintainer

## 🙏 الشكر

- [React](https://reactjs.org/) - UI Framework
- [Express](https://expressjs.com/) - Web Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image Upload
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
