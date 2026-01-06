# Phase 2: Design System Implementation

**Status**: Not Started  
**Priority**: High  
**Estimated Effort**: 3-4 days  
**Dependencies**: Phase 1a (Foundation Auth) - Completed

## Overview

Implement the CV-Gen Design System based on `styles.json`, transforming the current default shadcn/neutral styling into a modern, bold design inspired by WiseLoop - emphasizing warmth, professionalism, and dynamic energy.

### Design Philosophy

- **Warm & Inviting**: Cream/amber color palette replacing cold grays
- **Bold Typography**: Space Grotesk for headings, DM Sans for body text
- **Professional Polish**: Subtle shadows, refined spacing, smooth transitions
- **Accessible**: WCAG compliant contrast ratios, focus states, reduced motion support

## Current State vs Target State

| Aspect | Current | Target |
|--------|---------|--------|
| Primary Colors | OKLCH gray/neutral | Warm cream (#F5F0E8), Amber (#F5A623) |
| Typography | System fonts | Space Grotesk, DM Sans, JetBrains Mono |
| Buttons | Indigo-based | Amber primary with pill shape |
| Cards | White with gray borders | Warm white with soft shadows |
| Animations | Basic tw-animate-css | Custom hover/transition animations |

---

## Implementation Phases

### Phase 2.1: Foundation Setup
**Priority**: Critical  
**Files to Modify**: 2  
**Estimated Time**: 2-3 hours

#### Tasks

- [ ] **2.1.1** Update `frontend/index.html` with Google Fonts
  - Add Space Grotesk (weights: 500, 600, 700)
  - Add DM Sans (weights: 400, 500, 600)
  - Add JetBrains Mono for code blocks

- [ ] **2.1.2** Replace CSS variables in `frontend/src/styles.css`
  - Replace OKLCH values with design system hex colors
  - Add new semantic color tokens (cream, amber, coral, etc.)
  - Add typography CSS variables
  - Add spacing scale variables
  - Add shadow variables
  - Add border radius variables
  - Add animation easing variables

- [ ] **2.1.3** Update `@theme inline` mappings
  - Map all new color tokens to Tailwind
  - Add custom font family mappings
  - Add custom spacing utilities
  - Add custom shadow utilities

- [ ] **2.1.4** Add animation keyframes
  - fadeInUp, fadeIn, scaleIn
  - slideInLeft, slideInRight
  - float, pulse animations
  - Add reduced-motion media query support

- [ ] **2.1.5** Update base layer styles
  - Body background to warm-white
  - Default font to DM Sans
  - Focus ring styling with amber

#### Acceptance Criteria
- [ ] Fonts load correctly (check Network tab)
- [ ] CSS variables available in browser DevTools
- [ ] No console errors related to fonts/styles
- [ ] Reduced motion preference respected

---

### Phase 2.2: Shadcn UI Component Customization
**Priority**: Critical  
**Files to Create/Modify**: 6-8  
**Estimated Time**: 4-5 hours

#### Tasks

- [ ] **2.2.1** Update/Create `frontend/src/components/ui/button.tsx`
  ```
  Variants needed:
  - primary: Amber background, charcoal text, pill shape
  - secondary: Transparent with border, inverts on hover
  - ghost: Transparent with subtle hover background
  - destructive: Coral/red styling
  
  Sizes: sm, default, lg
  ```

- [ ] **2.2.2** Update/Create `frontend/src/components/ui/card.tsx`
  ```
  Variants needed:
  - default: Warm white, border, soft shadow, rounded-xl
  - elevated: No border, dramatic shadow, rounded-2xl
  - dark: Charcoal background, light text
  ```

- [ ] **2.2.3** Update/Create `frontend/src/components/ui/input.tsx`
  ```
  Styling:
  - Warm white background
  - Border-gray border (2px)
  - Amber focus border
  - Rounded-lg (12px)
  - Proper padding
  ```

- [ ] **2.2.4** Update/Create `frontend/src/components/ui/badge.tsx`
  ```
  Variants:
  - default: Amber background (15% opacity), amber-dark text
  - secondary: Gray background
  - destructive: Coral styling
  - outline: Border only
  ```

- [ ] **2.2.5** Create `frontend/src/components/ui/typography.tsx`
  ```tsx
  Components needed:
  - Hero: clamp(3.5rem, 8vw, 7rem), Space Grotesk, weight 700
  - H1: clamp(2.5rem, 5vw, 4.5rem)
  - H2: clamp(2rem, 4vw, 3rem)
  - H3: clamp(1.5rem, 3vw, 2rem)
  - H4: clamp(1.25rem, 2vw, 1.5rem)
  - Body: clamp(1rem, 1.5vw, 1.125rem), DM Sans
  - Small: 0.875rem
  - Caption: 0.75rem, uppercase, letter-spacing
  - Code: JetBrains Mono
  ```

- [ ] **2.2.6** Update/Create `frontend/src/components/ui/label.tsx`
  - Match input styling
  - Proper font weight and size

- [ ] **2.2.7** Update/Create `frontend/src/components/ui/textarea.tsx`
  - Same styling as input
  - Proper resize behavior

#### Acceptance Criteria
- [ ] All components render correctly in isolation
- [ ] Hover/focus states work as designed
- [ ] Components are accessible (keyboard nav, screen readers)
- [ ] Dark mode variants work (warm dark theme)

---

### Phase 2.3: Layout Components
**Priority**: High  
**Files to Create/Modify**: 4  
**Estimated Time**: 2-3 hours

#### Tasks

- [ ] **2.3.1** Create `frontend/src/components/ui/container.tsx`
  ```tsx
  Props:
  - maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' (default: '2xl' = 1440px)
  - padding: boolean (default: true) - applies responsive padding
  - center: boolean (default: true) - centers with mx-auto
  ```

- [ ] **2.3.2** Create `frontend/src/components/ui/section.tsx`
  ```tsx
  Props:
  - variant: 'default' | 'dark' | 'gradient'
  - spacing: 'sm' | 'md' | 'lg' (vertical padding)
  - children
  
  Applies:
  - Section padding from design system
  - Background variants
  ```

- [ ] **2.3.3** Update `frontend/src/components/Header.tsx`
  ```
  Changes:
  - Height: 80px
  - Background: rgba(250, 247, 242, 0.9) with backdrop-blur
  - Link colors: charcoal, amber on hover
  - Logo styling update
  - Mobile menu styling
  ```

- [ ] **2.3.4** Update `frontend/src/routes/__root.tsx`
  ```
  Changes:
  - Apply warm background to body/main
  - Ensure proper font inheritance
  - Add any global layout wrappers
  ```

#### Acceptance Criteria
- [ ] Container properly constrains content
- [ ] Section spacing is consistent
- [ ] Header has glassmorphism effect
- [ ] Mobile navigation matches design

---

### Phase 2.4: Profile Section Components
**Priority**: High  
**Files to Modify**: 17  
**Estimated Time**: 4-6 hours

#### Tasks

- [ ] **2.4.1** Update `frontend/src/components/profile/FormComponents.tsx`
  ```
  Update base form primitives:
  - FormField: Use new Input styling
  - FormSection: Use new Card styling
  - SaveButton: Use new Button primary
  - EmptyState: Update colors and typography
  - TagInput: Update badge/input styling
  ```

- [ ] **2.4.2** Update `frontend/src/components/profile/ProfileLayout.tsx`
  ```
  Changes:
  - Background color update
  - Card container styling
  - Spacing adjustments
  ```

- [ ] **2.4.3** Update `frontend/src/components/profile/SectionNav.tsx`
  ```
  Changes:
  - Navigation item styling
  - Active state: amber accent
  - Hover states
  - Icon colors
  ```

- [ ] **2.4.4** Update `frontend/src/components/profile/ProgressIndicator.tsx`
  ```
  Changes:
  - Progress bar colors (amber)
  - Background colors
  - Typography updates
  ```

- [ ] **2.4.5-2.4.17** Update all form components
  ```
  Files:
  - BasicInfoForm.tsx
  - WorkExperienceForm.tsx
  - EducationForm.tsx
  - SkillsForm.tsx
  - ProjectsForm.tsx
  - CertificatesForm.tsx
  - AwardsForm.tsx
  - PublicationsForm.tsx
  - LanguagesForm.tsx
  - VolunteerForm.tsx
  - InterestsForm.tsx
  - ReferencesForm.tsx
  - JsonImportExport.tsx
  
  Common changes per file:
  - Replace hardcoded colors with design tokens
  - Update button variants
  - Update card/border styling
  - Update typography classes
  ```

#### Acceptance Criteria
- [ ] All forms render with new design
- [ ] Form validation states use semantic colors
- [ ] Progress indicator uses amber
- [ ] Navigation states are clear and accessible

---

### Phase 2.5: Page Routes Redesign
**Priority**: High  
**Files to Modify**: 6  
**Estimated Time**: 6-8 hours

#### Tasks

- [ ] **2.5.1** Redesign Homepage (`frontend/src/routes/index.tsx`)
  ```
  Sections to update:
  - Hero section: 
    - Warm background gradient
    - Hero typography (Space Grotesk)
    - Primary CTA button (amber pill)
    - Secondary CTA button (outlined)
  - Features section:
    - Feature cards with new Card component
    - Icon styling with amber accents
  - CTA section:
    - Dark variant section
    - Contrasting buttons
  - Footer (if exists)
  ```

- [ ] **2.5.2** Redesign Sign-in Page (`frontend/src/routes/auth/sign-in.tsx`)
  ```
  Changes:
  - Centered card layout
  - Form inputs with new styling
  - Primary sign-in button
  - Link styling (amber)
  - Error state styling
  ```

- [ ] **2.5.3** Redesign Sign-up Page (`frontend/src/routes/auth/sign-up.tsx`)
  ```
  Changes:
  - Same treatment as sign-in
  - Multi-field form styling
  - Password requirements display
  ```

- [ ] **2.5.4** Redesign Dashboard (`frontend/src/routes/dashboard/index.tsx`)
  ```
  Changes:
  - Welcome section typography
  - Stats cards with new Card variants
  - Quick action buttons
  - Recent activity styling
  - Navigation cards
  ```

- [ ] **2.5.5** Update Profile Page (`frontend/src/routes/profile/index.tsx`)
  ```
  Changes:
  - Page header styling
  - Integration with ProfileLayout updates
  - Any page-level styling
  ```

- [ ] **2.5.6** Update Demo Page (`frontend/src/routes/demo/tanstack-query.tsx`)
  ```
  Changes:
  - Basic styling cleanup
  - Use new Card/Button components
  - (Lower priority - demo page)
  ```

#### Acceptance Criteria
- [ ] Homepage feels warm and professional
- [ ] Auth pages are clean and focused
- [ ] Dashboard provides clear visual hierarchy
- [ ] All pages are responsive
- [ ] Consistent design language across all pages

---

### Phase 2.6: Dark Mode Implementation
**Priority**: Medium  
**Files to Modify**: 1-2  
**Estimated Time**: 2-3 hours

#### Tasks

- [ ] **2.6.1** Create warm dark mode color palette
  ```css
  Dark mode mappings:
  - Background: #1A1A1A (charcoal)
  - Foreground: #FFFBF5 (warm white)
  - Card: #2D2D2D (dark gray)
  - Primary: #F5A623 (amber - stays same)
  - Muted: #6B6B6B (mid gray)
  - Border: #3D3D3D
  ```

- [ ] **2.6.2** Update `.dark` CSS variables in `styles.css`

- [ ] **2.6.3** Test all components in dark mode
  - Verify contrast ratios
  - Check hover states
  - Verify focus rings

- [ ] **2.6.4** Add dark mode toggle (optional)
  - Could be added to Header
  - Use system preference as default

#### Acceptance Criteria
- [ ] Dark mode is warm, not cold gray
- [ ] All text meets WCAG contrast requirements
- [ ] Interactive elements are clearly visible
- [ ] Smooth transition between modes

---

## Technical Notes

### CSS Variables Structure (styles.css)

```css
:root {
  /* Primary Palette */
  --color-cream: #F5F0E8;
  --color-warm-white: #FFFBF5;
  --color-off-white: #FAF7F2;
  
  /* Accent Colors */
  --color-amber: #F5A623;
  --color-amber-light: #FFB84D;
  --color-amber-dark: #E09000;
  --color-coral: #FF6B4A;
  --color-coral-light: #FF8A6F;
  
  /* Neutral Colors */
  --color-charcoal: #1A1A1A;
  --color-dark-gray: #2D2D2D;
  --color-mid-gray: #6B6B6B;
  --color-light-gray: #A0A0A0;
  --color-border-gray: #E5E0D8;
  
  /* Semantic Colors */
  --color-success: #4CAF50;
  --color-warning: #F5A623;
  --color-error: #FF6B4A;
  --color-info: #5B8DEF;
  
  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Shadows */
  --shadow-subtle: 0 2px 8px rgba(26, 26, 26, 0.04);
  --shadow-soft: 0 4px 16px rgba(26, 26, 26, 0.08);
  --shadow-medium: 0 8px 32px rgba(26, 26, 26, 0.12);
  --shadow-elevated: 0 16px 48px rgba(26, 26, 26, 0.16);
  
  /* Animation */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  
  /* Spacing (reference) */
  --spacing-section-y: clamp(4rem, 10vw, 8rem);
  --spacing-section-x: clamp(1.5rem, 5vw, 4rem);
  --container-max: 1440px;
}
```

### Component Import Pattern

```tsx
// Use shadcn components with design system styling
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { H1, H2, Body, Caption } from '@/components/ui/typography'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
```

### Tailwind Class Naming Convention

Use design system tokens via CSS variables mapped to Tailwind:

```tsx
// Instead of:
<div className="bg-gray-100 text-gray-900">

// Use:
<div className="bg-background text-foreground">

// Or for specific design system colors:
<div className="bg-cream text-charcoal">
<button className="bg-amber hover:bg-amber-dark text-charcoal">
```

---

## File Checklist

### New Files to Create
- [ ] `frontend/src/components/ui/button.tsx` (or update existing)
- [ ] `frontend/src/components/ui/card.tsx` (or update existing)
- [ ] `frontend/src/components/ui/input.tsx` (or update existing)
- [ ] `frontend/src/components/ui/badge.tsx` (or update existing)
- [ ] `frontend/src/components/ui/typography.tsx`
- [ ] `frontend/src/components/ui/container.tsx`
- [ ] `frontend/src/components/ui/section.tsx`
- [ ] `frontend/src/components/ui/label.tsx` (or update existing)
- [ ] `frontend/src/components/ui/textarea.tsx` (or update existing)

### Files to Modify
- [ ] `frontend/index.html`
- [ ] `frontend/src/styles.css`
- [ ] `frontend/src/components/Header.tsx`
- [ ] `frontend/src/components/UserMenu.tsx`
- [ ] `frontend/src/routes/__root.tsx`
- [ ] `frontend/src/routes/index.tsx`
- [ ] `frontend/src/routes/auth/sign-in.tsx`
- [ ] `frontend/src/routes/auth/sign-up.tsx`
- [ ] `frontend/src/routes/dashboard/index.tsx`
- [ ] `frontend/src/routes/profile/index.tsx`
- [ ] `frontend/src/routes/demo/tanstack-query.tsx`
- [ ] `frontend/src/components/profile/FormComponents.tsx`
- [ ] `frontend/src/components/profile/ProfileLayout.tsx`
- [ ] `frontend/src/components/profile/SectionNav.tsx`
- [ ] `frontend/src/components/profile/ProgressIndicator.tsx`
- [ ] `frontend/src/components/profile/BasicInfoForm.tsx`
- [ ] `frontend/src/components/profile/WorkExperienceForm.tsx`
- [ ] `frontend/src/components/profile/EducationForm.tsx`
- [ ] `frontend/src/components/profile/SkillsForm.tsx`
- [ ] `frontend/src/components/profile/ProjectsForm.tsx`
- [ ] `frontend/src/components/profile/CertificatesForm.tsx`
- [ ] `frontend/src/components/profile/AwardsForm.tsx`
- [ ] `frontend/src/components/profile/PublicationsForm.tsx`
- [ ] `frontend/src/components/profile/LanguagesForm.tsx`
- [ ] `frontend/src/components/profile/VolunteerForm.tsx`
- [ ] `frontend/src/components/profile/InterestsForm.tsx`
- [ ] `frontend/src/components/profile/ReferencesForm.tsx`
- [ ] `frontend/src/components/profile/JsonImportExport.tsx`

---

## Testing Checklist

### Visual Testing
- [ ] Desktop viewport (1440px+)
- [ ] Laptop viewport (1024px-1439px)
- [ ] Tablet viewport (768px-1023px)
- [ ] Mobile viewport (< 768px)
- [ ] Dark mode toggle
- [ ] Reduced motion preference

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader compatibility

### Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)

---

## Future Phases (Out of Scope)

These items are documented but will be implemented in future phases:

### Phase 2.7: Advanced Animations (Future)
- Scroll-triggered animations with Intersection Observer
- Staggered page load animations
- `useScrollAnimation` custom hook
- Page transition animations

### Phase 2.8: Decorative Elements (Future)
- Star/asterisk decorative SVG components
- Floating geometric shapes with animations
- Emoji badge components
- Gradient text highlight utilities
- Hand-drawn illustration integration

---

## References

- Design System Specification: `/styles.json`
- Tailwind CSS v4 Docs: https://tailwindcss.com/docs
- Shadcn UI: https://ui.shadcn.com/
- Google Fonts: https://fonts.google.com/
