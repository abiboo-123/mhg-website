# 🕌 MHG Ingolstadt – Event & Community Platform

A multilingual **event and community platform** built for **Muslim students at THI (Technische Hochschule Ingolstadt)** to help them connect, get involved, and attend events organized by the **MHG Ingolstadt** community.

This platform provides a welcoming space for students to:

- Discover upcoming and past events
- Access helpful resources
- Connect with partners and team members
- Learn more about MHG and its mission

> 🧭 The project is built with **Astro**, **React**, and **TailwindCSS**, and integrates with **Supabase**, **Cloudinary**, and other services for dynamic content and automation.

---

## 🌍 Features

### 👥 Community & Events

- Browse **upcoming and past events** with detailed descriptions and images
- View **resources** and links relevant to Muslim student life in Ingolstadt
- Explore **partners** and community organizations working with MHG
- Learn about the **team** behind the initiative

### 🌐 Multilingual Interface

- Full support for **English (en)** and **German (de)**
- Automatic translation for some content using custom translation scripts

### 📱 User Experience

- Responsive, fast, and mobile-friendly design
- Clean and modern UI built with Tailwind and Astro components
- Accessible navigation through localized routes (`/[lang]/...`)

---

## 🧩 Tech Stack

| Category       | Tools / Libraries                 |
| -------------- | --------------------------------- |
| Framework      | [Astro](https://astro.build)      |
| UI             | React, TailwindCSS                |
| Deployment     | Vercel (Server output)            |
| Backend / Data | Supabase, Node.js scripts         |
| Media          | Cloudinary                        |
| Translation    | translate-google                  |
| Analytics      | Vercel Analytics & Speed Insights |

---

## 🗂️ Project Structure

```
src/
├── assets/           # Logos, images, and team photos
├── components/       # UI components (cards, footer, header, etc.)
├── data/             # Main data sources (events, resources, partners, etc.)
├── i18n/             # Translation JSON files (de/en)
├── layouts/          # Shared page layout(s)
├── pages/            # Website pages (excluding admin or competition routes)
├── styles/           # Custom styles if needed
├── utils/            # Helper functions
```

---

## 🧭 Navigation (User-Facing Pages)

> All routes are localized (e.g. `/en/events`, `/de/events`).
> Admin routes and the **Children’s Painting Competition 2025** section are intentionally excluded.

| Page            | Path                  | Description                                              |
| --------------- | --------------------- | -------------------------------------------------------- |
| **Home**        | `/[lang]/`            | Overview, welcome message, highlights of upcoming events |
| **About**       | `/[lang]/about`       | MHG mission and goals                                    |
| **Events**      | `/[lang]/events`      | Upcoming events list                                     |
| **Past Events** | `/[lang]/past-events` | Archive of previous events                               |
| **Resources**   | `/[lang]/resources`   | Helpful links and downloadable materials                 |
| **Partners**    | `/[lang]/partners`    | Partner organizations with logos and descriptions        |
| **Team**        | `/[lang]/about`       | List of team members (via `team.js` data)                |
| **Contact**     | `/[lang]/contact`     | Contact form or info                                     |
| **Donate**      | `/[lang]/donate`      | Donation information                                     |

---

## 💾 Data Files (Located in `src/data/`)

These files define most of the site’s dynamic content.
You can safely update them to change what appears on the website.

---

### `events.raw.js` ✅ _(Active)_

- The **main source of event data** in raw (untranslated) form.
- Contains an array of event objects such as:

  ```js
  {
    id: "unique-id",
    title: "Event Title",
    date: "2025-03-21",
    description: "Event description",
    image: "/path/to/image.jpg",
    location: "THI Campus, Room 101"
  }
  ```

- **Required fields:** `id`, `title`, `date`, `description`
- **Optional fields:** `image`, `location`
- Used as the **base file** for translation and event generation scripts.

---

### `events.translated.json` ✅ _(Active)_

- The **translated version** of `events.raw.js`.
- Contains event content localized into English and German.
- **Used by the site at runtime** to display events in multiple languages.
- You can safely update minor translations, but normally this file is generated automatically with:

  ```bash
  npm run translate:events
  ```

---

### `events.js` ❌ _(Not in Use)_

- This file is kept for legacy reasons or fallback purposes.
- The project now exclusively uses `events.raw.js` and `events.translated.json`.
- You can ignore or remove it unless needed for compatibility.

---

### `resources.js`

- List of external resources, documents, or links.

  ```js
  {
    title: "Prayer Times",
    link: "https://example.com/prayer-times",
    description: "Check daily prayer times in Ingolstadt"
  }
  ```

- **Required fields:** `title`, `link`
- **Optional:** `description`
- Used in `/[lang]/resources` page.

---

### `resources.translated.json`

- Auto-generated version of `resources.js` translated into multiple languages.
- **Do not edit manually.**

---

### `partners.js`

- Contains information about partner organizations:

  ```js
  {
    name: "DITIB Mosque",
    logo: "/assets/logos/ditib-logo.jpg",
    link: "https://ditib-ingolstadt.de",
    description: "Partner description"
  }
  ```

- **Required:** `name`, `logo`
- **Optional:** `link`, `description`
- Used by: `PartnerCard.astro`.

---

### `team.js`

- Lists the team members of MHG Ingolstadt:

  ```js
  {
    name: "Ahmed Aous",
    role: "President",
    image: "/assets/team/Ahmed_Aous.jpg"
  }
  ```

- **Required:** `name`, `role`
- **Optional:** `image`
- Used by: `TeamMember.astro`.

---

### `links.js`

- Contains general links used across the site (socials, contact links, etc.)
- Can be safely updated; all entries should include `title` and `url`.

---

### `aboutCards.js`

- Provides content blocks for the “About” page (e.g., vision, mission, values).

---

## ⚙️ Scripts

Scripts are located in the `/scripts` directory and automate translations and image generation.

| Script                  | Command                       | Description                                                                                                |
| ----------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **translate:events**    | `npm run translate:events`    | Translates event data from `events.raw.js` into multiple languages and writes to `events.translated.json`. |
| **translate:resources** | `npm run translate:resources` | Translates resource data into multiple languages and writes to `resources.translated.json`.                |
| **translate**           | `npm run translate`           | Runs both translation scripts.                                                                             |
| **generate:events**     | `npm run generate:events`     | Uses **Cloudinary** and **Satori** to generate event image cards automatically.                            |

> ⚠️ Note: translation scripts rely on `translate-google` and require internet access.

---

## 🧱 Components Overview

| Component                                              | Purpose                             |
| ------------------------------------------------------ | ----------------------------------- |
| `EventCard.astro`                                      | Displays individual event info      |
| `PastEventsCard.astro`                                 | Displays past events in grid format |
| `PartnerCard.astro`                                    | Renders partner logo + description  |
| `ResourceCard.astro`                                   | Displays links/resources            |
| `TeamMember.astro`                                     | Displays a team member profile      |
| `Header.astro` / `Footer.astro`                        | Global layout components            |
| `Card.astro`, `Likert.astro`, `UnifiedEventCard.astro` | General reusable UI building blocks |

---

## 🧑‍💻 Developer Guide

### 🔧 Installation

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### 🌐 Deployment (Vercel)

This project uses the **Vercel adapter** for Astro.
Deploying is as simple as connecting your GitHub repository to [Vercel](https://vercel.com) — Vercel automatically detects the Astro configuration.

Ensure your **output mode** in `astro.config.mjs` is set to:

```js
output: 'server',
adapter: vercel(),
```

---

## 🔑 Environment Variables

Depending on your configuration and scripts, you may need:

| Variable             | Purpose                      |
| -------------------- | ---------------------------- |
| `SUPABASE_URL`       | Supabase project URL         |
| `SUPABASE_KEY`       | Supabase API key             |
| `CLOUDINARY_URL`     | Cloudinary connection string |
| `FORMBRICKS_API_KEY` | Formbricks integration key   |

You can add them to a `.env` file in the root directory.

---

## 🧾 License

This project is proprietary and maintained by **MHG Ingolstadt**.
All rights reserved.
Do not distribute or reuse code without permission.

---

## 💬 Contact

For inquiries or contributions, contact the **MHG Ingolstadt** team through the official site or via provided social links.
