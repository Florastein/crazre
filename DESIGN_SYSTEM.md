# Design System — Contrl Zaid

Welcome to the **Contrl Zaid Design System**. This document outlines the unified visual language, typographic patterns, spatial systems, and core interface components that define the user experience of Contrl Zaid.

---

## 1. Executive Aesthetic Metaphor
Contrl Zaid is styled around a bespoke **Academic Archive & Technical Lab** aesthetic. Rather than adopting typical modern SaaS trends (such as rounded bubble cards, bright gradients, or floaty drop shadows), the platform embraces a tactile, scholarly, and analytical layout.

### Core Tenets:
*   **Tactile Authenticity**: Emulates physical academic objects—paper sheets, research IDs, dotted lab registers, and validator ink stamps.
*   **Geometric Precision**: Strictly enforces a **sharp, zero-radius square geometry** (no rounded corners) to evoke architectural structure and historical archival records.
*   **Restrained Contrast**: Utilizes a crisp light theme rooted in warm off-white paper tones, subtle ink borders, deep charcoal typography, and vibrant green emerald validation accents.

---

## 2. Color Palette & Tokens
Our system leverages semantic variables defined directly inside Tailwind CSS (`index.css`) to align the app's visual tones with a vintage printing-press feel.

| Token | CSS Variable | Hex / Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Ink** | `--color-ink` | `#0f172a` | Primary text, deep borders, dark UI headers |
| **Paper** | `--color-paper` | `#fdfdfc` | Warm, low-contrast off-white body background |
| **Surface** | `--color-surface` | `#ffffff` | Component cards, active layers, document panels |
| **Accent** | `--color-accent` | `#059669` | Emerald green for approvals, high grades, success |
| **Muted** | `--color-muted` | `#64748b` | Subheadings, secondary indicators, helper text |
| **Border** | `--color-border` | `rgba(15, 23, 42, 0.06)` | Ultra-soft dividers to structure page layouts |

### Status Colors (Emerald Alignment)
To preserve visual harmony, status feedback uses specific academic stamps:
*   **Approved / Active / Submitted**: `#059669` (Emerald Accent)
*   **Pending Evaluation**: `#d97706` (Amber Ochre)
*   **Under Revision**: `#4f46e5` (Indigo Blue)
*   **Rejected**: `#dc2626` (Crimson Red)

---

## 3. Typography
We pair three high-character typefaces to separate editorial brand layouts, clear technical telemetry, and structured administrative panels.

```css
@theme {
  --font-sans: "Inter", sans-serif;
  --font-serif: "Cormorant Garamond", serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-dmsans: "DM Sans", sans-serif;
}
```

### Typographic Hierarchies:
1.  **Brand Display & Section Titles**: Use **Cormorant Garamond** (Serif) with an italic style (`font-serif italic font-semibold text-slate-900`). This introduces an elegant, editorial journal aesthetic.
2.  **Primary Interface & Controls**: Use **Inter** (Sans-serif) for high legibility (`font-sans font-medium text-text-primary`). It handles forms, navigation buttons, and responsive grid contents.
3.  **Telemetry, Metadata, & Timestamps**: Use **JetBrains Mono** (Monospace) to represent files, code references, dates, and database entries (`font-mono text-xs uppercase text-text-muted`).
4.  **Content Passages & Paragraphs**: Use **DM Sans** for long-form descriptions or supervisor instructions (`font-dmsans text-sm leading-relaxed`).

---

## 4. Layout, Spacing, & Tactile Patterns

### Dot-Grid Paper Background
The entire dashboard viewport uses a dual-origin radial dot grid pattern to resemble a physical researcher's notebook page.
```css
body {
  background-color: #fdfdfc;
  background-image: 
    radial-gradient(rgba(15, 23, 42, 0.02) 1.5px, transparent 1.5px),
    radial-gradient(rgba(15, 23, 42, 0.02) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}
```

### Responsive Constraints
To prevent wide displays from stretching out of proportion, layout frames employ fluid boundaries:
*   Standard bento wrappers: `w-full max-w-7xl mx-auto px-6`
*   Modal overlays: Fixed overlays using sharp bounds and smooth fade transitions (`transition-all duration-200 ease-out`).

---

## 5. Custom UI Component Classes
The design system includes five key physical metaphors mapped directly to reusable CSS classes.

### A. The Research ID Card
An offset, high-contrast block designed for critical profiles, program summary widgets, or credentials.
*   **CSS Class**: `.research-id-card`
*   **Code Example**:
    ```html
    <div className="research-id-card p-6 bg-white">
      <span className="academic-label">Supervisor ID</span>
      <h3 className="font-serif italic text-lg font-bold">Dr. Arthur Sterling</h3>
      <p className="font-mono text-xs text-text-muted">CS/DEPT/2026</p>
    </div>
    ```

### B. The Stacked Document Stack
An overlapping sheet metaphor to group draft thesis deliverables, milestones, or active files awaiting review.
*   **CSS Class**: `.stacked-document`
*   **Code Example**:
    ```html
    <div className="stacked-document p-5">
      <h4 className="font-sans font-bold text-sm">Thesis Chapter 3 Draft</h4>
      <p className="text-xs text-text-muted font-mono">Submitted: June 15, 2026</p>
    </div>
    ```

### C. The Lab Slip Grid
A warm, dotted cream slip with dashed borders designed for temporary workspace notices, warning callouts, or feedback textboxes.
*   **CSS Class**: `.lab-slip`
*   **Code Example**:
    ```html
    <div className="lab-slip">
      <p className="font-sans italic text-xs text-text-secondary">
        "Please ensure the Byzantines consensus testing suite is loaded into the root folder."
      </p>
    </div>
    ```

### D. The Ink Stamp Seal
An authentic validation seal that behaves like a physical ink stamp placed over checked projects, showing approvals.
*   **CSS Class**: `.ink-stamp`
*   **Code Example**:
    ```html
    <div className="ink-stamp">
      VALIDATED APPROVED
    </div>
    ```

### E. The Glass Card
A premium, lightweight structured card utilizing sharp corners, thin borders, and clean, flat hover feedback.
*   **CSS Class**: `.glass-card .glass-card-hover`
*   **Code Example**:
    ```html
    <div className="glass-card glass-card-hover p-5">
      <h3 className="font-serif font-bold text-sm">Consensus Simulation</h3>
      <p className="text-xs text-text-secondary">1.8 MB • ZIP Archive</p>
    </div>
    ```

---

## 6. Interaction Rules & Micro-Animations
To preserve academic gravity, animations are subtle and functional rather than decorative.

*   **Translating Lift**: Hover states on interactive cards use a discrete upward shift on the Y-axis (`hover:-translate-y-0.5 hover:shadow-hover transition duration-200 ease-out`).
*   **Ambient Floater**: Background details or active milestones use an organic, 6-second vertical float loop (`animate-float`).
*   **Input Focus**: Interactive inputs utilize sharp border shifts to pure ink slate rather than default blue rings:
    ```html
    <input className="border border-border focus:border-ink rounded-none outline-none transition" />
    ```

---
*Created and maintained as the core visual framework for Contrl Zaid.*
