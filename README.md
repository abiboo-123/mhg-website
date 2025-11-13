# 🕌 MHG Ingolstadt – Event & Community Platform

A multilingual **event and community platform** built for **Muslim students at THI (Technische Hochschule Ingolstadt)**.
It helps students stay connected, attend events, access resources, and engage with the MHG community.

The platform is designed to be:

- 📅 **Event-focused** — upcoming & past events
- 🌍 **Multilingual** — English & German
- 📱 **Modern & responsive** — built with Astro + React
- ⚡ **Dynamic** — all data is managed through a custom admin dashboard

---

# 🌍 Features

## 👥 Community & Events

- Browse **upcoming and past events**
- View full **event details**, galleries, and banners
- Read event content in **English or German**
- Explore **resources**, partners, and team info

## 🛠️ Admin Dashboard (Private)

- Add / edit / delete events
- Upload banners & image galleries
- Manage translations (EN/DE)
- Auto-generate event card images (Satori + ImageKit)
- Full role-based access control (Supabase Auth)

## 🌐 Multilingual Interface

- Localized routes (`/[lang]/...`)
- Content served dynamically from the database
- Seamless EN/DE switching

## 📱 User Experience

- Fast, mobile-first, clean design
- Astro + React components
- Optimized images via ImageKit CDN

---

# 🧩 Tech Stack

| Category      | Tools / Libraries                        |
| ------------- | ---------------------------------------- |
| Framework     | Astro (server mode) + React islands      |
| UI            | TailwindCSS                              |
| Backend       | Supabase (Postgres + Auth)               |
| Media Storage | ImageKit (banners, galleries, card imgs) |
| Image Gen     | Satori + Sharp                           |
| Deployment    | Vercel                                   |
| Auth          | Supabase Email/Password + Middleware     |
| Analytics     | Vercel Analytics                         |

---

# 🗂️ Project Structure

```
src/
├── components/           # Astro/React UI components
├── layouts/              # Shared layouts
├── pages/                # Public + API routes (+admin)
│   ├── api/              # Public + admin APIs
│   ├── [lang]/           # Multilingual frontend pages
├── lib/                  # Supabase clients, utils
├── styles/               # Global styles (Tailwind)
└── types/                # TS interfaces
```

> Note: The old `src/data/*.js` files are being **phased out** as real data now comes from Supabase.

---

# 🧭 Navigation (Public Site)

All routes are localized (`/en/...` and `/de/...`).

| Page             | Path                    | Description                        |
| ---------------- | ----------------------- | ---------------------------------- |
| **Home**         | `/[lang]/`              | Highlights, intro, featured events |
| **Events**       | `/[lang]/events`        | All upcoming events                |
| **Past Events**  | `/[lang]/past-events`   | Archive of previous events         |
| **Event Detail** | `/[lang]/events/[slug]` | Full event details + gallery       |
| **Resources**    | `/[lang]/resources`     | Helpful links & materials          |
| **Partners**     | `/[lang]/partners`      | Community partners & logos         |
| **Team**         | `/[lang]/about`         | Team member profiles               |
| **Contact**      | `/[lang]/contact`       | Contact form / info                |
| **Donate**       | `/[lang]/donate`        | Donation information               |

Admin dashboard lives under:

```
/admin/
```

(Protected by Supabase Auth + middleware.)

---

# 💾 Data Sources (Live API)

The site no longer depends on static `.js` or `.json` data files.

Instead, all content is loaded from **public API endpoints**:

| Endpoint                    | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `/api/public/events`        | List of upcoming/past events (EN/DE aware)          |
| `/api/public/events/[slug]` | Full event detail + translations + gallery + banner |
| `/api/public/resources`     | All resources                                       |
| `/api/public/partners`      | Partners & logos                                    |

Admin-managed data is stored in:

- `events`
- `event_translations`
- `event_media`
- (upcoming) partners, resources, users

---

# 🛠️ Admin Dashboard Features

The admin dashboard allows authorized users to:

### **Event Management**

- Create events (date, time, location, slug, visibility)
- Add EN/DE translations (title, description, tags)
- Upload banners
- Upload/reorder/delete gallery images
- Mark event as highlighted or published
- Auto-generate event card images (via Satori)

### **Media Handling**

- ImageKit upload/delete
- Position tracking for galleries
- Banner replacement with CDN invalidation

### **Auth & Security**

- Supabase email/password login
- HTTP-only cookies for sessions
- Middleware role enforcement
- Service role key for internal API actions

---

# ⚙️ Developer Guide

## 🔧 Installation

```bash
npm install
npm run dev
```

## 🏗️ Build

```bash
npm run build
npm run preview
```

## 🌐 Deployment (Vercel)

Uses Astro’s Vercel adapter:

```js
export default defineConfig({
  output: "server",
  adapter: vercel(),
});
```

Deploy by connecting your GitHub repo to Vercel.

---

# 🔑 Environment Variables

Create a `.env` file:

| Variable                       | Purpose                   |
| ------------------------------ | ------------------------- |
| `PUBLIC_SUPABASE_URL`          | Supabase project URL      |
| `PUBLIC_SUPABASE_ANON_KEY`     | Public Supabase key       |
| `SUPABASE_SERVICE_ROLE_KEY`    | For admin API operations  |
| `PUBLIC_IMAGEKIT_URL_ENDPOINT` | CDN delivery URL          |
| `PUBLIC_IMAGEKIT_PUBLIC_KEY`   | Client-side preview key   |
| `IMAGEKIT_PRIVATE_KEY`         | Private upload/delete key |
| `COOKIE_SECRET`                | Session cookie signing    |

---

# 🧾 License

This project is proprietary and maintained by **MHG Ingolstadt**.
All rights reserved.
Do not distribute or reuse without permission.

---

# 💬 Contact

For inquiries or contributions, please contact the MHG Ingolstadt team via the official website or provided social links.
