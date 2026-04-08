# ⚡ مراحل سریع Deployment

## 🎯 هدف: Deploy روی Netlify در 5 دقیقه

---

## ✅ مرحله 1: Netlify Token (2 دقیقه)

```
1. https://app.netlify.com/user/applications
2. "New access token" کلیک کنید
3. نام: "github-actions"
4. "Generate token" کلیک کنید
5. کپی کنید ✅
```

---

## ✅ مرحله 2: Site ID (1 دقیقه)

```
1. https://app.netlify.com
2. "Add new site" کلیک کنید
3. "Import an existing project" انتخاب کنید
4. GitHub انتخاب کنید
5. Repository انتخاب کنید
6. Site ID را کپی کنید ✅
```

---

## ✅ مرحله 3: GitHub Secrets (1 دقیقه)

```
1. Repository → Settings
2. Secrets and variables → Actions
3. "New repository secret"
   - Name: NETLIFY_AUTH_TOKEN
   - Value: [token از مرحله 1]
4. "Add secret" کلیک کنید
5. دوباره "New repository secret"
   - Name: NETLIFY_SITE_ID
   - Value: [site ID از مرحله 2]
6. "Add secret" کلیک کنید ✅
```

---

## ✅ مرحله 4: Deploy (1 دقیقه)

```bash
git push origin staging/phase-5-deployment
```

✅ **GitHub Actions شروع می‌شود!**

---

## 📊 نتیجه

```
Push ↓
GitHub Actions ↓
Build ↓
Deploy ↓
Netlify ✅

https://your-site.netlify.app
```

---

## 🎉 تمام!

سایت شما آنلاین است! 🌐
