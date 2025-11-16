# TestStac

A modern Next.js application built with reusable UI components, clean architecture, and optimized developer experience. This document includes setup steps, technical notes, design decisions, tradeoffs, and project structure.

---

## 🚀 Tech Stack

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **React Hook Form + Yup**
- **ESLint (Flat config) + Prettier**
- **Yarn (primary package manager)**

---

## 📦 Installation & Setup

Clone the project:

```bash
git clone <repo-url>
cd getstac
```

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Build for production:

```bash
yarn build
yarn start
```

---

## 🧱 Project Structure

```
src/
 ├── app/                 # Next.js routes (App Router)
 ├── components/          # Reusable UI + Form components
 │    ├── UI/             # Shared UI primitives (Modal, Sidebar, Logo...)
 │    ├── FormElements/   # Input, Checkbox, etc.
 │    └── helpers/        # Utility functions
 ├── svgs/                # Inline SVG assets
 └── types/               # Type declarations (SVG loaders, etc.)
```

---

## 🧩 Design Decisions & Tradeoffs

### **1. Reusable UI Components**

Created components like `StatContainer`, `Modal`, `Sidebar`, and `Logo` to maintain consistent UI patterns.
**Tradeoff:** Slightly more abstraction upfront, but it leads to scalable and maintainable UI.

### **2. Form Handling with React Hook Form + Yup**

Using RHF for performant forms and Yup for schema-based validation.
**Tradeoff:** Requires learning a schema system, but results in cleaner validation logic.

### **3. Sorting, Filtering & Table Logic with TanStack Table & Match Sorter Utils**

Provides robust table functionality and fuzzy search utilities.
**Tradeoff:** More setup than simple arrays, but far more scalable for dashboards.

### **4. Charts Implemented with Chart.js + Data Labels Plugin**

Provides simple graphing with good documentation.
**Tradeoff:** Not the lightest option, but easier to set up than D3.

### **5. Animations with Framer Motion**

Used for modal transitions, sidebar animations, and micro-interactions.
**Tradeoff:** Slight bundle cost, but unmatched simplicity for animations.

### **6. TailwindCSS v4 + Prettier Tailwind Plugin**

Ensures utility classes are automatically sorted.
**Tradeoff:** Requires plugin setup, but improves consistency.
