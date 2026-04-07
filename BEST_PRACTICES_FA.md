# بهترین روش‌ها و حل مشکلات - RHUDS Pro

**نسخه**: 1.0.0  
**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**سطح**: متوسط تا پیشرفته

---

## 📋 فهرست

- [بهترین روش‌های کد](#بهترین-روش‌های-کد)
- [عملکرد](#عملکرد)
- [دسترسی‌پذیری](#دسترسی‌پذیری)
- [امنیت](#امنیت)
- [حل مشکلات](#حل-مشکلات)
- [نکات مهم](#نکات-مهم)

---

## ✅ بهترین روش‌های کد

### 1. استفاده از TypeScript

❌ **غلط:**

```tsx
function MyComponent(props) {
  return <div>{props.title}</div>;
}
```

✅ **صحیح:**

```tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MyComponent({ title, onClick, disabled = false }: MyComponentProps) {
  return (
    <div onClick={onClick} aria-disabled={disabled}>
      {title}
    </div>
  );
}
```

### 2. استفاده از Hooks به درستی

❌ **غلط:**

```tsx
function MyComponent() {
  const [count, setCount] = useState(0);

  // Hook در شرط
  if (count > 0) {
    const [name, setName] = useState('');
  }

  return <div>{count}</div>;
}
```

✅ **صحیح:**

```tsx
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <div>
      {count}
      {name}
    </div>
  );
}
```

### 3. مدیریت State

❌ **غلط:**

```tsx
function MyComponent() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  // تغییر مستقیم
  user.name = 'علی';
  setUser(user);
}
```

✅ **صحیح:**

```tsx
function MyComponent() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  // تغییر صحیح
  setUser((prev) => ({
    ...prev,
    name: 'علی',
  }));
}
```

### 4. استفاده از useCallback

❌ **غلط:**

```tsx
function Parent() {
  const handleClick = () => {
    console.log('کلیک');
  };

  return <Child onClick={handleClick} />;
}
```

✅ **صحیح:**

```tsx
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    console.log('کلیک');
  }, []);

  return <Child onClick={handleClick} />;
}
```

### 5. استفاده از useMemo

❌ **غلط:**

```tsx
function MyComponent({ items }) {
  const filtered = items.filter((item) => item.active);

  return <div>{filtered.length}</div>;
}
```

✅ **صحیح:**

```tsx
import { useMemo } from 'react';

function MyComponent({ items }) {
  const filtered = useMemo(() => items.filter((item) => item.active), [items]);

  return <div>{filtered.length}</div>;
}
```

---

## ⚡ عملکرد

### 1. Code Splitting

❌ **غلط:**

```tsx
import * as Components from '@rhuds/components';

export function App() {
  return <Components.HudButton>دکمه</Components.HudButton>;
}
```

✅ **صحیح:**

```tsx
import { HudButton } from '@rhuds/components';

export function App() {
  return <HudButton>دکمه</HudButton>;
}
```

### 2. Lazy Loading

❌ **غلط:**

```tsx
import HeavyComponent from './HeavyComponent';

export function App() {
  return <HeavyComponent />;
}
```

✅ **صحیح:**

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>بارگذاری...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Image Optimization

❌ **غلط:**

```tsx
<img src="large-image.jpg" alt="تصویر" />
```

✅ **صحیح:**

```tsx
import { ResponsiveImage } from '@rhuds/components';

<ResponsiveImage src="image.jpg" alt="تصویر" width={800} height={600} loading="lazy" />;
```

### 4. Memoization

❌ **غلط:**

```tsx
function ListItem({ item }) {
  return <div>{item.name}</div>;
}

function List({ items }) {
  return items.map((item) => <ListItem key={item.id} item={item} />);
}
```

✅ **صحیح:**

```tsx
import { memo } from 'react';

const ListItem = memo(function ListItem({ item }) {
  return <div>{item.name}</div>;
});

function List({ items }) {
  return items.map((item) => <ListItem key={item.id} item={item} />);
}
```

---

## ♿ دسترسی‌پذیری

### 1. ARIA Labels

❌ **غلط:**

```tsx
<button>✕</button>
```

✅ **صحیح:**

```tsx
<button aria-label="بستن">✕</button>
```

### 2. Semantic HTML

❌ **غلط:**

```tsx
<div onClick={handleClick} role="button">
  کلیک کنید
</div>
```

✅ **صحیح:**

```tsx
<button onClick={handleClick}>کلیک کنید</button>
```

### 3. Keyboard Navigation

❌ **غلط:**

```tsx
<div onClick={handleClick}>عنصر تعاملی</div>
```

✅ **صحیح:**

```tsx
<div
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  role="button"
  tabIndex={0}
>
  عنصر تعاملی
</div>
```

### 4. Color Contrast

❌ **غلط:**

```tsx
<div style={{ color: '#cccccc', backgroundColor: '#ffffff' }}>متن کم‌تر</div>
```

✅ **صحیح:**

```tsx
<div style={{ color: '#333333', backgroundColor: '#ffffff' }}>متن واضح</div>
```

### 5. Form Labels

❌ **غلط:**

```tsx
<input type="text" placeholder="نام" />
```

✅ **صحیح:**

```tsx
<label htmlFor="name">نام:</label>
<input id="name" type="text" placeholder="نام" />
```

---

## 🔒 امنیت

### 1. XSS Prevention

❌ **غلط:**

```tsx
function MyComponent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

✅ **صحیح:**

```tsx
function MyComponent({ text }) {
  return <div>{text}</div>;
}
```

### 2. Input Validation

❌ **غلط:**

```tsx
function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // بدون تحقق
    submitForm(email);
  };
}
```

✅ **صحیح:**

```tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.includes('@')) {
      setError('ایمیل نامعتبر');
      return;
    }
    submitForm(email);
  };
}
```

### 3. Environment Variables

❌ **غلط:**

```tsx
const API_KEY = 'secret-key-12345';
const API_URL = 'https://api.example.com';
```

✅ **صحیح:**

```tsx
const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;
```

### 4. CSRF Protection

❌ **غلط:**

```tsx
fetch('/api/delete', {
  method: 'DELETE',
  body: JSON.stringify({ id: 123 }),
});
```

✅ **صحیح:**

```tsx
fetch('/api/delete', {
  method: 'DELETE',
  headers: {
    'X-CSRF-Token': getCsrfToken(),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ id: 123 }),
});
```

---

## 🐛 حل مشکلات

### مشکل 1: خطای "Cannot read property of undefined"

**علت:**

```tsx
function MyComponent({ user }) {
  return <div>{user.name}</div>; // user ممکن است undefined باشد
}
```

**حل:**

```tsx
function MyComponent({ user }) {
  if (!user) return <div>بارگذاری...</div>;
  return <div>{user.name}</div>;
}

// یا
function MyComponent({ user }) {
  return <div>{user?.name}</div>;
}
```

### مشکل 2: Infinite Loop در useEffect

**علت:**

```tsx
useEffect(() => {
  setData(fetchData());
}); // بدون dependency array
```

**حل:**

```tsx
useEffect(() => {
  setData(fetchData());
}, []); // dependency array خالی
```

### مشکل 3: Memory Leak

**علت:**

```tsx
useEffect(() => {
  const subscription = subscribe();
  // بدون cleanup
}, []);
```

**حل:**

```tsx
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### مشکل 4: Performance Issue

**علت:**

```tsx
function List({ items }) {
  return items.map((item) => (
    <div key={Math.random()}>{item.name}</div> // key غلط
  ));
}
```

**حل:**

```tsx
function List({ items }) {
  return items.map((item) => (
    <div key={item.id}>{item.name}</div> // key صحیح
  ));
}
```

### مشکل 5: State Update on Unmounted Component

**علت:**

```tsx
useEffect(() => {
  fetchData().then((data) => setData(data));
}, []);
```

**حل:**

```tsx
useEffect(() => {
  let isMounted = true;

  fetchData().then((data) => {
    if (isMounted) setData(data);
  });

  return () => {
    isMounted = false;
  };
}, []);
```

---

## 💡 نکات مهم

### 1. استفاده از Context به درستی

```tsx
// ایجاد Context
const ThemeContext = createContext();

// Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// استفاده
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme باید در ThemeProvider استفاده شود');
  }
  return context;
}
```

### 2. Error Boundary

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>خطایی رخ داد</div>;
    }
    return this.props.children;
  }
}
```

### 3. Custom Hooks

```tsx
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

### 4. Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('MyComponent', () => {
  it('باید دکمه را رندر کند', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('باید onClick را فراخوانی کند', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 5. Debugging

```tsx
// استفاده از React DevTools
// 1. نصب React DevTools extension
// 2. باز کردن DevTools (F12)
// 3. رفتن به Components tab
// 4. بررسی props و state

// استفاده از console
console.log('مقدار:', value);
console.table(data);
console.time('timer');
// کد
console.timeEnd('timer');
```

---

## 📊 Checklist

### قبل از Commit

- [ ] کد TypeScript است
- [ ] تمام تست‌ها pass می‌شوند
- [ ] ESLint خطایی ندارد
- [ ] Prettier فرمت‌شده است
- [ ] مستندات به‌روز شده است
- [ ] Performance بهتر نشده است

### قبل از Deployment

- [ ] تمام تست‌ها pass می‌شوند
- [ ] Build بدون خطا است
- [ ] Performance metrics خوب است
- [ ] Security scan pass می‌شود
- [ ] Accessibility test pass می‌شود
- [ ] مستندات کامل است

---

## 🔗 منابع مفید

- **[React Documentation](https://react.dev)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Web Accessibility](https://www.w3.org/WAI/)**
- **[OWASP Security](https://owasp.org/)**

---

**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**نسخه**: 1.0.0  
**وضعیت**: ✅ کامل
