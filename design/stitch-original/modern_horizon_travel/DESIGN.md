---
name: Modern Horizon Travel
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#495f82'
  primary: '#001026'
  on-primary: '#ffffff'
  primary-container: '#0b2545'
  on-primary-container: '#778db2'
  inverse-primary: '#b1c7f0'
  secondary: '#006876'
  on-secondary: '#ffffff'
  secondary-container: '#92edff'
  on-secondary-container: '#006d7b'
  tertiary: '#270300'
  on-tertiary: '#ffffff'
  tertiary-container: '#4e0900'
  on-tertiary-container: '#f65430'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b1c7f0'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#314769'
  secondary-fixed: '#9eefff'
  secondary-fixed-dim: '#77d4e5'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004e59'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a3'
  on-tertiary-fixed: '#3d0600'
  on-tertiary-fixed-variant: '#8c1900'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system is engineered for a high-converting, premium, and welcoming travel agency experience. Its goal is to balance aspirational wanderlust with commercial clarity and structural confidence. 

The aesthetic is luminous, refined, and tactilely modern, drawing primarily from clean contemporary minimalism layered with ambient depth, soft glass transitions, and vibrant, focused focal points. 

Visual principles:
- **Luminosity & Clarity**: Wide expanses of pure white contrasted against muted pearl tones allow imagery of pristine destinations to command attention without visual fatigue.
- **Conversion Discipline**: Attention is channeled methodically. High-contrast coral calls-to-action are isolated strictly for conversion-driving actions (booking, quoting, direct booking inquiry), creating an unambiguous visual hierarchy.
- **Approachable Luxury**: Depth is communicated via soft, colored atmospheric shadows rather than harsh borders, creating a welcoming, hospitable feeling.

## Colors

The palette establishes an immediate link to maritime landscapes, sky horizons, and golden-hour travel energy.

### Roles and Application
- **Primary (`#0B2545` - Deep Oceanic Blue)**: The anchor of the brand. Applied to major typographic titles, structural navigation headers, primary badge borders, and foundational elements where authority and trust are paramount.
- **Secondary (`#028090` - Refreshing Marine Teal)**: Represents discovery, wellness, and curated experience. Used for trust badges, rating stars/accents, active navigation indicators, category pills, and secondary interactive states.
- **Tertiary / Action Accent (`#FF5A36` - Vibrant Coral)**: Strictly preserved for conversion actions. It must never be diluted by broad decorative application. Reserved for primary booking triggers, instant-quote CTAs, urgency badges (e.g., "Últimas 2 plazas"), and sticky contact triggers.
- **Neutral Canvas (`#FFFFFF` & `#F8FAFC`, accented by `#F1F5F9`)**: Used across alternating section bands to produce visual pacing. High-contrast typography sits comfortably against both tones without strain.
- **Text Neutrals**:
  - Headings: `#0B2545`
  - Body copy: `#334155` (Slate-700)
  - Secondary metadata & captions: `#64748B` (Slate-500)

## Typography

The typography pairs the geometric structure and warmth of **Plus Jakarta Sans** for titles, display copy, and interactive buttons with the clinical legibility and clarity of **Inter** for descriptions, trip itineraries, and transactional data.

- Headlines feature tight negative tracking (`-0.01em` to `-0.03em`) to enhance cohesion and editorial impact.
- Body copy uses generous line heights (1.5x to 1.55x) in Slate tones to ensure scanability of long destination descriptions.
- Badges and micro-labels utilize all-caps or compact bold treatment with tracking expanded to `+0.04em` to balance legibility at tiny sizes.

## Layout & Spacing

The layout is built around a standard 12-column fluid grid system on desktop, collapsing to 6 columns on tablet and 4 columns on mobile devices.

### Structural Strategy
- **Max Content Width**: Standard content containers are constrained to `1280px` for optimal scanning, with hero media sections optionally breaking into full-bleed fluid rows.
- **Section Rhythm**: Page sections alternate between `#FFFFFF` and `#F8FAFC` backgrounds, separated by vertical section padding of `5rem` (`80px`) on desktop and `3rem` (`48px`) on mobile devices.
- **Mobile Alignment**: Outer horizontal margins decrease to `1rem` on mobile screens to preserve maximum horizontal real estate for destination cards and multi-step booking forms.

## Elevation & Depth

Visual hierarchy uses ambient ocean-tinted shadows, keeping surfaces light and breathable without muddy grey drop-shadows.

### Elevation Scales
- **Surface Flat**: `0 0 0 1px #F1F5F9` (used for inactive inputs and muted secondary cards).
- **Elevation Low (`shadow-sm`)**: `0 2px 8px -2px rgba(11, 37, 69, 0.05), 0 1px 4px -1px rgba(11, 37, 69, 0.03)` (applied to resting package cards, search dropdowns, and form panels).
- **Elevation Medium (`shadow-md`)**: `0 12px 24px -6px rgba(11, 37, 69, 0.08), 0 4px 12px -2px rgba(11, 37, 69, 0.04)` (applied to hovered destination cards, filter bars, and quick-filter chips).
- **Elevation High (`shadow-lg`)**: `0 20px 32px -8px rgba(11, 37, 69, 0.12), 0 8px 16px -4px rgba(11, 37, 69, 0.06)` (applied to modal booking flows and sticky bottom action bars).
- **Floating Accent Elevation**: `0 10px 25px -5px rgba(255, 90, 54, 0.4)` (reserved strictly for primary coral action buttons and floating WhatsApp/Call triggers to enhance affordance and tap urge).

## Shapes

The design system embraces generous, modern curves to communicate friendliness, luxury, and smooth ergonomics:
- **Base Components (Inputs, Buttons, Chips)**: `0.75rem` (`12px` to `16px`), aligning with modern mobile-first interface mechanics.
- **Content Cards & Panels**: `rounded-2xl` (`1.25rem` / `20px`) to soften visual boundaries between editorial photography and content descriptions.
- **Floating Bar & Pill Badges**: Fully rounded (`9999px`) for emergency notices, badges, floating search tabs, and persistent call triggers.
- **Image Containers**: Always inherit parent card border radii, maintaining synchronous corner curves across visual assets.

## Components

### Buttons
- **Primary CTA**: Background `#FF5A36`, label `#FFFFFF`, font `label-lg`, padding `14px 28px`, rounded `12px`. Features a subtle glow on hover (`0 8px 20px rgba(255, 90, 54, 0.35)`) and micro-scale up (`scale(1.02)`).
- **Secondary Action**: Background `#FFFFFF`, border `1.5px solid #028090`, label `#028090`, rounded `12px`. On hover, background transitions to `#F0FDFA`.
- **Ghost/Tertiary**: Text-only `#0B2545` with trailing icon arrow, underlined on hover.

### Cards (Package & Destination)
- Pure white container (`#FFFFFF`) with `rounded-2xl` boundaries and `shadow-sm`.
- Aspect ratio for hero photography: `16:10` with subtle zoom (`scale: 1.05`) on card container hover.
- Top-left floating tag: Rounded full pill containing duration or destination tag (`#0B2545` translucent background with white text).
- Top-right floating wishlist button: Frosted circle blur (`rgba(255,255,255,0.85)`).
- Footer area displays price breakdown with base price in `label-sm` muted, followed by bold total in `#0B2545` and compact coral CTA.

### Urgency & Promo Badges
- High urgency (e.g., "¡Últimos 2 cupos!"): Background `#FFF1EE`, border `1px solid #FF5A36`, text `#FF5A36`, font `label-sm`.
- Trust & discount badge (e.g., "Cancelación flexible" or "Ahorra 25%"): Background `#E6F7F5`, text `#028090`, icon prefixed.

### Input Fields & Search Bars
- Floating main search widget on hero: White surface, `shadow-lg`, rounded `20px`, split into destination, dates, and travelers segments with vertical dividers (`#E2E8F0`).
- Text Inputs: Background `#FFFFFF`, border `1.5px solid #E2E8F0`, rounded `12px`, padding `12px 16px`. Active focus ring: `2px solid #028090` with zero blur offset.

### Floating Conversion Elements
- **Sticky WhatsApp Quick Action**: Bottom right, anchored `24px` from edges. Emerald green circular button (`56px × 56px`), icon white, elevated with `0 12px 24px rgba(37, 211, 102, 0.35)`.
- **Mobile Quick Contact Bar**: Anchored to viewport bottom on screens `< 768px`. White backdrop blur (`rgba(255,255,255,0.95)`), `1px border-top #E2E8F0`, housing price summary on left and full-width coral CTA on right for immediate telephone or WhatsApp reservation handoff.