# Admin Setup Guide

## Installation

Run this command in the Admin folder to install dependencies:

```bash
npm install
```

This will install:
- `react-icons@5.6.0` - Professional icon library
- `react-router-dom@7.13.2` - Routing for navigation

## Updated Components

### 1. **Nav.jsx** - Sticky Top Navigation
- ✅ React Icons (IoGridOutline, IoCart, IoPeople, IoBarChart, etc.)
- ✅ Profile dropdown with logout
- ✅ Settings link
- ✅ Mobile hamburger menu
- ✅ Search button
- ✅ Active link highlighting

**Features:**
- Height: 90px
- Position: sticky (z-index: 50)
- Icons: 18px-20px size
- Responsive: collapses at 768px

### 2. **Sidebar.jsx** (NEW) - Left Navigation Panel
- ✅ 3 Collapsible sections: Main, Management, System
- ✅ Expandable/collapsible behavior
- ✅ Active link styling with gold accent
- ✅ Item badges (Orders count, Users count)
- ✅ Collapse/Expand button (−/+)
- ✅ Footer with version and stats

**Features:**
- Width: 280px (right sidebar margin on main)
- Position: fixed (left), top: 90px
- Collapse: 70px when toggled
- Icons: All from react-icons/io5
- Animation: Smooth slide-in (0.3s)
- Responsive: Mobile drawer on tablets

### 3. **Loading.jsx** - Full Page Spinner
- ✅ 4-ring animated spinner
- ✅ Gold color accent
- ✅ Pulsing "Loading..." text
- ✅ Centered modal layout
- ✅ Mobile responsive

### 4. **App.jsx** - Main Layout
- ✅ Nav at top (sticky)
- ✅ Sidebar on left (fixed)
- ✅ Main content with left margin (ml-[280px])
- ✅ Flexbox layout

## Project Structure

```
Admin/src/
├── components/
│   ├── Nav.jsx           (115 lines - top navbar)
│   ├── Sidebar.jsx       (105 lines - left sidebar)
│   └── Loading.jsx       (20 lines - spinner)
├── styles/
│   ├── theme.css         (Design tokens)
│   ├── Nav.css           (280 lines)
│   ├── Sidebar.css       (380 lines)
│   └── Loading.css       (80 lines)
├── App.jsx               (Updated with layout)
└── index.css             (Global imports)
```

## Navigation Structure

### Navbar (Top, 90px)
- Logo (left)
- Admin Links (center) - icons + text
- Search + Profile + Hamburger (right)

### Sidebar (Left, 280px)
- Header: "Navigation" + Toggle button
- Main Section
  - Dashboard
  - Analytics
- Management Section
  - Products
  - Orders (badge: 12)
  - Users (badge: 3)
- System Section
  - Settings
- Footer: v1.0.0 + Quick Stats

## Design Tokens Used

All styling uses CSS variables from `theme.css`:

| Token | Color | Usage |
|-------|-------|-------|
| `--primary` | #D4AF37 | Active links, hover, badges |
| `--bg-main` | #0F1115 | Page background |
| `--bg-secondary` | #151821 | Sidebar background |
| `--bg-card` | #1C1F2A | Cards, stats boxes |
| `--text-primary` | #FFFFFF | Headings, active text |
| `--text-secondary` | #B6BAC8 | Regular text |
| `--border` | #2E3345 | Dividers, borders |

## Usage

### Basic Setup

```jsx
import Nav from './components/Nav'
import Sidebar from './components/Sidebar'
import Loading from './components/Loading'

export default function App() {
  return (
    <div>
      <Nav /> {/* Sticky navbar */}
      <div className='flex'>
        <Sidebar /> {/* Left sidebar */}
        <main>
          {/* Your pages here */}
        </main>
      </div>
    </div>
  )
}
```

### Using Loading Component

```jsx
{isLoading ? (
  <Loading />
) : (
  <div>Your content</div>
)}
```

## Customization

### Icons
All icons from `react-icons/io5`. To change:

```jsx
// In Nav.jsx navLinks
{ label: 'Dashboard', to: '/admin/dashboard', icon: IoGridOutline }
// Change IoGridOutline to any icon from https://react-icons.github.io/react-icons/icons?name=io5

// In Sidebar.jsx, update similarly
```

### Colors
Edit `Admin/src/styles/theme.css`:

```css
:root {
  --primary: #D4AF37;
  --bg-main: #0F1115;
  /* etc */
}
```

### Responsive Breakpoints
Edit in respective CSS files:

```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px) { /* Mobile */ }
@media (max-width: 480px) { /* Small mobile */ }
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create page components in `pages/` folder
3. ✅ Set up React Router in main.jsx
4. ✅ Create API integration
5. ✅ Add page-specific components

## Troubleshooting

### Icons not showing?
- Run `npm install` to install react-icons
- Check import paths are correct

### Sidebar margin issue?
- Ensure App.jsx has `ml-[280px]` on main
- Or use flexbox layout as shown

### Icons too small/large?
- Edit size prop: `<Icon size={18} />`
- Adjust in Nav.jsx, Sidebar.jsx, anywhere icons render

### Colors not applying?
- Check theme.css is imported in index.css
- Verify CSS custom properties are set in :root
- Clear browser cache

## Commands

```bash
# Install
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint
npm lint
```

---

**Status:** ✅ Ready to use
**Responsive:** Mobile → Tablet → Desktop
**Design System:** All tokens from DESIGN.md
**Components:** Production-ready
