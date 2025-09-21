/**
 * Resources data structure:
 *
 * Each section has:
 * {
 *   category: {string} - Section title displayed in the UI (e.g. "Mosques in Ingolstadt 🕌"),
 *   type: {"card"|"links"|"list"} - Determines how the items are rendered
 *   items: {Array} - List of resources in this section
 *   footer?: {object} - (optional) footer actions (only applies to "links")
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
        description: "Available Monday–Friday, 8:00–17:30",
        tags: ["prayer", "campus", "student life"],
      },
      {
        slug: "ditib-ingolstadt-mosque",
        name: "DITIB Ingolstadt Mosque",
        locationLink: "https://maps.app.goo.gl/XB211WLYNUoE5AAw8",
        location: "Manisa Str. 1, 85057 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in Turkish / German",
        tags: ["prayer", "mosque", "turkish", "community"],
      },
      {
        slug: "al-nour-mosque",
        name: "Al-Nour Mosque",
        locationLink: "https://maps.app.goo.gl/Q7KNAn4ZkgdEGS3EA",
        location: "Asamstraße 14a, 85053 Ingolstadt",
        description: "Friday prayer 13:00 (winter) / 14:45 (summer), Khutba in Arabic",
        tags: ["prayer", "mosque", "arabic", "community"],
      },
      {
        slug: "as-salam-mosque",
        name: "As-Salam Mosque (Die Initiative e.V.)",
        location: "Roderstraße 44, 85055 Ingolstadt",
        description:
          "Friday prayer 13:00 (winter) / 15:00 (summer), Khutba in Arabic / German",
        tags: ["prayer", "mosque", "community", "events"],
      },
      {
        slug: "ayasofya-mosque",
        name: "Ayasofya Mosque",
        location: "Schillerstraße 8, 85055 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in Turkish",
        tags: ["prayer", "mosque", "turkish"],
      },
      {
        slug: "imam-azam-mosque",
        name: "Imam-Azam Mosque",
        location: "Hindenburgstraße 23A, 85057 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in Turkish",
        tags: ["prayer", "mosque", "turkish"],
      },
      {
        slug: "zaytounah-mosque",
        name: "Zaytounah Mosque",
        location: "Ettinger Str. 20, 85057 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in Arabic / German",
        tags: ["prayer", "mosque", "arabic", "german"],
      },
      {
        slug: "buhara-mosque",
        name: "Buhara e.V. Mosque",
        location: "Liebigstraße 24a, 85057 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in German",
        tags: ["prayer", "mosque", "german"],
      },
      {
        slug: "xhamia-mosque",
        name: "Xhamia Mosque (Albanian Mosque)",
        locationLink: "https://maps.app.goo.gl/9fvjuowGArekpbKUA",
        location: "Am Nordbahnhof 23A, 85049 Ingolstadt",
        description: "Friday prayer 13:30, Khutba in Albanian",
        tags: ["prayer", "mosque", "albanian"],
      },
    ],
  },
  {
    category: "Prayer Times 🕰️",
    type: "links",
    items: [
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (May)",
        href: "/pdfs/Al_Nour_Mosque_may_2025.pdf",
      },
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (June)",
        href: "/pdfs/Al_Nour_Mosque_june_2025.pdf",
      },
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (August)",
        href: "/pdfs/Al_Nour_Mosque_August_2025.pdf",
      },
    ],
    footer: {
      text: "Need a different month and/or mosque?",
      linkText: "Contact us",
      href: "/contact",
      links: [
        {
          label: "📱 MAWAQIT on App Store",
          href: "https://apps.apple.com/us/app/mawaqit-prayer-times-mosque/id1460522683",
          external: true,
        },
        {
          label: "📱 MAWAQIT on Google Play",
          href: "https://play.google.com/store/apps/details?id=com.kanout.mawaqit&pcampaignid=web_share",
          external: true,
        },
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
        description:
          "Indian restaurant with halal options — authentic spices & cozy atmosphere.",
        tags: ["indian", "halal-options", "dining"],
      },
      {
        slug: "sultans-kebab",
        name: "Sultan’s Kebab",
        location: "Kreuzstraße 5, 85049 Ingolstadt",
        description:
          "Popular for delicious kebabs & friendly service — ideal for quick meals.",
        tags: ["kebab", "fast food", "casual"],
      },
      {
        slug: "dolapi-doener",
        name: "Dölapi Döner Kebap Imbiss",
        location: "Schillerstraße 61, 85055 Ingolstadt",
        description:
          "Well-known for döner, pizza & fast food — generous portions & fast service.",
        tags: ["döner", "pizza", "fast food"],
      },
      {
        slug: "kurt-doener",
        name: "Kurt Döner Ingolstadt",
        location: "Münchener Str. 231, 85051 Ingolstadt",
        description: "Popular döner spot with high customer satisfaction.",
        tags: ["döner", "fast food"],
      },
      {
        slug: "maharani",
        name: "Maharani Indian Restaurant",
        location: "Friedrichshofener Str. 16, 85049 Ingolstadt",
        description:
          "Indian restaurant with halal options — known for authentic cuisine.",
        tags: ["indian", "halal-options", "dining"],
      },
      {
        slug: "indian-palace",
        name: "Indian Palace Ingolstadt",
        location: "Haunwöhrer Str. 81, 85051 Ingolstadt",
        description:
          "Indian buffet restaurant with halal options — loved for variety & taste.",
        tags: ["indian", "halal-options", "buffet"],
      },
      {
        slug: "dil-doener",
        name: "Dil Döner",
        location: "Proviantstraße 12, 85049 Ingolstadt",
        description:
          "Turkish restaurant with halal dishes — quick preparation & tasty combos.",
        tags: ["turkish", "döner", "fast food"],
      },
    ],
  },
  {
    category: "Prayer Times 🕰️",
    type: "links",
    items: [
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (May)",
        href: "/pdfs/Al_Nour_Mosque_may_2025.pdf",
      },
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (June)",
        href: "/pdfs/Al_Nour_Mosque_june_2025.pdf",
      },
      {
        label: "🕌 Al-Nour Mosque prayer times PDF (August)",
        href: "/pdfs/Al_Nour_Mosque_August_2025.pdf",
      },
    ],
    footer: {
      text: "Need a different month and/or mosque?",
      linkText: "Contact us",
      href: "/contact",
      links: [
        {
          label: "📱 MAWAQIT on App Store",
          href: "https://apps.apple.com/us/app/mawaqit-prayer-times-mosque/id1460522683",
          external: true,
        },
        {
          label: "📱 MAWAQIT on Google Play",
          href: "https://play.google.com/store/apps/details?id=com.kanout.mawaqit&pcampaignid=web_share",
          external: true,
        }
      ]
    }
  },
  {
    category: "Halal Markets Near Campus 🛒",
    type: "card",
    items: [
      {
        slug: "engin-markt",
        name: "Engin Markt GmbH",
        location: "Pfitznerstraße 20, 85057 Ingolstadt",
        description:
          "Large halal supermarket — fresh meat, Turkish groceries & specialties. Loved for quality & variety.",
        tags: ["halal-meat", "turkish", "market"],
      },
      {
        slug: "marka-supermarkt",
        name: "Marka Supermarkt",
        location: "Hindenburgstraße 20, 85057 Ingolstadt",
        description:
          "Spacious 1,500 m² halal supermarket — fresh meat, oriental spices, fruits & vegetables. Accessible with parking.",
        tags: ["halal", "oriental", "market"],
      },
    ],
  },
];
