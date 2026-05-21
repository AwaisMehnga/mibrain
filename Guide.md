# miBrain Design System & Coding Guidelines

## Non-Negotiable: One Backend For Web And Mobile

miBrain must use the same backend, same API routes, same controllers, same validation, and same business logic for both the web app and the React Native mobile app.

- Do not create separate backend endpoints, controllers, services, validation rules, or onboarding/auth flows just because the caller is web or mobile.
- Keep all reusable behavior in shared backend code. If web and mobile need the same action, expose it through the same `/api/v1/*` API contract.
- The web app may use Laravel session cookies, and the mobile app may use bearer tokens, but both must call the same API endpoints and receive the same JSON response shapes.
- API endpoints must not depend on browser-only behavior such as React Router navigation, Blade redirects, or frontend-only guards. Protected API actions should return JSON errors such as `401 UNAUTHENTICATED` or `403 ONBOARDING_REQUIRED`.
- Frontend route guards are UX helpers only. Backend middleware/controllers must enforce authentication and onboarding rules for both clients.
- Do not duplicate code for mobile and web. Add shared helpers, middleware, services, resources, or request classes when logic needs to be reused.
- When changing auth, onboarding, profile, notifications, check-ins, history, reports, or any user data feature, verify that both clients can use the same request payloads and response fields without client-specific branches.

Always preserve mobile/web compatibility before adding new functionality.

## Overview
miBrain is a migraine tracking app with a cohesive dark theme, accessible components, and clean Tailwind-based styling. This document defines the design system, component structure, and coding conventions to maintain consistency across all sessions.

---

## Color Palette & Theme

### Semantic Background Colors
Use **one consistent naming** for backgrounds: `primary`, `secondary`, `tertiary`, `input`

```css
--color-primary:   #101513    → bg-primary   (main app background)
--color-secondary: #171E1B    → bg-secondary (cards/surfaces)
--color-tertiary:  #1E2623    → bg-tertiary  (elevated/raised surfaces)
--color-input:     #222B28    → bg-input     (input fields, special surfaces)
```

### Text/Foreground Colors
Use **`fg-` prefix** to distinguish from backgrounds: `fg`, `fg-secondary`, `fg-muted`, `fg-inverse`

```css
--color-fg:            #EEF4F0    → text-fg           (primary text, bright)
--color-fg-secondary:  #9BAAA3    → text-fg-secondary (secondary text, medium)
--color-fg-muted:      #66756F    → text-fg-muted     (muted/disabled text)
--color-fg-inverse:    #101513    → text-fg-inverse   (text on light backgrounds)
```

### Accent Colors
```css
--color-accent:    #7FB69B    → bg-accent, text-accent
--color-success:   #8CCF9B
--color-warning:   #D8BE82
--color-danger:    #D58C8C
```

---

## CSS & Tailwind Rules

### ✅ DO
- **Use Tailwind classes** for all color/sizing styling: `bg-primary`, `text-fg`, `rounded-xl`
- **Keep theme variables** in `src/index.css` under `@theme` block
- **Use semantic color names** that match the design system
- **Apply opacity modifiers** sparingly: `bg-accent/12`, `text-fg/50`
- **Use inline styles only** for:
  - Dynamic values (e.g., `calc()`, `env()` for safe areas)
  - Non-Tailwind CSS properties
  
### ❌ DON'T
- **Don't use inline `style={{color: '#hex'}}`** — always use Tailwind classes
- **Don't create arbitrary color values** — add to `@theme` first
- **Don't mix old naming** (e.g., `text-primary` for text) — use `text-fg` consistently
- **Don't use magic numbers** for spacing — use Tailwind defaults or named variables

### Example: Correct vs Wrong

**❌ Wrong:**
```jsx
<div style={{ backgroundColor: '#101513', color: '#EEF4F0' }}>
  <h1 style={{ color: 'rgb(127, 182, 155)' }}>Title</h1>
</div>
```

**✅ Correct:**
```jsx
<div className="bg-primary text-fg">
  <h1 className="text-accent">Title</h1>
</div>
```

---

## Component Structure

### File Organization
```
src/
├── ui/
│   ├── components/       # Reusable UI components
│   │   ├── nav-bar.jsx
│   │   ├── topbar.jsx
│   │   └── bottom-nav.jsx
│   └── screens/          # Full-page screens
│       ├── home/
│       ├── log/
│       ├── history/
│       ├── insights/
│       ├── profile/
│       └── notifications/
├── index.css             # Theme & global styles
└── layout.jsx            # Root layout
```

### Component Pattern
1. **Import dependencies** at top
2. **Define props** in function signature
3. **Use Tailwind classes** for styling
4. **Keep JSX clean** — extract complex logic to helpers

```jsx
import { IconName } from 'lucide-react'

function MyComponent({ label, isActive }) {
  return (
    <div className="flex items-center gap-2 bg-secondary rounded-xl p-4">
      <IconName className={isActive ? 'text-accent' : 'text-fg-muted'} />
      <span className="text-fg font-semibold">{label}</span>
    </div>
  )
}
```

---

## Typography

### Font Stack
```css
--font-display: "DM Serif Display", serif;    /* Headings, hero text */
--font-body:    "DM Sans", sans-serif;        /* UI, body text */
--font-mono:    "DM Mono", monospace;         /* Numbers, data, code */
```

### Text Sizes (Tailwind standard)
- `text-[15px]` — header/titles
- `text-[13px]` — body copy
- `text-[12px]` — secondary/metadata
- `text-[11px]` — labels/small text
- `text-[10px]` — badges/minimal

Use `font-semibold` for emphasis, `font-display` for headings.

---

## Spacing & Radius

### Border Radius
```css
rounded-xs   → 6px   (small tags)
rounded-sm   → 8px   (chips, buttons)
rounded-md   → 12px  (cards, inputs)
rounded-lg   → 16px  (sheets, modals)
rounded-xl   → 24px  (large buttons)
rounded-2xl  → 32px  (featured cards)
rounded-full → 9999px (pills, avatars)
```

### Gap & Padding
- **Gap between elements:** `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px)
- **Padding inside containers:** `p-3` (12px), `p-4` (16px), `px-5` (20px)
- **Safe area padding:** Use `env(safe-area-inset-*)` in inline styles for mobile

---

## Animations & Interactions

### CSS Animations (in `index.css`)
- `anim-fade-in-up` — fade + slide up
- `anim-slide-up` — slide from bottom
- `anim-scale-in` — scale from small
- `anim-pulse-ring` — expanding ring effect
- `anim-spin` — loading spinner
- `anim-blink` — blinking effect

Use in className: `className="anim-fade-in-up"`

### Transitions
- Color changes: `transition-colors duration-200`
- All properties: `transition-all duration-300`
- Keep durations under 400ms for snappiness

---

## Mobile & Safe Areas

### Responsive Design
- **Mobile-first** approach — design for mobile, enhance for larger screens
- **Use Tailwind breakpoints** if needed: `md:`, `lg:`
- **Safe areas** (notches, home indicators) handled via inline styles:
  ```jsx
  style={{
    height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  }}
  ```

### Layout Constraints
- **Bottom nav:** Fixed at bottom, accounts for safe-area
- **Top header:** Fixed at top, accounts for safe-area
- **Main content:** Scrollable between header & nav (`pt-15 pb-21`)

---

## Common Patterns

### Button/Clickable
```jsx
<button className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/8 border border-accent/14 transition-colors duration-200 hover:bg-accent/12">
  <Icon size={18} className="text-accent" />
</button>
```

### Card
```jsx
<div className="rounded-2xl overflow-hidden bg-secondary">
  <div className="px-4 py-4 border-b border-white/4">
    <h3 className="text-[13px] font-semibold text-fg">Title</h3>
  </div>
</div>
```

### Badge/Pill
```jsx
<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/12 border border-accent/20">
  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
  <span className="text-[12px] font-medium text-accent">Label</span>
</div>
```

---

## Code Style Rules

1. **No inline styles for colors** — use Tailwind
2. **Keep classNames readable** — split long strings with template literals
3. **Comment only the WHY** — avoid obvious comments
4. **Props first, then state** — organize component logic clearly
5. **Consistent quote style** — double quotes for JSX, single for strings
6. **Use semantic HTML** — `<button>`, `<nav>`, `<header>`, not `<div>` everywhere

---

## Checklist Before Committing

- [ ] All colors use Tailwind classes, not inline styles
- [ ] No old color names (`text-primary` for text, `bg-bg`, etc.)
- [ ] Theme variables match the design system
- [ ] Components follow file structure
- [ ] Text colors default to appropriate foreground class
- [ ] Mobile safe areas handled for fixed elements
- [ ] Animations smooth and < 400ms
- [ ] No unused imports or variables

---

## Quick Reference: Color Class Mapping

| Purpose | Class | Value |
|---------|-------|-------|
| Main background | `bg-primary` | #101513 |
| Card background | `bg-secondary` | #171E1B |
| Raised/elevated | `bg-tertiary` | #1E2623 |
| Input background | `bg-input` | #222B28 |
| Primary text | `text-fg` | #EEF4F0 |
| Secondary text | `text-fg-secondary` | #9BAAA3 |
| Muted text | `text-fg-muted` | #66756F |
| Text on light | `text-fg-inverse` | #101513 |
| Accent/highlight | `text-accent`, `bg-accent` | #7FB69B |

---

Last updated: 2026-05-15
