# دستورالعمل Push به GitHub

## وضعیت فعلی
- ✅ اکانت `Amirgh23` در Windows Credential Manager ذخیره شده است
- ✅ تغییرات commit شده‌اند
- ⚠️ node_modules به اشتباه commit شد (اما .gitignore اصلاح شده)

## مراحل ایجاد Repository جدید

### گزینه 1: استفاده از GitHub CLI (gh)
```bash
# ورود به GitHub
gh auth login

# ایجاد repository جدید
gh repo create rhuds-pro --public --description "RHUDS Pro - React HUD Design System with 50+ production-ready components"

# Push کردن
git remote add origin https://github.com/Amirgh23/rhuds-pro.git
git branch -M main
git push -u origin main
```

### گزینه 2: استفاده از Git مستقیم
```bash
# ایجاد repository از طریق وب GitHub
# سپس:
git remote add origin https://github.com/Amirgh23/rhuds-pro.git
git branch -M main
git push -u origin main
```

## نکات مهم

1. **اندازه Repository**: به دلیل وجود node_modules، اندازه repository خیلی بزرگ است (~500MB+)
2. **راه‌حل**: بعد از push اول، می‌توانید node_modules را از history پاک کنید:
   ```bash
   git filter-branch --tree-filter 'rm -rf node_modules' HEAD
   git push origin main --force
   ```

3. **یا بهتر**: یک repository تمیز ایجاد کنید:
   ```bash
   # حذف node_modules
   rm -rf node_modules
   rm -rf packages/*/node_modules
   
   # Commit جدید
   git add .
   git commit -m "chore: remove node_modules"
   git push
   ```

## اطلاعات Repository

- **نام**: rhuds-pro
- **توضیحات**: RHUDS Pro - React HUD Design System with 50+ production-ready components
- **مالک**: Amirgh23
- **نوع**: Public
- **لایسنس**: MIT

## README پیشنهادی

پروژه شامل یک README.md کامل است که شامل:
- معرفی پروژه
- نصب و راه‌اندازی
- مستندات کامپوننت‌ها
- مثال‌های استفاده
- لایسنس

## بعد از Push

1. تنظیم GitHub Pages برای دمو (اختیاری)
2. اضافه کردن Topics: `react`, `typescript`, `design-system`, `ui-components`, `hud`
3. اضافه کردن Description و Website URL
4. فعال کردن Issues و Discussions
