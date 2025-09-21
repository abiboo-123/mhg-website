/**
 * How to add a new event:
 * {
    slug: 'unique-url-part',
    title: 'Your Event Title',
    date: 'Event Date',
    location: 'Venue',
    description: 'A few lines describing the event.',
    image: 'path/to/image.jpg', // Import the image at the top of this file
    cardImage: "/gallery/gallery1.jpg", // Image used for the event card on the events page
    language: ['de', 'en'], // Languages available for the event
    tags: [An array of tags like 'spiritual', 'community', 'social'],
    speakers: [an array of speaker names],
    attendance: # of attendance , Number of attendees after the event 
    gallery: [an array of image file names for the event gallery], // Example: ["gallery1.jpg", "gallery2.jpg"]
    available: [true/false], // If the event is available for registration or still a draft
    past: [true/false] // If the event has already occurred
    highlighted: true/false // If the event should be highlighted on the main page
    registerAvailable: true/false // If registration is open
  }
 */

// Please keep the events sorted by status (Draft, Upcoming, Past) and date (newest first within each status)
export const events = [
  //--------------------- Draft Events ---------------------//
  // children's painting competition 2025
  {
    slug: 'children’s-painting-competition-2025',
    title: 'Children’s Drawing Competition',
    date: 'Stay tuned for the date',
    location: 'Ingolstadt (exact location to be announced)',
    description: 'A fun and creative competition for children to express their imagination through art! With a small participation fee, kids can showcase their drawings. Winners will be recognized, and the event supports MHG activities.',
    cardImage: "",
    language: ['de'],
    tags: ['Children', 'Art', 'Community', 'Competition'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: false,
    registerAvailable: false
  },
  // cooking class for sisters 2025
  {
    slug: 'cooking-class-sisters-2025',
    title: 'Cooking Class for Sisters',
    date: 'Stay tuned for the date',
    location: 'Ingolstadt (exact location to be announced)',
    description: 'An engaging cooking class organized especially for sisters. Learn new recipes, cook together, and share delicious food while enjoying great company in a supportive environment.',
    cardImage: "",
    language: ['de'],
    tags: ['Cooking', 'Sisters', 'Community', 'Food'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: false,
    registerAvailable: false
  },
  // football charity match 2025
  {
    slug: 'football-charity-match-2025',
    title: 'Charity Football Match',
    date: 'Stay tuned for the date',
    location: 'Ingolstadt (exact field to be announced)',
    description: 'Come and play football for a cause! Teams will face off in a friendly match, and the losing team contributes donations. A great way to combine fun, sports, and giving back.',
    cardImage: "",
    language: ['de', 'en'],
    tags: ['Football', 'Sports', 'Charity', 'Community'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: false,
    registerAvailable: false
  },
  // charity stand at mosques 2025
  {
    slug: 'mosque-charity-stand-2025',
    title: 'Charity Stand at Mosques',
    date: 'October 25, 2025',
    location: 'Various Mosques, Ingolstadt',
    description: 'Join us after Jumu‘ah prayer for a charity stand at the mosques. Support MHG initiatives through donations and community engagement.',
    cardImage: "",
    language: ['de', 'en'],
    tags: ['Charity', 'Community', 'Fundraising'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: false,
    registerAvailable: false
  },
  // altstadt stand 2025
  {
    slug: 'altstadt-stand-2025',
    title: 'Altstadt Activities Stand',
    date: 'Stay tuned for the date',
    location: 'Altstadt, Ingolstadt',
    description: 'Join us in the Altstadt for a lively community stand! Expect Henna art, kids’ face painting, cakes, waffles, calligraphy, decorations, and even a small flea market. A chance to connect, enjoy, and support MHG with friends and family.',
    cardImage: "",
    language: ['de', 'en'],
    tags: ['Community', 'Henna', 'Food', 'Calligraphy', 'Charity'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: false,
    registerAvailable: false
  },
  // mhg intro stand semester kickoff 2025
  {
    slug: 'mhg-intro-stand-thi-2025',
    title: 'MHG Info Stand – Semester Kickoff',
    date: 'October 1, 2025',
    location: 'Technische Hochschule Ingolstadt, Building A',
    description: 'Start the semester with MHG! Visit our info stand to learn more about our student association, meet fellow Muslim students, and find out how you can get involved in upcoming events and activities. A welcoming opportunity to connect and join the community.',
    cardImage: "",
    language: ['de', 'en'],
    tags: ['Intro', 'Community', 'Students', 'Engagement'],
    speakers: [],
    attendance: null,
    gallery: [],
    available: false,
    past: false,
    highlighted: true,
    registerAvailable: false
  },
  //--------------------- Upcoming Events ---------------------//
  //--------------------- Past Events ---------------------//
  // shaykh taha ali talk june 2025
  {
    slug: 'shaykh-taha-ali-talk-june-2025',
    title: 'Shaykh Taha Ali: Helper not Executioner',
    date: 'June 17, 2025',
    location: 'Room G215, THI, Ingolstadt',
    description:
      'Join us for an inspiring talk with Shaykh Taha Ali Zeidan about the Prophet’s ﷺ role as a source of mercy and compassion, not punishment. Explore Islamic ethics of leadership, forgiveness, and justice in today’s world.',
    cardImage: "",
    language: ['de'],
    tags: ['Mercy', 'Prophet Muhammad ﷺ', 'Ethics', 'Leadership', 'Spirituality'],
    speakers: ['Shaykh Taha Ali Zeidan'],
    attendance: 20,
    gallery: [
      "https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063430/IMG_4266_owjnqf.jpg",
      "https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063479/IMG_4261_yspbpp.jpg",
      "https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063479/IMG_4277_amqsg1.jpg",
      "https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063481/IMG_4264_sarz15.jpg",
      "https://res.cloudinary.com/dzu5pa8ut/video/upload/v1758063598/IMG_4274_rpgr67.mp4",
    ],
    available: true,
    past: true,
    highlighted: false,
    registerAvailable: false
  },
  // eid celebration june 2025
  {
    slug: 'eid-celebration-june-2025',
    title: 'Eid Celebration – Kahoot, Shared Dishes',
    date: 'June 11, 2025',
    location: 'THI, Ingolstadt',
    description: 'We gathered to celebrate Eid with joy, food, and fun! Everyone brought a delicious dish to share, making it a true community feast. The highlight of the day was an exciting Kahoot quiz that brought laughter, learning, and friendly competition. A beautiful chance to connect and celebrate Eid together.',
    cardImage: '',
    language: ['de', 'en'],
    tags: ['Eid', 'Community', 'Food', 'Kahoot', 'Celebration'],
    speakers: [],
    attendance: 40,
    gallery: [
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063188/IMG_4115_pfel40.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063182/IMG_4092_x6qgxu.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063160/IMG_4080_iwmvvi.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063158/IMG_4046_oce7xf.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063154/IMG_4043_a9neys.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063151/IMG_4078_risglc.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063143/IMG_4075_uk8nke.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063139/IMG_4069_raahyl.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/video/upload/v1758063376/IMG_4081_e8erdz.mp4',
    ],
    available: true,
    past: true,
    highlighted: false,
    registerAvailable: false
  },
  // priorities of muslim youth in germany may 2025
  {
    slug: 'priorities-of-muslim-youth-in-germany',
    title: 'Priorities of Muslim Youth in Germany',
    date: 'May 15, 2025',
    location: 'Room G215, THI, Ingolstadt',
    description:
      'Join guest speaker Abdelhak Rabah for an insightful lecture on the priorities and challenges facing Muslim youth in Germany. The talk will explore identity, faith, education, and active participation in society.',
    cardImage: '',
    language: ['en'],
    tags: ['Youth', 'Identity', 'Education', 'Community', 'Germany'],
    speakers: ['Abdelhak Rabah'],
    attendance: 30,
    gallery: [
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063423/IMG_3298_o7ysio.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063427/IMG_3299_pandzc.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063439/IMG_3292_iswvbl.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/image/upload/v1758063454/IMG_3301_nksqlr.jpg',
      'https://res.cloudinary.com/dzu5pa8ut/video/upload/v1758063517/IMG_3310_zzkvjb.mp4'
    ],
    available: true,
    past: true,
    highlighted: false,
    registerAvailable: false
  }
];

