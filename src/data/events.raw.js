/**
 * How to add a new event:
 * {
    slug: 'unique-url-part',
    title: 'Your Event Title',
    date: 'Event Date',
    location: 'Venue',
    description: 'A few lines describing the event.',
    image: 'path/to/image.jpg', // Import the image at the top of this file
    language: ['de', 'en', 'ar'], // Languages available for the event
    tags: [An array of tags like 'spiritual', 'community', 'social'],
    speakers: [an array of speaker names]
  }
 */
  export const events = [
    {
      slug: 'shaykh-taha-ali-talk-june-2025',
      title: 'Shaykh Taha Ali: Helper not Executioner 🤝',
      date: 'June 17, 2025',
      location: 'Room G215, THI, Ingolstadt',
      description:
        'Join us for an inspiring talk with Shaykh Taha Ali Zeidan about the Prophet’s ﷺ role as a source of mercy and compassion, not punishment. Explore Islamic ethics of leadership, forgiveness, and justice in today’s world. 🌿🕊️',
      image: "../assets/events/shaykh-taha-ali-talk-june-2025.jpg",
      language: ['de'],
      tags: ['Mercy', 'Prophet Muhammad ﷺ', 'Ethics', 'Leadership', 'Spirituality'],
      speakers: ['Shaykh Taha Ali Zeidan']
    },
    {
      slug: 'shaykh-osama-al-dimashqi-talk-december-2025', 
      title: 'Shaykh Osama Al-Dimashqi: Respectful Interaction Between Men and Women in Everyday Life 🧕🧑‍💼',
      date: 'Stay tuned for the date',
      location: 'Stay tuned for the exact room, THI, Ingolstadt',
      description:
        'A relevant and respectful discussion on gender interaction in Muslim communities, with Shaykh Osama Al-Dimashqi. Learn about Islamic guidelines, social conduct, and mutual respect in a diverse society. 🕌💬',
      image: "../assets/events/shaykh-osama-al-dimashqi-talk-december-2025.jpg",
      language: ['de', 'en'],
      tags: ['Gender Relations', 'Islamic Conduct', 'Respect', 'Community', 'Fiqh'],
      speakers: ['Shaykh Osama Al-Dimashqi']
    }
  ];
  
  