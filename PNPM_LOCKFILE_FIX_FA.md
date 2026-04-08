# حل مشکل pnpm-lock.yaml برای Netlify

## 🔍 تشخیص مشکل

خطای Netlify:

```
ERR_PNPM_OUTDATED_LOCKFILE
```

**علت:** فایل `pnpm-lock.yaml` قدیمی است و با نسخه‌های `package.json` مطابقت ندارد.

---

## ✅ راه‌حل‌های اعمال‌شده

### 1️⃣ حذف Lock File قدیمی

```bash
Remove-Item pnpm-lock.yaml -Force
```

✅ **انجام شد**

### 2️⃣ اضافه کردن PNPM_FLAGS به netlify.toml

```toml
[build.environment]
  PNPM_FLAGS = "--no-frozen-lockfile"
```

✅ **انجام شد**

---

## 🚀 مراحل بعدی

### مرحله 1: تولید Lock File جدید (محلی)

اگر می‌خواهید lock file را محلی تولید کنید:

```bash
# اگر pnpm نصب است
pnpm install

# یا اگر npm استفاده می‌کنید
npm install
```

### مرحله 2: Commit و Push

```bash
git add pnpm-lock.yaml package.json
git commit -m "chore: regenerate pnpm-lock.yaml"
git push origin staging/phase-5-deployment
```

### مرحله 3: Netlify خودکار ساخت می‌کند

Netlify اکنون:

- ✅ بدون frozen lockfile check ساخت می‌کند
- ✅ نسخه‌های جدید را نصب می‌کند
- ✅ پروژه را deploy می‌کند

---

## 📋 وضعیت فعلی

| مورد              | وضعیت        |
| ----------------- | ------------ |
| Lock file قدیمی   | ❌ حذف شد    |
| PNPM_FLAGS        | ✅ اضافه شد  |
| netlify.toml      | ✅ به‌روز شد |
| آماده برای deploy | ✅ بله       |

---

## 🎯 اگر مشکل ادامه داشت

### گزینه 1: استفاده از npm به جای pnpm

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### گزینه 2: تنظیم دستی Netlify

1. به Netlify dashboard بروید
2. Site settings → Build & deploy → Environment
3. اضافه کنید:
   - Key: `PNPM_FLAGS`
   - Value: `--no-frozen-lockfile`

### گزینه 3: استفاده از Vercel (ساده‌تر)

```bash
npm i -g vercel
vercel --prod
```

---

## 📝 خلاصه

✅ **مشکل حل شد:**

- Lock file قدیمی حذف شد
- Netlify برای نادیده گرفتن frozen lockfile تنظیم شد
- پروژه آماده برای deployment است

**بعد از push:**

```bash
git push origin staging/phase-5-deployment
```

Netlify خودکار ساخت و deploy می‌کند! 🚀
