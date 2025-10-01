/**
 * ============================
 * Resources Data Structure Guide
 * ============================
 *
 * Each section has this shape:
 *
 * {
 *   category: {string} - Section title displayed in the UI (e.g. "Mosques in Ingolstadt 🕌"),
 *   type: {"card" | "links" | "list"} - Determines how the items are displayed:
 *       - "card": detailed resource cards (recommended for places like mosques, restaurants, markets)
 *       - "links": a collection of clickable links (e.g. prayer time PDFs)
 *       - "list": simple text list (lightweight option, e.g. addresses)
 *   items: {Array} - Array of resources (format depends on type)
 *   footer?: {object} - (optional) footer actions (for "links" sections only)
 * }
 *
 * ----------------------------
 * Template for a "card" item:
 * ----------------------------
 * {
 *   slug: {string} - unique identifier (used in URLs or keys, e.g. "thi-prayer-room"),
 *   name: {string} - display name of the resource,
 *   locationLink?: {string} - (optional) Google Maps or external link,
 *   location?: {string} - (optional) address or location description,
 *   description: {string} - short description (standardized style recommended),
 *   tags?: {string[]} - (optional) keywords for filtering/styling
 * }
 *
 * Example:
 * {
 *   slug: "thi-prayer-room",
 *   name: "THI Prayer Room",
 *   locationLink: "https://maps.app.goo.gl/example",
 *   location: "Building Z, First Floor",
 *   description: "Prayer space available Monday–Friday, 8:00–17:30.",
 *   tags: ["prayer", "campus", "student life"]
 * }
 *
 * ----------------------------
 * Template for a "links" section:
 * ----------------------------
 * {
 *   label: {string} - link text (can include emoji),
 *   href: {string} - link target (internal or external URL)
 * }
 *
 * Example:
 * {
 *   label: "🕌 Al-Nour Mosque prayer times PDF (May)",
 *   href: "/pdfs/Al_Nour_Mosque_may_2025.pdf"
 * }
 *
 * ----------------------------
 * Template for a "list" section:
 * ----------------------------
 * {
 *   name: {string} - display text (e.g. "Mosque A"),
 *   location?: {string} - (optional) extra detail like an address
 * }
 *
 * Example:
 * {
 *   name: "Community Mosque",
 *   location: "Main Street 123, Ingolstadt"
 * }
 *
 * ----------------------------
 * Template for footer (links sections only):
 * ----------------------------
 * {
 *   text?: {string} - helper text (appears above/beside links),
 *   linkText?: {string} - (legacy) single CTA label,
 *   href?: {string} - (legacy) single CTA link,
 *   links?: [{ label: string, href: string, external?: boolean }] - multiple CTA buttons
 * }
 *
 * Example:
 * footer: {
 *   text: "Need a different month and/or mosque?",
 *   linkText: "Contact us",
 *   href: "/contact",
 *   links: [
 *     { label: "📱 MAWAQIT on App Store", href: "https://apps.apple.com/example", external: true },
 *     { label: "📱 MAWAQIT on Google Play", href: "https://play.google.com/example", external: true }
 *   ]
 * }
 */

export const rawResources = [
  {
    category: "Mosques in Ingolstadt 🕌",
    type: "card",
    items: [
      {
        slug: "thi-prayer-room",
        name: "THI Prayer Room",
        locationLink: "https://maps.app.goo.gl/uqQjbNTWZvRk9Bdd8",
        location: "Building Z, First Floor",
        description: "Prayer space available Monday–Friday, 8:00–17:30.",
        tags: ["prayer", "campus", "student life"],
      },
      {
        slug: "ditib-kocatepe-mosque",
        name: "DITIB Kocatepe Mosque",
        locationLink: "https://maps.app.goo.gl/XB211WLYNUoE5AAw8",
        location: "Manisa Str. 1, 85057 Ingolstadt",
        description: "Friday prayer 13:30. Khutba in Turkish / German.",
        tags: ["prayer", "mosque", "turkish", "community"],
      },
      {
        slug: "milligorues-mosque",
        name: "Islamische Gemeinschaft Millî Görüş Ingolstadt e.V.",
        location: "Schillerstraße 6, 85055 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/WpW3NYR6MtFXBs6g7",
        description: "Friday prayer 13:30.",
        tags: ["prayer", "mosque", "community"],
      },
      {
        slug: "al-nour-mosque",
        name: "Al-Nour Mosque",
        locationLink: "https://maps.app.goo.gl/Q7KNAn4ZkgdEGS3EA",
        location: "Asamstraße 14a, 85053 Ingolstadt",
        description: "Friday prayer 13:00 (winter) / 14:45 (summer). Khutba in Arabic.",
        tags: ["prayer", "mosque", "arabic", "community"],
      },
      {
        slug: "imam-azam-mosque",
        name: "Imam-Azam Mosque",
        location: "Hindenburgstraße 23A, 85057 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/NRksigRaWBzpPWkS9",
        description: "Friday prayer 13:30. Khutba in Turkish.",
        tags: ["prayer", "mosque", "turkish"],
      },
      {
        slug: "zaytounah-mosque",
        name: "Zaytounah Mosque",
        location: "Ettinger Str. 20, 85057 Ingolstadt",
        LocationLink: "https://maps.app.goo.gl/b3pGPgVKS2cVPHjt7",
        description: "Friday prayer 13:30. Khutba in Arabic / German.",
        tags: ["prayer", "mosque", "arabic", "german"],
      },
      {
        slug: "buhara-mosque",
        name: "Buhara e.V. Mosque",
        location: "Liebigstraße 24a, 85057 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/H87d1rzq2rnBuZfD6",
        description: "Friday prayer 13:30. Khutba in German.",
        tags: ["prayer", "mosque", "german"],
      },
      {
        slug: "xhamia-mosque",
        name: "Xhamia Mosque (Albanian Mosque)",
        locationLink: "https://maps.app.goo.gl/9fvjuowGArekpbKUA",
        location: "Am Nordbahnhof 23A, 85049 Ingolstadt",
        description: "Friday prayer 13:30. Khutba in Albanian.",
        tags: ["prayer", "mosque", "albanian"],
      },
    ],
  },
  {
    category: "Prayer Times 🕰️",
    type: "links",
    items: [
      // sort by most recent month first
      { label: "🕌 Al-Nour Mosque prayer times PDF (Actober)", href: "/pdfs/Al_Nour_Mosque_october_2025.pdf" },
      { label: "🕌 Al-Nour Mosque prayer times PDF (September)", href: "/pdfs/Al_Nour_Mosque_sep_2025.pdf" },
      { label: "🕌 Al-Nour Mosque prayer times PDF (August)", href: "/pdfs/Al_Nour_Mosque_August_2025.pdf" }
    ],
    footer: {
      text: "Need a different month and/or mosque?",
      linkText: "Contact us",
      href: "/contact",
      links: [
        { label: "📱 MAWAQIT on App Store", href: "https://apps.apple.com/us/app/mawaqit-prayer-times-mosque/id1460522683", external: true },
        { label: "📱 MAWAQIT on Google Play", href: "https://play.google.com/store/apps/details?id=com.kanout.mawaqit&pcampaignid=web_share", external: true },
      ],
    },
  },
  {
    category: "Halal Restaurants 🍽️",
    type: "card",
    items: [
      {
        slug: "safran",
        name: "Safran",
        location: "Schmalzingergasse 15, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/RMZ7SFZ5hHCDqmHSA",
        description: "Indian restaurant with halal options, authentic spices and cozy atmosphere.",
        tags: ["indian", "halal-options", "dining"],
      },
      {
        slug: "sultans-kebab",
        name: "Sultan’s Kebab",
        location: "Kreuzstraße 5, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/2e88QtcNXuqXrd22A",
        description: "Turkish fast food spot, popular for kebabs and friendly service.",
        tags: ["kebab", "fast food", "casual"],
      },
      {
        slug: "dolapi-doener",
        name: "Dölapi Döner Kebap Imbiss",
        location: "Schillerstraße 61, 85055 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/SQnWiUjv71z2maiE7",
        description: "Casual spot known for döner, pizza, and generous portions.",
        tags: ["döner", "pizza", "fast food"],
      },
      {
        slug: "kurt-doener",
        name: "Kurt Döner Ingolstadt",
        location: "Münchener Str. 231, 85051 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/GBnpyefBGdZZHJnu8",
        description: "Well-rated döner shop with high customer satisfaction.",
        tags: ["döner", "fast food"],
      },
      {
        slug: "maharani",
        name: "Maharani Indian Restaurant",
        location: "Friedrichshofener Str. 16, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/hA1u9XGD2dVGShvR8",
        description: "Indian restaurant with halal options, appreciated for authentic cuisine.",
        tags: ["indian", "halal-options", "dining"],
      },
      {
        slug: "saray-grill",
        name: "Saray Grill",
        location: "Harderstraße 27, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/MQgNPYoX8y5YyM3k9",
        description: "Popular Turkish grill serving döner, kebab, and quick halal meals, known for good taste and friendly service.",
        tags: ["döner", "kebab", "fast food", "casual dining", "turkish"]
      },      
      {
        slug: "indian-palace",
        name: "Indian Palace Ingolstadt",
        location: "Haunwöhrer Str. 81, 85051 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/uzbG2NrV3XCHxvdJ6",
        description: "Buffet-style Indian restaurant with halal options and wide variety.",
        tags: ["indian", "halal-options", "buffet"],
      },
      {
        slug: "dil-doener",
        name: "Dil Döner",
        location: "Proviantstraße 12, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/7gq27C16VWXUseys7",
        description: "Turkish fast food with halal dishes and quick service.",
        tags: ["turkish", "döner", "fast food"],
      },
      {
        slug: "ziyafet-restaurant",
        name: "Ziyafet Restaurant",
        location: "Hindenburgstraße 23, 85057 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/EjhVWnYPP4nh2w7D6",
        description: "Halal döner and kebab restaurant known for flavour and quality.",
        tags: ["döner", "kebab", "casual dining"],
      },
      {
        slug: "hunkar-restaurant",
        name: "Hünkar Restaurant",
        location: "Friedrich-Ebert-Straße 37, 85055 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/X7Jj4taHCuenDrbZ6",
        description: "Turkish halal restaurant serving köfte, chicken, and desserts.",
        tags: ["köfte", "turkish", "dinner"],
      },
      {
        slug: "aladin-imbiss",
        name: "Aladin Imbiss",
        location: "Unterer Graben 89, 85049 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/2SitNoH2b6Ao1sg48",
        description: "Syrian halal-friendly eatery with shawarma, falafel, and more.",
        tags: ["shawarma", "falafel", "casual dining", "syrian"],
      },
    ],
  },
  {
    category: "Halal Markets Near Campus 🛒",
    type: "card",
    items: [
      {
        slug: "engin-markt",
        name: "Engin Markt GmbH",
        location: "Pfitznerstraße 20, 85057 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/B1WfdZV1CrfZSTMm8",
        description: "Large halal supermarket, fresh meat, Turkish groceries, and specialties.",
        tags: ["halal-meat", "turkish", "market"],
      },
      {
        slug: "marka-supermarkt",
        name: "Marka Supermarkt",
        location: "Hindenburgstraße 20, 85057 Ingolstadt",
        locationLink: "https://maps.app.goo.gl/QqWGiMvjemJBG67w9",
        description: "Spacious 1,500 m² halal supermarket, meat, spices, fruits, and vegetables.",
        tags: ["halal", "oriental", "market"],
      },
      {
        slug: "istanbul-market",
        name: "Istanbul Market",
        location: "Hindenburgstraße 21, Ingolstadt",
        locationLink: "https://maps.app.goo.gl/xFcW3Lvx9CmfyYZN8",
        description: "Halal supermarket offering meat, spices, and fresh produce.",
        tags: ["halal-meat", "grocery", "fresh"],
      },
      {
        slug: "ali-baba-lebensmittel",
        name: "Ali Baba Lebensmittel",
        location: "Schloßlände 4, Ingolstadt",
        locationLink: "https://maps.app.goo.gl/SHkphHHQXhew4FqD8",
        description: "Middle Eastern supermarket with fresh produce and halal meat.",
        tags: ["halal", "middle eastern", "market"],
      },
    ],
  },
];
