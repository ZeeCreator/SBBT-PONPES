---
name: Ethos Management
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404944'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#2c2f30'
  on-tertiary: '#ffffff'
  tertiary-container: '#424547'
  on-tertiary-container: '#b0b2b4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#e1e2e4'
  tertiary-fixed-dim: '#c5c6c8'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is a bridge between traditional spiritual values and modern efficiency. It is designed to feel trustworthy, serene, and highly organized. The target audience includes educational administrators, religious leaders, and students who require a management interface that feels calm rather than overwhelming.

The design style is a blend of **Minimalism** and **Subtle Glassmorphism**. By prioritizing heavy whitespace and a restricted, professional color palette, the interface remains functional and clear. The "Integrated" (Terpadu) nature of the system is reflected in a unified visual language where administrative complexity is masked by an elegant, breathable UI.

## Colors
The palette is rooted in a Deep Emerald Green (`#064E3B`), representing the Islamic heritage and the growth of the institution. This is balanced by a sophisticated Gold/Bronze accent (`#B45309`) used sparingly for highlights, achievements, and call-to-action elements.

The background uses a layered approach of pure white and soft grays (`#F9FAFB`) to create a sense of vastness and cleanliness. Status colors should be muted: a soft sage for success, a pale terracotta for errors, and a dusty blue for information, ensuring they do not clash with the primary emerald tone.

## Typography
The system utilizes two typefaces to balance character with utility. **Plus Jakarta Sans** is used for headlines and display elements; its soft curves and modern geometry feel approachable and contemporary. **Inter** is the workhorse for body text, data tables, and forms, chosen for its exceptional legibility and neutral, systematic feel.

To maintain elegance, use a strict hierarchy. Large titles should use tighter letter spacing and bold weights, while body text requires generous line heights to ensure readability during long administrative sessions.

## Layout & Spacing
The layout follows a 12-column fluid grid for desktop, transitioning to a 4-column grid for mobile. A consistent 8px-based spatial system ensures mathematical harmony across all components.

Information-dense pages (like student records or financial ledgers) should utilize "Sectional Grouping" using whitespace rather than lines to separate content blocks. Large dashboard views use a fixed-width container centered on the screen to prevent line lengths from becoming unreadable on ultra-wide monitors.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Glassmorphism**.

1. **Surface Base:** The primary background is a very light gray (`#F9FAFB`).
2. **Dashboard Cards:** These utilize a subtle glass effect a background blur of 12px, a 60% white fill, and a 1px solid white border at 40% opacity. This creates a "frosted" look that feels light and premium.
3. **Elevated Elements:** For active modals or dropdowns, use a high-dispersion, low-opacity shadow (`y: 10, blur: 20, color: rgba(6, 78, 59, 0.05)`) to maintain the emerald color harmony even in the shadows.

## Shapes
A "Rounded" aesthetic (`0.5rem` or `8px` base) is applied across the system to evoke friendliness and safety.

- **Primary Cards:** 16px (`rounded-lg`) to create a distinct frame for glassmorphism.
- **Buttons and Inputs:** 8px (`standard`) for a professional yet modern appearance.
- **Search Bars:** Should use 24px (`rounded-xl`) to distinguish them as high-level navigation tools.

## Components

### Buttons
- **Primary:** Deep Emerald background with white text. No shadow, flat design.
- **Secondary:** White background with a 1px Emerald border.
- **Tertiary/Ghost:** Clear background with Bronze text for low-priority actions.

### Dashboard Cards
The signature component of this design system. They must feature a `backdrop-filter: blur(12px)` and a thin `1px` white border. Titles within cards should be set in **Plus Jakarta Sans** SemiBold.

### Input Fields
Inputs use a light gray fill (`#F3F4F6`) with no border in their rest state. On focus, they transition to a white background with a 2px Deep Emerald stroke.

### Chips & Badges
Used for student status (e.g., "Active", "Alumni") or payment status. These should use a "Pill" shape (32px radius) with a low-saturation background tint of the status color and high-saturation text.

### Navigation Sidebar
A clean, narrow sidebar using the Deep Emerald Green as the background. Active states are indicated by the Gold accent in a small vertical bar on the left edge and a subtle opacity increase in the menu item text.
