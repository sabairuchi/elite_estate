# Elite Estate - Premium Apartment Listings Platform (Milestone 1)

Elite Estate is a modern, responsive, and luxury property listing platform built as the first milestone of a full-scale real estate application. This milestone delivers a pixel-perfect, premium user interface using React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

---

## 🚀 Key Features Built in Milestone 1

1. **Elegant Homepage**
   - Premium parallax-style Hero banner with dark overlay, dynamic taglines, and animated entrances.
   - High-fidelity visual-only search filters (Location, Property Type, Bedrooms, Budget).
   - Featured listings displaying 6 hand-selected properties with spec details, hover zoom, and elevation shadows.
   - Persistent "Add to Favorites" functionality storing user selections locally (using `localStorage`).
   - "Why Choose Us" benefits dashboard, customer testimonial reviews, and styled call-to-action blocks.

2. **Professional About Us Page**
   - Detailed history ("Our Story") paired with architectural design imagery.
   - Core Mission & Vision statement card structures.
   - Counter statistics displaying key performance indicators (500+ Families, 100+ Properties, 15+ Cities).
   - Meet our Leadership team grid showcasing modern corporate profile cards.

3. **Modern Contact Page**
   - High-fidelity form (Name, Email, Phone, Subject, Message) with input validation.
   - Success state triggers and alert modals upon contact request submit.
   - Comprehensive office address, email channels, and business hour information panels.
   - A highly custom, stylized CSS-only map visualization complete with pulsing coordinate markers and navigation redirects.

4. **Sticky Navigation & Footer**
   - Glassmorphic top navbar blur with interactive mobile hamburger menus.
   - "Book Viewing" quick schedule modal with date and time selectors.
   - Full footer linking to legal docs, newsletter forms, and social media portals.

5. **Future Scalability Preparations**
   - Fully configured client-side routing using `react-router-dom`.
   - Setup `ScrollToTop` resets to prevent window offsets on route change.
   - Pre-configured placeholder pages with informative "sneak peek" layouts for `Listings`, `Property Details` (fully parameterized), and `Admin Dashboard` routes.
   - Single Page Application (SPA) rewrite rules defined in `vercel.json` for seamless deployment.

---

## 🛠️ Tech Stack & Dependencies

- **Core**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer
- **Navigation**: React Router DOM (v6)
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 💻 Local Setup & Execution

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 16.x or higher recommended).

### 2. Clone and Install Dependencies
Navigate to the root workspace and run:
```bash
npm install
```

### 3. Start Development Server
Launch the local dev environment with:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
To test bundling and generate static production assets:
```bash
npm run build
```

---

## 📂 Project Structure

```
src/
 ├─ assets/          # Static elements and icons
 ├─ components/      # Shared visual UI elements
 │   ├─ Layout.tsx   # Header/Footer wrapper
 │   ├─ Navbar.tsx   # Top navigation & viewing scheduling modal
 │   ├─ Footer.tsx   # Deep bottom directory links & newsletter
 │   ├─ SearchBar.tsx # Query filters UI
 │   ├─ PropertyCard.tsx # Listing card & favorite local state
 │   └─ ScrollToTop.tsx # Scroll reset component
 ├─ data/            # Local data models
 │   └─ properties.ts # 6 mock luxury residences
 ├─ pages/           # High-level route pages
 │   ├─ Home.tsx     # Home page blocks
 │   ├─ About.tsx    # Details on history & team
 │   ├─ Contact.tsx  # Inquiries and custom maps
 │   ├─ ListingsPlaceholder.tsx  # Catalog previews
 │   ├─ DetailsPlaceholder.tsx   # Mock detail specifications
 │   └─ AdminPlaceholder.tsx     # Staff control mockups
 ├─ types/           # Core typing contracts
 │   └─ property.ts  # Property structure contract
 ├─ App.tsx          # Client-side router mappings & page fade animations
 ├─ index.css        # Tailwind definitions & glassmorphism custom classes
 └─ main.tsx         # Render engine entry point
```

---

## 🌐 Vercel Deployment

This project includes a `vercel.json` file to enable clean reload redirects. To deploy on Vercel:
1. Connect this repository to your Vercel Account.
2. Select **Vite** as the framework preset (Vercel detects this automatically).
3. Click **Deploy**.
