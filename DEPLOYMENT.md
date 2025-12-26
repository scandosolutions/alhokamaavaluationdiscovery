# دليل النشر والتفعيل
## Al-Hokamaa Company Evaluation System - Deployment Guide

---

## 🚀 خيارات النشر

### الخيار 1: GitHub Pages (موصى به - مجاني)

#### الخطوات:

1. **رفع الملفات إلى GitHub:**
```bash
cd c:\Users\Scando\OneDrive\Documents\GitHub\alhokamaavaluationdiscovery
git add .
git commit -m "Initial commit - Al-Hokamaa Evaluation System"
git push origin main
```

2. **تفعيل GitHub Pages:**
   - اذهب إلى repository على GitHub
   - Settings → Pages
   - Source: اختر "main" branch
   - احفظ التغييرات

3. **الوصول للموقع:**
   - الرابط سيكون: `https://scandosolutions.github.io/alhokamaavaluationdiscovery/`

---

### الخيار 2: Netlify (موصى به - مجاني)

#### الخطوات:

1. **إنشاء حساب على Netlify:**
   - اذهب إلى: https://netlify.com
   - سجل دخول باستخدام GitHub

2. **نشر الموقع:**
   - اختر "Add new site" → "Import an existing project"
   - اختر GitHub repository
   - اضغط "Deploy site"

3. **الحصول على رابط مخصص (اختياري):**
   - Site settings → Domain management
   - يمكنك ربط نطاق مخصص مثل: `evaluation.alhokamaa.com`

---

### الخيار 3: Vercel (موصى به - مجاني)

#### الخطوات:

1. **إنشاء حساب على Vercel:**
   - اذهب إلى: https://vercel.com
   - سجل دخول باستخدام GitHub

2. **استيراد المشروع:**
   - اضغط "New Project"
   - اختر repository من GitHub
   - اضغط "Deploy"

3. **الوصول للموقع:**
   - سيتم توفير رابط تلقائياً

---

### الخيار 4: استضافة تقليدية (Shared Hosting)

#### المتطلبات:
- حساب استضافة مع دعم FTP
- لوحة تحكم cPanel أو مشابه

#### الخطوات:

1. **رفع الملفات عبر FTP:**
   - استخدم FileZilla أو برنامج FTP آخر
   - ارفع جميع الملفات إلى مجلد `public_html`

2. **التأكد من الصلاحيات:**
   - تأكد من أن الملفات قابلة للقراءة (chmod 644)

3. **الوصول للموقع:**
   - الرابط سيكون: `https://yourdomain.com`

---

## 🔐 إعداد Google Sheets API

### الخطوة 1: إنشاء مشروع على Google Cloud

1. **اذهب إلى:** https://console.cloud.google.com
2. **أنشئ مشروع جديد:**
   - اضغط "Select a project" → "New Project"
   - الاسم: "Al-Hokamaa Evaluation System"
   - اضغط "Create"

### الخطوة 2: تفعيل APIs المطلوبة

1. **تفعيل Google Sheets API:**
   - APIs & Services → Library
   - ابحث عن "Google Sheets API"
   - اضغط "Enable"

2. **تفعيل Google Drive API (للملفات):**
   - ابحث عن "Google Drive API"
   - اضغط "Enable"

### الخطوة 3: إنشاء API Key

1. **إنشاء Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → API key
   - انسخ المفتاح

2. **تقييد المفتاح (أمان):**
   - اضغط على المفتاح
   - API restrictions → اختر "Restrict key"
   - حدد: Google Sheets API و Google Drive API
   - HTTP referrers: أضف نطاقك (مثال: `https://yourdomain.com/*`)

### الخطوة 4: تحديث config.js

```javascript
const CONFIG = {
    API_KEY: 'YOUR_NEW_API_KEY_HERE', // استبدل بالمفتاح الجديد
    SPREADSHEET_ID: '1MySbmF_IA13IjtpCs2hRIFkJqWVGxRcdhiahvaEDXao',
    // ... باقي الإعدادات
};
```

---

## 📊 إعداد Google Sheets

### الخطوة 1: جعل الملف قابل للتحرير

1. **افتح Google Sheet:**
   - https://docs.google.com/spreadsheets/d/1MySbmF_IA13IjtpCs2hRIFkJqWVGxRcdhiahvaEDXao/edit

2. **ضبط الصلاحيات:**
   - اضغط "Share"
   - Anyone with the link → Editor
   - أو: أضف البريد الإلكتروني الخاص بـ Service Account

### الخطوة 2: إنشاء الورقة

1. **أنشئ ورقة جديدة بعنوان:** `التقييمات`
2. **سيتم إنشاء الرؤوس تلقائياً** عند أول استخدام

---

## 📁 رفع الملفات إلى Google Drive

### إعداد OAuth2 (مطلوب لرفع الملفات)

⚠️ **ملاحظة:** رفع الملفات يتطلب إعداد إضافي لـ OAuth2.

#### الخطوة 1: إنشاء OAuth Client ID

1. **Google Cloud Console:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: أضف نطاقك
   - Authorized redirect URIs: أضف `https://yourdomain.com/callback`

2. **انسخ:**
   - Client ID
   - Client Secret

#### الخطوة 2: تحديث الكود

في `app.js`، أضف:

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = 'https://yourdomain.com/callback';

// Initialize Google OAuth
function initGoogleAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: CLIENT_ID,
        });
    });
}
```

#### الخطوة 3: تطبيق دالة الرفع

```javascript
async function uploadToDrive(file) {
    const auth = gapi.auth2.getAuthInstance();
    if (!auth.isSignedIn.get()) {
        await auth.signIn();
    }
    
    const metadata = {
        name: file.name,
        mimeType: file.type
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${gapi.auth.getToken().access_token}`
        },
        body: form
    });
    
    const data = await response.json();
    return `https://drive.google.com/file/d/${data.id}/view`;
}
```

---

## 🧪 الاختبار قبل النشر

### 1. اختبار محلي

```bash
# تشغيل خادم محلي
python -m http.server 8000

# أو باستخدام Node.js
npx http-server -p 8000
```

افتح: `http://localhost:8000`

### 2. اختبار الوظائف

- [ ] التنقل بين الأقسام
- [ ] التحقق من الحقول المطلوبة
- [ ] رفع الملفات
- [ ] إرسال النموذج
- [ ] حفظ البيانات في Google Sheets
- [ ] الحفظ التلقائي

### 3. اختبار الاستجابة

- [ ] الموبايل (أقل من 768px)
- [ ] التابلت (768px - 1024px)
- [ ] سطح المكتب (أكبر من 1024px)

---

## 🔍 استكشاف الأخطاء

### المشكلة: لا يتم إرسال البيانات إلى Google Sheets

**الحلول:**
1. تأكد من صلاحيات الملف (Editor)
2. تحقق من صحة API Key
3. تأكد من تفعيل Google Sheets API
4. تحقق من Console في المتصفح (F12)

### المشكلة: CORS Error

**الحل:**
- تأكد من إضافة نطاقك في HTTP referrers
- استخدم HTTPS بدلاً من HTTP

### المشكلة: لا تظهر الخطوط العربية

**الحل:**
- تأكد من تحميل Google Fonts بشكل صحيح
- تحقق من الاتصال بالإنترنت

---

## 📱 تحسينات إضافية

### 1. إضافة Google Analytics

```html
<!-- في <head> في index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. إضافة PWA Support

أنشئ `manifest.json`:

```json
{
  "name": "استبيان تقييم الشركة - مكتب الحكماء",
  "short_name": "تقييم الشركة",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A2B3A",
  "theme_color": "#B89B5E",
  "icons": [
    {
      "src": "https://i.ibb.co/wF7rLbkG/icon-alhokamaa-transparent-background.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 3. تحسين SEO

```html
<!-- في <head> -->
<meta name="description" content="استبيان استكشافي لتحليل وتقييم الوضع الراهن للشركة - مكتب الحكماء">
<meta name="keywords" content="تقييم شركات, استبيان, مكتب الحكماء, تحليل الشركات">
<meta property="og:title" content="استبيان تقييم الشركة - مكتب الحكماء">
<meta property="og:description" content="استبيان شامل لتقييم الوضع الحالي للشركات">
<meta property="og:image" content="https://i.ibb.co/XG73DWy/logo-alhokamaa-transparent-light-background.png">
```

---

## 📋 قائمة مراجعة ما قبل النشر

- [ ] تحديث API Key في config.js
- [ ] اختبار جميع الوظائف
- [ ] التحقق من صلاحيات Google Sheets
- [ ] اختبار على أجهزة مختلفة
- [ ] تفعيل HTTPS
- [ ] إضافة Google Analytics (اختياري)
- [ ] اختبار سرعة التحميل
- [ ] التحقق من الأمان
- [ ] نسخ احتياطي من الملفات

---

## 🆘 الدعم والمساعدة

### مصادر مفيدة:
- Google Sheets API Documentation: https://developers.google.com/sheets/api
- Google Drive API Documentation: https://developers.google.com/drive/api
- GitHub Pages Documentation: https://pages.github.com

### للمساعدة:
- 📧 البريد الإلكتروني: info@alhokamaa.com
- 🌐 الموقع: www.alhokamaa.com

---

**آخر تحديث:** 26 ديسمبر 2025
**الإصدار:** 1.0.0
