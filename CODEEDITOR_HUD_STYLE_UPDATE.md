# CodeEditor HUD Style Update ✅

## به‌روزرسانی CodeEditor به استایل HUD

CodeEditor با استایل HUD، titlebar با دکمه‌های window control و رنگ‌بندی syntax highlighting جدید به‌روزرسانی شد.

## 🎨 تغییرات اصلی

### قبل
- استایل ساده با border
- بدون titlebar
- رنگ‌بندی ساده
- استفاده از theme context

### بعد
- استایل HUD با رنگ بنفش (#c042ff)
- Titlebar با دکمه‌های minimize, maximize, close
- رنگ‌بندی syntax highlighting پیشرفته
- Background تیره (#15001f)
- استفاده از styled-components

## ✨ ویژگی‌های جدید

### Titlebar
- Background: #2e0043
- دکمه‌های window control:
  - Minimize: خط افقی
  - Maximize: مربع
  - Close: X (hover: قرمز)
- عنوان قابل سفارشی‌سازی

### رنگ‌بندی Syntax Highlighting
```css
.curlies { color: #ff0000; }      /* {} - قرمز */
.sc { color: #e600ff; }            /* ; - بنفش */
.rounds { color: #ffffff; }        /* () - سفید */
.operator { color: #ffff00; }      /* +-*/= - زرد */
.keyword { color: #ff4284; }       /* const, let, if - صورتی */
.string { color: #22ff00; }        /* "text" - سبز */
.function { color: #4281ff; }      /* function() - آبی */
.variable { color: #ffae00; }      /* var - نارنجی */
.number { color: #ffffff; }        /* 123 - سفید */
.comment { color: #808080; }       /* // comment - خاکستری */
```

### Props جدید
- `title`: عنوان editor (پیش‌فرض: "Code Editor")
- `language`: پشتیبانی از cpp اضافه شد

## 📝 نحوه استفاده

```tsx
import { CodeEditor } from '@rhuds/components';

function MyComponent() {
  const [code, setCode] = useState(`const hello = "world";
console.log(hello);`);

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="javascript"
      title="My Code Editor"
      height={400}
      showLineNumbers={true}
    />
  );
}
```

## 🎯 ویژگی‌های حفظ شده

✅ Line numbers
✅ Syntax highlighting
✅ Tab support (2 spaces)
✅ Read-only mode
✅ Custom height
✅ onChange callback
✅ Multiple languages

## 🎨 استایل HUD

### Background Colors
- Card: #15001f (بنفش تیره)
- Titlebar: #2e0043 (بنفش متوسط)
- Line numbers: #1a0026 (بنفش خیلی تیره)

### Border Colors
- Main border: #c042ff (بنفش روشن)
- Line numbers border: #c042ff

### Text Colors
- Main text: #bafff8 (فیروزه‌ای روشن)
- Caret: #bafff8

## 📊 مقایسه قبل و بعد

| ویژگی | قبل | بعد |
|-------|-----|-----|
| استایل | ساده | HUD |
| Titlebar | ❌ | ✅ |
| Window controls | ❌ | ✅ |
| رنگ‌بندی | ساده | پیشرفته |
| Background | Theme-based | #15001f |
| Border | Theme-based | #c042ff |
| حس | مدرن | Retro/Terminal |

## 🚀 بهبودها

✅ ظاهر HUD فوتوریستیک
✅ Window controls تعاملی
✅ رنگ‌بندی syntax بهتر
✅ Titlebar قابل سفارشی‌سازی
✅ سازگار با تم HUD پروژه
✅ حس terminal/IDE واقعی

## 📁 فایل‌های تغییر یافته

- `packages/components/src/Advanced/CodeEditor.tsx` - بازنویسی کامل با styled-components

## ✅ تست‌ها

- ✅ بدون خطای TypeScript
- ✅ Syntax highlighting کار می‌کند
- ✅ Line numbers نمایش داده می‌شود
- ✅ Tab support فعال است
- ✅ onChange callback کار می‌کند

## 🎯 نتیجه

CodeEditor حالا با استایل HUD، titlebar با دکمه‌های window control و رنگ‌بندی syntax highlighting پیشرفته آماده است! 🚀
