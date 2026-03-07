# PipBoy Component - Usage Guide

## Overview

The `PipBoy` component is a Fallout-inspired terminal interface with CRT effects, three interactive tabs (STAT/INV/DATA), and a retro-futuristic design. All displayed information is controlled through a single `data` prop object.

---

## Installation

```bash
npm install @rhuds/components
```

---

## Data Object Structure (IMPORTANT!)

The component is driven by a `data` prop that contains all information displayed across the three tabs. Understanding this structure is crucial for proper usage.

### Complete TypeScript Interface

```typescript
// Inventory item structure
interface InventoryItem {
  name: string;        // Item name (e.g., "Stimpak", "Laser Rifle")
  weight: number;      // Item weight in pounds (e.g., 0.5, 4.0)
  quantity?: number;   // Optional: stack quantity (e.g., 12)
}

// Main data object structure
interface PipBoyData {
  // ========== STAT TAB ==========
  hp: { 
    current: number;   // Current health points
    max: number;       // Maximum health points
  };
  ap: { 
    current: number;   // Current action points
    max: number;       // Maximum action points
  };
  time: string;        // Time in "HH:MM" format (e.g., "14:23")
  date: string;        // Date in "MM.DD.YYYY" format (e.g., "03.05.2026")
  rads: number;        // Radiation level (currently not displayed but available)
  
  // ========== INV TAB ==========
  inventory: InventoryItem[];  // Array of inventory items
  
  // ========== DATA TAB ==========
  radarStatus: string;  // Status text below radar (e.g., "SIGNAL DETECTED")
  targets?: number;     // Optional: number of targets (shows blip if > 0)
}
```

---

## Basic Usage Examples

### Example 1: Minimal Usage (Default Data)

```tsx
import { PipBoy } from '@rhuds/components';

function App() {
  return <PipBoy />;
}
```

### Example 2: Custom Color Only

```tsx
<PipBoy color="#00f6ff" />
```

### Example 3: Complete Custom Data

```tsx
import { PipBoy } from '@rhuds/components';

function GameInterface() {
  // Define your data object
  const playerData = {
    // STAT Tab Data
    hp: { current: 420, max: 500 },
    ap: { current: 85, max: 100 },
    time: '14:23',
    date: '03.05.2026',
    rads: 15,
    
    // INV Tab Data
    inventory: [
      { name: 'Med-X', weight: 0.3, quantity: 8 },
      { name: 'Laser Rifle', weight: 5.5 },
      { name: 'Fusion Cell', weight: 0.1, quantity: 120 },
      { name: 'Stealth Boy', weight: 1.0, quantity: 2 },
      { name: 'Nuka-Cola', weight: 1.0, quantity: 5 },
    ],
    
    // DATA Tab Data
    radarStatus: 'SIGNAL DETECTED',
    targets: 3,
  };

  return <PipBoy color="#1aff40" data={playerData} />;
}
```

---

## Data Object Properties - Detailed Breakdown

### 📊 STAT Tab Properties

| Property | Type | Required | Example | Description |
|----------|------|----------|---------|-------------|
| `hp.current` | `number` | ✅ Yes | `420` | Current health points |
| `hp.max` | `number` | ✅ Yes | `500` | Maximum health points |
| `ap.current` | `number` | ✅ Yes | `85` | Current action points |
| `ap.max` | `number` | ✅ Yes | `100` | Maximum action points |
| `time` | `string` | ✅ Yes | `"14:23"` | Time in HH:MM format |
| `date` | `string` | ✅ Yes | `"03.05.2026"` | Date in MM.DD.YYYY format |
| `rads` | `number` | ✅ Yes | `15` | Radiation level |

**Example STAT Data:**
```typescript
{
  hp: { current: 348, max: 450 },
  ap: { current: 67, max: 67 },
  time: '08:40',
  date: '02.23.2026',
  rads: 0,
}
```

### 🎒 INV Tab Properties

| Property | Type | Required | Example | Description |
|----------|------|----------|---------|-------------|
| `inventory` | `InventoryItem[]` | ✅ Yes | See below | Array of items |
| `inventory[].name` | `string` | ✅ Yes | `"Stimpak"` | Item name |
| `inventory[].weight` | `number` | ✅ Yes | `0.5` | Item weight |
| `inventory[].quantity` | `number` | ❌ No | `12` | Stack quantity (optional) |

**Example INV Data:**
```typescript
{
  inventory: [
    { name: 'Stimpak', weight: 0.5, quantity: 12 },      // Shows: "Stimpak (12)"
    { name: '10mm Pistol', weight: 4.0 },                // Shows: "10mm Pistol"
    { name: 'Nuka-Cola Quantum', weight: 1.0 },          // Single item
    { name: 'RadAway', weight: 0.5, quantity: 5 },       // Shows: "RadAway (5)"
    { name: 'Power Armor Core', weight: 3.0 },           // Single item
  ]
}
```

### 📡 DATA Tab Properties

| Property | Type | Required | Example | Description |
|----------|------|----------|---------|-------------|
| `radarStatus` | `string` | ✅ Yes | `"SIGNAL DETECTED"` | Status text below radar |
| `targets` | `number` | ❌ No | `3` | Number of targets (shows blip if > 0) |

**Example DATA Data:**
```typescript
{
  radarStatus: 'SEARCHING SATELLITE...',
  targets: 1,  // If > 0, shows animated blip on radar
}
```

---

## Props API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PipBoyData` | Default data object | **Main prop**: Contains all display data |
| `color` | `string` | `'#1aff40'` | Primary UI color (phosphor green) |
| `className` | `string` | `undefined` | Additional CSS class |

---

## Real-World Usage Examples

### Example 1: Static Game Data

```tsx
import { PipBoy } from '@rhuds/components';

function GameUI() {
  const gameData = {
    hp: { current: 75, max: 100 },
    ap: { current: 30, max: 80 },
    time: '16:45',
    date: '11.15.2026',
    rads: 25,
    inventory: [
      { name: 'Bandage', weight: 0.2, quantity: 5 },
      { name: 'Water Bottle', weight: 1.0, quantity: 3 },
      { name: 'Flashlight', weight: 0.8 },
      { name: 'Canned Food', weight: 0.5, quantity: 7 },
    ],
    radarStatus: 'SCANNING AREA...',
    targets: 2,
  };

  return <PipBoy data={gameData} color="#1aff40" />;
}
```

### Example 2: Dynamic Data with State

```tsx
import { PipBoy } from '@rhuds/components';
import { useState, useEffect } from 'react';

function LiveCharacterScreen() {
  const [playerData, setPlayerData] = useState({
    hp: { current: 100, max: 100 },
    ap: { current: 50, max: 50 },
    time: '00:00',
    date: '01.01.2077',
    rads: 0,
    inventory: [
      { name: 'Stimpak', weight: 0.5, quantity: 3 },
    ],
    radarStatus: 'OFFLINE',
    targets: 0,
  });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPlayerData(prev => ({
        ...prev,
        time: now.toTimeString().slice(0, 5),
        date: now.toLocaleDateString('en-US').replace(/\//g, '.'),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate taking damage
  const takeDamage = (amount: number) => {
    setPlayerData(prev => ({
      ...prev,
      hp: { 
        ...prev.hp, 
        current: Math.max(0, prev.hp.current - amount) 
      }
    }));
  };

  // Add item to inventory
  const addItem = (item: InventoryItem) => {
    setPlayerData(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }));
  };

  return <PipBoy data={playerData} />;
}
```

### Example 3: Fetching Data from API

```tsx
import { PipBoy, PipBoyData } from '@rhuds/components';
import { useState, useEffect } from 'react';

function ServerMonitor() {
  const [serverData, setServerData] = useState<PipBoyData | null>(null);

  useEffect(() => {
    // Fetch from your API
    fetch('/api/server-status')
      .then(res => res.json())
      .then(apiData => {
        // Transform API response to PipBoy data format
        const pipboyData: PipBoyData = {
          hp: { 
            current: apiData.cpu_usage, 
            max: 100 
          },
          ap: { 
            current: apiData.memory_available, 
            max: apiData.memory_total 
          },
          time: new Date().toTimeString().slice(0, 5),
          date: new Date().toLocaleDateString('en-US').replace(/\//g, '.'),
          rads: apiData.temperature,
          inventory: apiData.running_processes.map(proc => ({
            name: proc.name,
            weight: proc.memory_mb / 100,
            quantity: proc.thread_count,
          })),
          radarStatus: apiData.network_status,
          targets: apiData.active_connections,
        };
        
        setServerData(pipboyData);
      });
  }, []);

  if (!serverData) return <div>Loading...</div>;

  return <PipBoy data={serverData} color="#00f6ff" />;
}
```

---

## Default Data Object

If you don't provide a `data` prop, the component uses this default data:

```typescript
{
  hp: { current: 348, max: 450 },
  ap: { current: 67, max: 67 },
  time: '08:40',
  date: '02.23.2026',
  rads: 0,
  inventory: [
    { name: 'Stimpak', weight: 0.5, quantity: 12 },
    { name: '10mm Pistol', weight: 4.0 },
    { name: 'Nuka-Cola Quantum', weight: 1.0 },
    { name: 'RadAway', weight: 0.5, quantity: 5 },
    { name: 'Power Armor Core', weight: 3.0 },
  ],
  radarStatus: 'SEARCHING SATELLITE...',
  targets: 1,
}
```

---

## Color Customization

```tsx
// Classic phosphor green (default)
<PipBoy data={myData} color="#1aff40" />

// Cyan/Blue theme
<PipBoy data={myData} color="#00f6ff" />

// Amber/Orange theme
<PipBoy data={myData} color="#ffaa00" />

// Red alert theme
<PipBoy data={myData} color="#ff0000" />
```

---

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { 
  PipBoy, 
  PipBoyProps, 
  PipBoyData, 
  InventoryItem 
} from '@rhuds/components';

// Type-safe data object
const myData: PipBoyData = {
  hp: { current: 100, max: 100 },
  ap: { current: 50, max: 50 },
  time: '12:00',
  date: '01.01.2077',
  rads: 0,
  inventory: [
    { name: 'Item', weight: 1.0, quantity: 5 }
  ],
  radarStatus: 'ONLINE',
  targets: 0,
};

// Type-safe component
const MyComponent: React.FC = () => {
  return <PipBoy data={myData} />;
};
```

---

## Common Data Object Patterns

### Pattern 1: Empty Inventory
```typescript
const emptyData = {
  hp: { current: 100, max: 100 },
  ap: { current: 50, max: 50 },
  time: '00:00',
  date: '01.01.2077',
  rads: 0,
  inventory: [],  // Empty array = no items shown
  radarStatus: 'NO SIGNAL',
  targets: 0,
};
```

### Pattern 2: Critical Health
```typescript
const criticalData = {
  hp: { current: 15, max: 100 },  // Low health
  ap: { current: 5, max: 50 },    // Low AP
  time: '23:59',
  date: '12.31.2077',
  rads: 85,  // High radiation
  inventory: [
    { name: 'Stimpak', weight: 0.5, quantity: 1 },  // Last stimpak!
  ],
  radarStatus: 'MULTIPLE HOSTILES',
  targets: 5,
};
```

### Pattern 3: Full Inventory
```typescript
const fullInventoryData = {
  hp: { current: 500, max: 500 },
  ap: { current: 100, max: 100 },
  time: '12:00',
  date: '06.15.2077',
  rads: 0,
  inventory: [
    { name: 'Stimpak', weight: 0.5, quantity: 99 },
    { name: 'RadAway', weight: 0.5, quantity: 50 },
    { name: 'Nuka-Cola', weight: 1.0, quantity: 25 },
    { name: 'Plasma Rifle', weight: 8.0 },
    { name: 'Power Armor', weight: 45.0 },
    { name: 'Fusion Core', weight: 3.0, quantity: 10 },
  ],
  radarStatus: 'ALL CLEAR',
  targets: 0,
};
```

---

## Troubleshooting

### ❌ Inventory items not showing?

**Problem:** Wrong property names
```typescript
// ❌ WRONG
inventory: [
  { item: 'Stimpak', wgt: 0.5, qty: 12 }
]

// ✅ CORRECT
inventory: [
  { name: 'Stimpak', weight: 0.5, quantity: 12 }
]
```

### ❌ Radar blip not appearing?

**Problem:** `targets` is 0 or undefined
```typescript
// ❌ No blip
data={{ radarStatus: 'SEARCHING', targets: 0 }}

// ✅ Shows blip
data={{ radarStatus: 'SIGNAL DETECTED', targets: 1 }}
```

### ❌ Time/Date format incorrect?

**Problem:** Wrong format
```typescript
// ❌ WRONG
time: '2:30 PM'
date: '2026-03-05'

// ✅ CORRECT
time: '14:30'
date: '03.05.2026'
```

---

## Best Practices

1. **Always provide complete data object** - Don't omit required properties
2. **Use TypeScript types** - Import `PipBoyData` for type safety
3. **Format strings correctly** - Time as "HH:MM", Date as "MM.DD.YYYY"
4. **Keep inventory reasonable** - 5-10 items for best UX
5. **Update data immutably** - Use spread operator when updating state

---

## License

MIT License - Part of the RHUDS component library
