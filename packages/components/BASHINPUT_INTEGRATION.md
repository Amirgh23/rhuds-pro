# خلاصه یکپارچگی BashInput

## جزئیات کامپوننت

**نام**: BashInput  
**دسته**: کامپوننت‌های ورودی  
**مکان**: `packages/components/src/Input/BashInput.tsx`  
**صادرات**: صادرات پیش‌فرض + صادرات نوع

## چک‌لیست یکپارچگی

✅ فایل کامپوننت ایجاد شد: `packages/components/src/Input/BashInput.tsx`  
✅ صادرات به `packages/components/src/index.ts` اضافه شد  
✅ به ComponentLibrary Playground اضافه شد  
✅ به ShowcasePage اضافه شد  
✅ راهنمای مستندات ایجاد شد: `BASHINPUT_GUIDE.md`  
✅ خلاصه یکپارچگی ایجاد شد: `BASHINPUT_INTEGRATION.md`

## فایل‌های تغییر یافته

1. **packages/components/src/index.ts**
   - اضافه شد: `export { default as BashInput } from './Input/BashInput';`
   - اضافه شد: `export type { BashInputProps } from './Input/BashInput';`

2. **packages/demo-app/src/pages/playground/ComponentLibrary.tsx**
   - ورودی BashInput به آرایه COMPONENTS اضافه شد
   - دسته: Input
   - نمونه کد: `<BashInput placeholder="sudo uiverse or wot" onChange={(value) => console.log(value)} />`

3. **packages/demo-app/src/pages/ShowcasePage.tsx**
   - اضافه شد import: `BashInput`
   - اضافه شد state: `const [bashInputValue, setBashInputValue] = useState('');`
   - بخش اضافه شد: "BashInput (terminal-style bash prompt)"

## Props کامپوننت

```typescript
interface BashInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  userColor?: string;
  vmColor?: string;
  charColor?: string;
  textColor?: string;
  backgroundColor?: string;
  className?: string;
}
```

## ویژگی‌های کلیدی

- **سبک ترمینال**: طراحی مشابه ترمینال Bash واقعی
- **رنگ‌های قابل تنظیم**: تمام بخش‌های رنگی قابل سفارشی‌سازی
- **کنترل مقدار**: پشتیبانی از controlled input
- **رویدادهای تغییر**: callback برای تغییرات ورودی
- **فونت Monospace**: استفاده از Courier New برای ظاهر ترمینال

## یکپارچگی Showcase

کامپوننت در ShowcasePage با:

- مقدار ورودی قابل کنترل
- رنگ‌های پیش‌فرض
- placeholder سفارشی
- تراز‌شدگی مرکزی

## مستندات

- **BASHINPUT_GUIDE.md**: راهنمای استفاده کامل با نمونه‌ها
- **BASHINPUT_INTEGRATION.md**: این فایل - خلاصه یکپارچگی

## آزمایش

برای تأیید یکپارچگی:

1. بررسی رندر کامپوننت در Playground
2. تأیید عملکرد ورودی در Showcase
3. آزمایش تغییر مقدار
4. تأیید رنگ‌های پیش‌فرض
5. آزمایش رنگ‌های سفارشی

## مراحل بعدی

کامپوننت BashInput به طور کامل یکپارچه شده و آماده استفاده است. از همان الگوی GridPatternButton، FingerprintButton، CyberpunkCheckbox و HackerLoaderBinary پیروی می‌کند با:

- سفارشی‌سازی کامل رنگ از طریق props
- یکپارچگی در Playground و Showcase
- مستندات جامع
- نمایش‌های متعدد در Showcase
