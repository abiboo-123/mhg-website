/**
 * Resources data structure:
 *
 * Each section has:
 * {
 *   category: {string} - Section title displayed in the UI (e.g. "Mosques in Ingolstadt 🕌"),
 *   type: {"card"|"links"|"list"} - Determines how the items are rendered:
 *        - "card": rich resource cards with details
 *        - "links": a collection of link buttons (with optional footer CTA)
 *        - "list": a simple plain-text list (lightweight option, e.g. for addresses)
 *   items: {Array} - List of resources in this section
 *   footer?: {object} - (optional) footer actions (only applies to "links")
 * }
 *
 * For type "card", each item has:
 * {
 *   slug: {string} - Unique identifier for the item,
 *   name: {string} - Display name of the resource,
 *   description: {string} - Short description of the resource,
 *   locationLink?: {string} - (optional) Google Maps link or external location URL,
 *   location?: {string} - (optional) Address or location description,
 *   tags?: {string[]} - (optional) Keywords for filtering/styling
 * }
 *
 * For type "links", each item has:
 * {
 *   label: {string} - Text shown in the UI (can include emojis),
 *   href: {string} - URL/path to the resource (internal or external)
 * }
 * 
 * Footer (for "links" sections only):
 * {
 *   text?: {string} - Helper text shown above/beside the links,
 *   linkText?: {string} - (legacy) single CTA label (e.g. "Contact us"),
 *   href?: {string} - (legacy) single CTA link,
 *   links?: {Array<{label: string, href: string, external?: boolean}>}
 *      - (optional) multiple CTA buttons (e.g. App Store / Google Play links)
 * }
 *
 * For type "list", each item has:
 * {
 *   name: {string} - Display name of the place/item,
 *   location?: {string} - Optional detail, like address or note
 * }
 */

export const rawResources = [
    {
      category: "Mosques in Ingolstadt 🕌",
      type: "card",
      items: [
        {
          slug: "ditib-ingolstadt-mosque",
          name: "DITIB Ingolstadt Mosque",
          locationLink: "https://maps.app.goo.gl/XB211WLYNUoE5AAw8",
          location: " Manisa Str. 1, 85057 Ingolstadt",
          description: "Friday prayer, Ramadan iftars, guest lectures",
          tags: ["prayer", "mosque", "community", "events", "turkish"],
        },
        {
          slug: "thi-prayer-room",
          name: "THI Prayer Room",
          locationLink: "https://maps.app.goo.gl/uqQjbNTWZvRk9Bdd8",
          location: "Building Z, First Floor",
          description: "On-campus prayer space available during university hours 8 AM - 6 PM",
          tags: ["prayer", "campus", "student life"],
        },
        {
          slug: "al-nour-mosque",
          name: "Al-Nour Mosque",
          locationLink: "https://maps.app.goo.gl/Q7KNAn4ZkgdEGS3EA",
          location: "Asamstraße 14a, 85053 Ingolstadt",
          description: "Friday prayer, community events, lectures",
          tags: ["prayer", "mosque", "community", "events", "arabic"],
        },
        {
          slug: "xhamia-mosque",
          name: "Xhamia Mosque (Albanian Mosque)",
          locationLink: "https://maps.app.goo.gl/9fvjuowGArekpbKUA",
          location: "Am Nordbahnhof 23A, 85049 Ingolstadt",
          description: "Regular prayers, community support, cultural events",
          tags: ["prayer", "mosque", "community", "events", "albanian"],
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
      category: "Halal Restaurants 🍽️",
      type: "card",
      items: [
        {
          slug: "ziyafet-restaurant",
          name: "Ziyafet Restaurant",
          description: "Top-rated halal döner & kebab in town — praised for flavour and quality. 🌯👍",
          locationLink: "https://maps.app.goo.gl/EjhVWnYPP4nh2w7D6",
          location: "Hindenburgstraße 23, 85057 Ingolstadt",
          tags: ["döner", "kebab", "casual dining"]
        },
        {
          slug: "hunkar-restaurant",
          name: "Hünkar Restaurant",
          description: "Turkish halal restaurant — köfte, chicken, baklava; open daily 11–23:30. 🧆🍗",
          locationLink: "https://maps.app.goo.gl/X7Jj4taHCuenDrbZ6",
          location: "Friedrich-Ebert-Straße 37, 85055 Ingolstadt",
          tags: ["köfte", "Turkish", "dinner"]
        },
        {
          slug: "aladin-imbiss",
          name: "Aladin Imbiss",
          description: "Halal-friendly Syrian restaurant with shawarma, falafel, and more. 🌯🥙",
          locationLink: "https://maps.app.goo.gl/2SitNoH2b6Ao1sg48",
          location: "Unterer Graben 89, 85049 Ingolstadt",
          tags: ["shawarma", "falafel", "casual dining", "syrian"]
        }
      ]
    },
    {
      category: "Halal Markets Near Campus 🛒",
      type: "card",
      items: [
        {
          slug: "istanbul-market",
          name: "Istanbul Market",
          description: "Well-stocked halal supermarket — meats, spices, veggies. Fresh lamb & goat on Wed/Fri. 🥩🧆",
          locationLink: "https://maps.app.goo.gl/xFcW3Lvx9CmfyYZN8",
          location: "Hindenburgstraße 21, Ingolstadt",
          tags: ["halal-meat", "grocery", "fresh"]
        },
        {
          slug: "saray-market",
          name: "Saray Market",
          description: "Turkish grocery with halal essentials — meat, snacks, household items. 🛍️",
          locationLink: "https://maps.app.goo.gl/MQgNPYoX8y5YyM3k9",
          location: "Altstadt, Ingolstadt",
          tags: ["market", "Turkish", "halal"]
        },
        {
          slug: "ali-baba-lebensmittel",
          name: "Ali Baba Lebensmittel",
          description: "Middle Eastern supermarket with fresh produce and halal meat. 🍅🥩",
          locationLink: "https://maps.app.goo.gl/SHkphHHQXhew4FqD8",
          location: "Schloßlände 4, Ingolstadt",
          tags: ["halal", "Middle Eastern", "market"]
        }
      ]
    },    
  ];
  