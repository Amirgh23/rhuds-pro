# 🚀 RHUDS - Execution Guide

## ⚠️ Important: Dependencies Required

The RHUDS project requires dependencies to be installed before running. Follow these steps:

---

## 📋 Step-by-Step Execution

### Step 1: Install Dependencies (Required)

```bash
npm install
```

**What this does:**
- Installs all npm packages
- Sets up the monorepo
- Prepares all 6 packages (core, hooks, utils, sfx, storybook, demo-app)
- Takes 2-5 minutes depending on internet speed

**Expected output:**
```
added XXX packages in X.XXs
```

### Step 2: Run the Demo App

```bash
npm run demo
```

**Or manually:**
```bash
cd packages/demo-app
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open in Browser

Visit: **http://localhost:5173**

You should see the RHUDS demo app with:
- 🎨 All 20 components
- 🎬 Animations
- 🔊 Sound effects
- 🎨 Theme switcher
- 📱 Responsive design

---

## 🎯 Alternative: View Storybook

Instead of the demo app, you can view component documentation:

```bash
npm run storybook
```

**Expected output:**
```
Storybook 7.x.x started
➜ Local:   http://localhost:6006/
```

Visit: **http://localhost:6006**

---

## 🧪 Alternative: Run Tests

To verify everything works:

```bash
npm run test
```

**Expected output:**
```
PASS  packages/core/src/components/Button/Button.test.tsx
PASS  packages/core/src/components/Input/Input.test.tsx
...
Test Suites: XX passed, XX total
Tests:       XXX passed, XXX total
```

---

## 🏗️ Alternative: Build for Production

To create optimized production builds:

```bash
npm run build
```

**Expected output:**
```
✓ built in XXXms
dist/
├── core/
├── hooks/
├── utils/
└── sfx/
```

---

## 🛠️ Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Port 5173 already in use
**Solution:** Use a different port:
```bash
cd packages/demo-app
npm run dev -- --port 3000
```

### Issue: "vite: command not found"
**Solution:** Dependencies not installed. Run:
```bash
npm install
```

### Issue: TypeScript errors
**Solution:** Install type definitions:
```bash
npm install --save-dev @types/jest @types/node @types/react @types/react-dom
```

---

## 📊 Complete Command Reference

| Task | Command | Time | Output |
|------|---------|------|--------|
| **Install** | `npm install` | 2-5 min | Dependencies installed |
| **Demo App** | `npm run demo` | Instant | http://localhost:5173 |
| **Storybook** | `npm run storybook` | Instant | http://localhost:6006 |
| **Tests** | `npm run test` | 1-2 min | Test results |
| **Build** | `npm run build` | 1-2 min | dist/ folder |
| **Lint** | `npm run lint` | 30 sec | Code quality report |
| **Format** | `npm run format` | 30 sec | Code formatted |

---

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] `npm install` completes successfully
- [ ] `npm run demo` starts without errors
- [ ] Browser opens to http://localhost:5173
- [ ] Demo app displays all components
- [ ] Theme switcher works
- [ ] Sound effects play
- [ ] Animations visible
- [ ] Responsive design works

---

## 🎉 Success Indicators

You'll know it's working when you see:

1. **Demo App Running**
   - Vite dev server started
   - Local URL displayed
   - No errors in console

2. **Components Visible**
   - All 20 components displayed
   - Themes switchable
   - Animations smooth
   - Sound effects working

3. **No Errors**
   - No red error messages
   - No console errors
   - All features functional

---

## 📚 Next Steps After Running

1. **Explore Components** - Click through all 20 components
2. **Switch Themes** - Try all 5 theme modes
3. **Test Animations** - Hover over components to see animations
4. **Test Sound Effects** - Click buttons to hear sound effects
5. **View Storybook** - Run `npm run storybook` for documentation
6. **Run Tests** - Run `npm run test` to verify quality
7. **Build for Production** - Run `npm run build` for deployment

---

## 🚀 Quick Start Summary

```bash
# 1. Install (one time only)
npm install

# 2. Run demo app
npm run demo

# 3. Open browser
# Visit: http://localhost:5173

# 4. Explore and enjoy!
```

---

## 📞 Need Help?

1. **Check Documentation** - Read START_HERE.md
2. **View Storybook** - Run `npm run storybook`
3. **Review Tests** - Check test files for examples
4. **Check Demo App** - See real-world implementation

---

## ✨ You're Ready!

The RHUDS design system is complete and ready to use. Follow the steps above to get it running.

**Happy coding!** 🎨✨

---

**RHUDS v0.1.0** - Production Ready ✅
