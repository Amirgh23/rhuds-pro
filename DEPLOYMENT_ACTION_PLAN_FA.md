# 📋 پلان اقدام برای Deployment

## 🎯 هدف

استقرار پروژه RHUDS Pro روی Netlify

## ✅ تمام آماده‌سازی‌ها انجام شده

- ✅ netlify.toml تنظیم شده
- ✅ pnpm lock file issue حل شده
- ✅ GitHub Actions workflow آماده
- ✅ Build محلی موفق
- ✅ Git push شده

---

## 🚀 اقدامات بعدی (انتخاب یکی)

### ✨ راه 1: GitHub Actions (توصیه می‌شود)

**مدت زمان:** 5 دقیقه

```
1. Netlify token بگیرید (2 دقیقه)
   ↓
2. Site ID بگیرید (1 دقیقه)
   ↓
3. GitHub secrets اضافه کنید (1 دقیقه)
   ↓
4. Deploy خودکار شروع می‌شود ✅
```

**دستورات:**

```bash
# مرحله 1: Netlify token
# https://app.netlify.com/user/applications
# → "New access token" → کپی

# مرحله 2: Site ID
# https://app.netlify.com
# → سایت جدید → Site ID کپی

# مرحله 3: GitHub secrets
# Repository → Settings → Secrets and variables → Actions
# NETLIFY_AUTH_TOKEN = [token]
# NETLIFY_SITE_ID = [site ID]

# مرحله 4: Deploy شروع می‌شود
# Repository → Actions → Deploy to Netlify
```

---

### 🔧 راه 2: Netlify CLI

**مدت زمان:** 3 دقیقه

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=packages/demo-app/dist
```

---

### ⚡ راه 3: Vercel

**مدت زمان:** 2 دقیقه

```bash
npm i -g vercel
vercel --prod
```

---

## 📊 مقایسه

| معیار        | GitHub Actions | Netlify CLI | Vercel  |
| ------------ | -------------- | ----------- | ------- |
| خودکار       | ✅             | ❌          | ❌      |
| سرعت         | ⚡⚡           | ⚡          | ⚡⚡⚡  |
| تنظیم        | 5 دقیقه        | 1 دقیقه     | 1 دقیقه |
| Preview URLs | ✅             | ❌          | ✅      |
| توصیه        | ✅✅✅         | ✅✅        | ✅      |

---

## 🎬 مراحل دقیق (GitHub Actions)

### مرحله 1: Netlify Token

```
1. https://app.netlify.com/user/applications بروید
2. "New access token" کلیک کنید
3. نام: "github-actions"
4. "Generate token" کلیک کنید
5. کپی کنید (فقط یک بار نمایش داده می‌شود)
```

### مرحله 2: Site ID

```
1. https://app.netlify.com بروید
2. "Add new site" → "Import an existing project"
3. GitHub انتخاب کنید
4. Repository انتخاب کنید
5. Site ID را از Site settings کپی کنید
```

### مرحله 3: GitHub Secrets

```
1. Repository بروید
2. Settings → Secrets and variables → Actions
3. "New repository secret" کلیک کنید
4. اضافه کنید:
   - Name: NETLIFY_AUTH_TOKEN
   - Secret: [token از مرحله 1]
5. دوباره "New repository secret"
6. اضافه کنید:
   - Name: NETLIFY_SITE_ID
   - Secret: [site ID از مرحله 2]
```

### مرحله 4: Deploy

```bash
git push origin staging/phase-5-deployment
```

✅ **GitHub Actions شروع می‌شود!**

---

## 📈 نتیجه

```
Push → GitHub Actions → Build → Deploy → Netlify
                ↓
        https://your-site.netlify.app
```

---

## ⏱️ زمان‌بندی

| مرحله          | زمان          |
| -------------- | ------------- |
| Netlify token  | 2 دقیقه       |
| Site ID        | 1 دقیقه       |
| GitHub secrets | 1 دقیقه       |
| Deploy         | 2-3 دقیقه     |
| **کل**         | **6-7 دقیقه** |

---

## ✨ بعد از Deploy

```
1. https://your-site.netlify.app بروید
2. تمام صفحات را تست کنید
3. لاگ‌ها را بررسی کنید
4. Netlify dashboard را بررسی کنید
```

---

## 🎉 نتیجه نهایی

سایت شما روی Netlify آنلاین خواهد بود! 🌐
