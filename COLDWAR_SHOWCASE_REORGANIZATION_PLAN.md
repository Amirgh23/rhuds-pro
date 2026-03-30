# Cold War Showcase Reorganization Plan

## هدف

بازسازی `ColdWarShowcase.tsx` به ساختار تب‌بندی شده مشابه `ShowcasePage.tsx` برای بهبود UX و سازماندهی بهتر 96 کامپوننت

## ساختار فعلی

- یک صفحه طولانی 2234 خطی
- تمام کامپوننت‌ها در یک صفحه بدون دسته‌بندی
- سخت برای navigate کردن

## ساختار جدید (9 تب)

### Tab 1: Buttons & Inputs

**کامپوننت‌ها (22):**

- Buttons (10): ColdWarButton, ColdWarHudButton, ColdWarGlitchButton, ColdWarNeonButton, ColdWarGridButton, ColdWarFingerprintButton, ColdWarGlitchHoverButton, ColdWarSliderButton, ColdWarSubscribeButton, ColdWarBorderButton
- Inputs (12): ColdWarInput, ColdWarSearchInput, ColdWarHackerInput, ColdWarAiInput, ColdWarHoloInput, ColdWarHoloInputAdvanced, ColdWarFuturisticInput, ColdWarBashInput, ColdWarFloatingInput, ColdWarAccessInput, ColdWarFriendInput, ColdWarCodeInput

### Tab 2: Form Controls

**کامپوننت‌ها (16):**

- Checkboxes (6): ColdWarCheckbox, ColdWarHoloCheckbox, ColdWarCyberpunkCheckbox, ColdWarBubbleCheckbox, ColdWarNeonCheckbox, ColdWarGlowingCheckbox
- Radios (4): ColdWarRadio, ColdWarGlitchRadio, ColdWarCyberpunkRadio, ColdWarNeonRadio
- Switches (4): ColdWarSwitch, ColdWarToggleSwitch, ColdWarCyberpunkToggle, ColdWarLockSwitch
- Sliders (2): ColdWarSlider, ColdWarNeonSlider

### Tab 3: Layout & Cards

**کامپوننت‌ها (10):**

- Layout (5): ColdWarHudBox, ColdWarGrid, ColdWarStack, ColdWarHudFrame, ColdWarGlitchFrame
- Cards (5): ColdWarCard, ColdWarCyberCard, ColdWarGlassCard, ColdWarThermostatCard, ColdWarProfileCard

### Tab 4: Data Display

**کامپوننت‌ها (9):**

- ColdWarTerminalSelector
- ColdWarNotificationCard
- ColdWarHudNotificationCard
- ColdWarMediaPlayer
- ColdWarAmplifier
- ColdWarRadar
- ColdWarPipBoy
- ColdWarTable
- ColdWarDataGrid

### Tab 5: Navigation

**کامپوننت‌ها (5):**

- ColdWarTabs
- ColdWarPagination
- ColdWarBreadcrumb
- ColdWarSidebar
- ColdWarMenu

### Tab 6: Feedback & Loaders

**کامپوننت‌ها (17):**

- Feedback (5): ColdWarModal, ColdWarAlert, ColdWarDialog, ColdWarNotification, ColdWarToast
- Loaders (12): ColdWarProgressBar, ColdWarAbstergoLoader, ColdWarHeartRateLoader, ColdWarHackerLoader, ColdWarBinaryLoader, ColdWarCubeLoader, ColdWarProgressLoader, ColdWarBinaryHackerLoader, ColdWarMatrixLoader, ColdWarScrollingLoader, ColdWarLoadingText, ColdWarWaveLoader

### Tab 7: Advanced

**کامپوننت‌ها (5):**

- ColdWarCodeEditor
- ColdWarRichEditor
- ColdWarAccordion
- ColdWarCarousel
- ColdWarStepper

### Tab 8: Utility & Specialized

**کامپوننت‌ها (7):**

- Utility (4): ColdWarTooltip, ColdWarPopover, ColdWarDropdown, ColdWarSupportTooltip
- Specialized (3): ColdWarDatePicker, ColdWarColorPicker, ColdWarFileUpload

### Tab 9: Visualization & Forms

**کامپوننت‌ها (5):**

- Visualization (2): ColdWarChart, ColdWarBubbleChart
- Forms (3): ColdWarLoginForm, ColdWarCyberLoginForm, ColdWarAnimatedLoginForm

## تغییرات مورد نیاز

### 1. اضافه کردن state برای activeTab

```typescript
const [activeTab, setActiveTab] = React.useState(0);
```

### 2. اضافه کردن useEffect برای scroll to top

```typescript
React.useEffect(() => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, [activeTab]);
```

### 3. ایجاد ComponentSection helper

```typescript
const ComponentSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div
    style={{
      padding: '24px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '4px',
      border: '1px solid var(--cw-color-primary)',
      backdropFilter: 'blur(10px)',
      marginBottom: '24px',
    }}
  >
    <h3
      style={{
        marginBottom: '16px',
        color: 'var(--cw-color-primary)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '1.1rem',
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);
```

### 4. ایجاد tabItems array

```typescript
const tabItems = [
  { label: 'Buttons & Inputs', content: <Tab1Content /> },
  { label: 'Form Controls', content: <Tab2Content /> },
  { label: 'Layout & Cards', content: <Tab3Content /> },
  { label: 'Data Display', content: <Tab4Content /> },
  { label: 'Navigation', content: <Tab5Content /> },
  { label: 'Feedback & Loaders', content: <Tab6Content /> },
  { label: 'Advanced', content: <Tab7Content /> },
  { label: 'Utility & Specialized', content: <Tab8Content /> },
  { label: 'Visualization & Forms', content: <Tab9Content /> },
];
```

### 5. رندر کردن Tab Navigation

```typescript
<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
  {tabItems.map((item, index) => (
    <ColdWarButton
      key={index}
      theme={theme}
      variant={activeTab === index ? 'primary' : 'secondary'}
      onClick={() => setActiveTab(index)}
    >
      {item.label}
    </ColdWarButton>
  ))}
</div>
```

### 6. رندر کردن Tab Content

```typescript
<div style={{ padding: '24px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
  {tabItems[activeTab].content}
</div>
```

## مزایای ساختار جدید

1. **سازماندهی بهتر**: کامپوننت‌ها به دسته‌های منطقی تقسیم شده‌اند
2. **Navigation آسان‌تر**: کاربران می‌توانند سریع به دسته مورد نظر بروند
3. **Performance بهتر**: فقط کامپوننت‌های تب فعال رندر می‌شوند
4. **UX بهتر**: مشابه RHUDS Showcase که کاربران با آن آشنا هستند
5. **Maintainability**: اضافه کردن کامپوننت‌های جدید آسان‌تر است

## مراحل پیاده‌سازی

1. ✅ اضافه کردن activeTab state
2. ✅ اضافه کردن scroll to top effect
3. ⏳ ایجاد ComponentSection helper
4. ⏳ تقسیم محتوای فعلی به 9 تب
5. ⏳ ایجاد tab navigation UI
6. ⏳ تست تمام تب‌ها
7. ⏳ بررسی responsive بودن

## نکات مهم

- تمام state management موجود حفظ شود
- Theme selector در بالای صفحه باقی بماند
- TacticalMotionBackground و ColdWarContextMenu حفظ شوند
- تمام 96 کامپوننت باید در تب‌ها گنجانده شوند
- هر تب باید ComponentSection برای هر گروه کامپوننت داشته باشد

## جمع کل کامپوننت‌ها

- Tab 1: 22 کامپوننت
- Tab 2: 16 کامپوننت
- Tab 3: 10 کامپوننت
- Tab 4: 9 کامپوننت
- Tab 5: 5 کامپوننت
- Tab 6: 17 کامپوننت
- Tab 7: 5 کامپوننت
- Tab 8: 7 کامپوننت
- Tab 9: 5 کامپوننت
  **جمع: 96 کامپوننت** ✅
