# راهنمای استقرار - RHUDS Pro

**نسخه**: 1.0.0  
**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**سطح**: متوسط تا پیشرفته

---

## 📋 فهرست

- [آماده‌سازی](#آماده‌سازی)
- [استقرار محلی](#استقرار-محلی)
- [استقرار به Vercel](#استقرار-به-vercel)
- [استقرار به Netlify](#استقرار-به-netlify)
- [استقرار به AWS](#استقرار-به-aws)
- [استقرار به Docker](#استقرار-به-docker)
- [نظارت و مراقبت](#نظارت-و-مراقبت)
- [حل مشکلات](#حل-مشکلات)

---

## ✅ آماده‌سازی

### 1. بررسی پیش‌نیازها

```bash
# بررسی نسخه Node.js
node --version  # باید >= 18.0.0

# بررسی npm
npm --version   # باید >= 9.0.0

# بررسی Git
git --version
```

### 2. تنظیمات محیط

```bash
# ایجاد فایل .env.production
cp .env.example .env.production

# تنظیم متغیرهای محیط
REACT_APP_API_URL=https://api.production.com
REACT_APP_API_KEY=your-production-key
NODE_ENV=production
```

### 3. بررسی کیفیت کد

```bash
# اجرای تست‌ها
npm run test

# بررسی ESLint
npm run lint

# بررسی TypeScript
npm run type-check

# بررسی Security
npm audit
```

### 4. ساخت برای Production

```bash
# ساخت تمام پکیج‌ها
npm run build

# بررسی اندازه Bundle
npm run build:analyze

# تست Build محلی
npm run build:test
```

---

## 🏠 استقرار محلی

### استقرار بر روی سرور محلی

```bash
# نصب وابستگی‌ها
npm install

# ساخت برای production
npm run build

# اجرای سرور
npm run start

# یا استفاده از PM2
npm install -g pm2
pm2 start npm --name "rhuds-pro" -- start
pm2 save
pm2 startup
```

### استفاده از Nginx

```nginx
server {
    listen 80;
    server_name rhuds.local;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🚀 استقرار به Vercel

### روش 1: از طریق CLI

```bash
# نصب Vercel CLI
npm install -g vercel

# ورود به Vercel
vercel login

# استقرار
vercel

# استقرار به Production
vercel --prod
```

### روش 2: از طریق GitHub

1. Push کردن کد به GitHub
2. رفتن به [vercel.com](https://vercel.com)
3. کلیک بر "New Project"
4. انتخاب مخزن GitHub
5. تنظیم متغیرهای محیط
6. کلیک بر "Deploy"

### تنظیمات Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_API_KEY": "@react_app_api_key"
  }
}
```

---

## 🌐 استقرار به Netlify

### روش 1: از طریق CLI

```bash
# نصب Netlify CLI
npm install -g netlify-cli

# ورود به Netlify
netlify login

# استقرار
netlify deploy

# استقرار به Production
netlify deploy --prod
```

### روش 2: از طریق GitHub

1. رفتن به [netlify.com](https://netlify.com)
2. کلیک بر "New site from Git"
3. انتخاب GitHub
4. انتخاب مخزن
5. تنظیم Build settings
6. کلیک بر "Deploy site"

### تنظیمات Netlify

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  REACT_APP_API_URL = "https://api.production.com"
  REACT_APP_API_KEY = "your-key"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ☁️ استقرار به AWS

### استقرار به S3 + CloudFront

```bash
# نصب AWS CLI
npm install -g aws-cli

# تنظیم AWS credentials
aws configure

# ساخت برای production
npm run build

# آپلود به S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### استقرار به EC2

```bash
# اتصال به EC2
ssh -i your-key.pem ec2-user@your-instance-ip

# نصب Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone مخزن
git clone https://github.com/your-repo.git
cd rhuds-pro

# نصب وابستگی‌ها
npm install

# ساخت
npm run build

# اجرای سرور
npm start
```

### استقرار به Elastic Beanstalk

```bash
# نصب EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 rhuds-pro

# ایجاد environment
eb create rhuds-pro-env

# Deploy
eb deploy

# مشاهده logs
eb logs
```

---

## 🐳 استقرار به Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  rhuds-pro:
    build: .
    ports:
      - '3000:3000'
    environment:
      - REACT_APP_API_URL=http://api:5000
      - NODE_ENV=production
    depends_on:
      - api

  api:
    image: your-api-image
    ports:
      - '5000:5000'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/rhuds

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=rhuds
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### استقرار Docker

```bash
# ساخت image
docker build -t rhuds-pro:latest .

# اجرای container
docker run -p 3000:3000 rhuds-pro:latest

# استفاده از docker-compose
docker-compose up -d

# مشاهده logs
docker-compose logs -f

# توقف
docker-compose down
```

---

## 📊 نظارت و مراقبت

### نظارت عملکرد

```bash
# استفاده از PM2 Monitoring
pm2 monit

# استفاده از New Relic
npm install newrelic
# اضافه کردن در app.js
require('newrelic');

# استفاده از Datadog
npm install dd-trace
```

### Logging

```bash
# استفاده از Winston
npm install winston

# استفاده از Pino
npm install pino

# استفاده از Bunyan
npm install bunyan
```

### Health Checks

```tsx
// health-check.ts
export async function healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
}
```

### Backup و Recovery

```bash
# Backup database
pg_dump -U user -d rhuds > backup.sql

# Restore database
psql -U user -d rhuds < backup.sql

# Backup files
tar -czf backup.tar.gz dist/
```

---

## 🔧 حل مشکلات

### مشکل 1: Build ناموفق

```bash
# حل
npm run clean
npm install
npm run build

# بررسی خطاها
npm run build -- --verbose
```

### مشکل 2: Memory Leak

```bash
# بررسی memory usage
node --inspect app.js

# استفاده از Chrome DevTools
# chrome://inspect
```

### مشکل 3: Slow Performance

```bash
# بررسی bundle size
npm run build:analyze

# بررسی performance
npm run lighthouse

# بررسی database queries
npm run profile
```

### مشکل 4: Database Connection

```bash
# بررسی connection
psql -U user -d rhuds -c "SELECT 1"

# بررسی logs
tail -f /var/log/postgresql/postgresql.log
```

### مشکل 5: SSL Certificate

```bash
# استفاده از Let's Encrypt
sudo certbot certonly --standalone -d rhuds.com

# تجدید certificate
sudo certbot renew
```

---

## 📋 Checklist استقرار

### قبل از استقرار

- [ ] تمام تست‌ها pass می‌شوند
- [ ] Build بدون خطا است
- [ ] متغیرهای محیط تنظیم شده‌اند
- [ ] Database migrations اجرا شده‌اند
- [ ] Security scan pass می‌شود
- [ ] Performance metrics خوب است
- [ ] Backup تهیه شده است

### حین استقرار

- [ ] Health checks فعال هستند
- [ ] Monitoring فعال است
- [ ] Logs ثبت می‌شوند
- [ ] Alerts تنظیم شده‌اند
- [ ] Rollback plan آماده است

### بعد از استقرار

- [ ] سایت accessible است
- [ ] تمام ویژگی‌ها کار می‌کنند
- [ ] Performance acceptable است
- [ ] Errors نیستند
- [ ] Users می‌توانند login کنند
- [ ] Database queries سریع هستند

---

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install
        run: npm install

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm run deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### GitLab CI

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm run test

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - npm run deploy
  only:
    - main
```

---

## 📞 پشتیبانی

- **Issues**: [GitHub Issues](https://github.com/rhuds/rhuds-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rhuds/rhuds-pro/discussions)
- **Email**: deploy@rhuds.dev

---

**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**نسخه**: 1.0.0  
**وضعیت**: ✅ کامل
