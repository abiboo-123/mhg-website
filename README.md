# 🌙 MHG Ingolstadt Website – Frontend

This is the official (yet unpublished) website for **MHG Ingolstadt**, a Muslim student group at Ingolstadt University. It provides a clean, modern, and multilingual platform to help MHG reach students, share events, and offer useful resources.

🌐 **Preview**: [https://mhg-website-phi.vercel.app/de](https://mhg-website-phi.vercel.app/de)

---

## ✨ Features

- 🔥 Built with [Astro](https://astro.build/) + [TailwindCSS](https://tailwindcss.com/)
- 🌍 Multilingual support (English, German, Arabic)
- 📆 Dynamic Events page with registration
- 🧑‍🤝‍🧑 Team, Partners, and Resources pages
- 📦 Smart auto-translation with caching via `translate-google`
- 📬 Formspree integration for contact and registration forms

---

## 🗂️ Project Structure

```
mhg-frontEnd/
│
├── .astro/                # Astro build cache
├── .cache/                # Translation cache (used by scripts)
├── .vscode/               # VSCode settings (optional)
├── node_modules/          # Project dependencies
│
├── public/                # Static assets (favicon, PDFs, event images)
│   ├── events/
│   ├── images/
│   ├── logos/
│   ├── pdfs/
│
├── scripts/               # Scripts for translation
│   ├── translateEvents.js
│   ├── translateResources.js
│
├── src/                   # Main source folder
│   ├── assets/            # Static logos/images used via Astro <Image />
│   ├── components/        # Astro UI components (Card, Footer, Header, etc.)
│   ├── data/              # Raw and translated data files (events, resources)
│   ├── i18n/              # Translations for static text (ar.json, de.json, en.json)
│   ├── layouts/           # Shared layout templates
│   ├── pages/             # Language-prefixed pages (dynamic + static)
│   │   ├── [lang]/        # e.g., /en/, /de/, /ar/
│   │       ├── events/[slug].astro
│   │       ├── register/[slug].astro
│   │       ├── index.astro, about.astro, ...
│   ├── styles/            # Global styles
│   ├── utils/             # Helper functions like `t.js` and `translate.js`
│
├── astro.config.mjs       # Astro config
├── tailwind.config.js     # Tailwind setup
├── tsconfig.json          # TypeScript settings
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS setup
├── requirements.txt       # (Optional) Python dependencies for Formspree backend logic
├── README.md              # You’re here!
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Dev Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

---

## 🧠 Translation System

- Translations for `events` and `resources` are generated using two scripts:
  - `scripts/translateEvents.js`
  - `scripts/translateResources.js`
- These scripts:
  - Read the raw data
  - Translate needed fields to `de` and `ar`
  - Cache results to `.cache/translation.cache.json`
  - Output final translations to `src/data/*.translated.json`

---

## 🧩 Components Used

- `Header.astro`, `Footer.astro` – shared across all pages
- `Card.astro`, `EventCard.astro`, `ResourceCard.astro`, `TeamMember.astro` – modular UI cards
- `BaseLayout.astro` – wraps each page with layout + head metadata

---

## 🛠 Improvements & To-Dos

- [ ] Add backend support for form submissions (optional, fallback is Formspree)
- [ ] Add image fallback / loading indicators
- [ ] SEO enhancements for multilingual support (meta tags per lang)
- [ ] Accessibility (ARIA labels, better color contrast)
- [ ] Admin dashboard for managing events/resources (future phase)

---


## 📬 Contact

For any questions or contributions, feel free to reach out to the MHG Ingolstadt team.

---

## 🖋️ Author

**Habib Gouda**: [LinkedIn](https://www.linkedin.com/in/habib-mohamed-gouda), [Github](https://github.com/abiboo-123/)

---

## 📄 License

This project is private and not licensed for public distribution (yet).
