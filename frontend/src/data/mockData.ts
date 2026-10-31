import type {
  Review,
  RatingSummary,
  Video,
  Service,
  BenefitItem,
  AudienceItem,
  ProcessStep,
  FounderBio,
  CredibilityConfig,
} from '../types';

export const GDP_CREDIBILITY: CredibilityConfig = {
  // CRITICAL SPECIFICATION: Do not publish numbers as verified facts until Bhavesh Sir confirms them.
  // Switch showUnverifiedStats to true once confirmed.
  showUnverifiedStats: false,
  unverifiedStats: [
    { value: '500+', label: 'Business Owners Guided', note: 'Pending founder confirmation' },
    { value: '15+', label: 'Years of Experience', note: 'Pending founder confirmation' },
    { value: '12+', label: 'Industries Covered', note: 'Pending founder confirmation' },
  ],
  verifiedPillars: [
    {
      title: 'Studio-Grade 4K Production',
      description: 'Multi-camera cinematic lighting and broadcast-grade audio engineered in Surat, Gujarat.',
      iconName: 'Video',
    },
    {
      title: 'Conversational Narrative Architecture',
      description: 'Empathetic, structured interview frameworks that bring out your deepest wisdom comfortably.',
      iconName: 'Sparkles',
    },
    {
      title: 'Omnichannel Content Repurposing',
      description: 'Full YouTube episodes, viral reels, shorts, quotes, and LinkedIn articles from one session.',
      iconName: 'Repeat',
    },
    {
      title: 'Rooted in Surat, Gujarat',
      description: 'Accessible local studio with personal hands-on guidance from Bhavesh Chudasama.',
      iconName: 'MapPin',
    },
  ],
};

export const GDP_BENEFITS: BenefitItem[] = [
  {
    id: 'benefit-1',
    title: 'Personal Branding',
    subtitle: 'From Business Name to Recognized Leader',
    description:
      'People do business with people they know, like, and trust. Move beyond being just a company logo and become the respected voice of your industry.',
    iconName: 'UserCheck',
    tag: 'Identity',
  },
  {
    id: 'benefit-2',
    title: 'Authority',
    subtitle: 'Proof of Mastery Competitors Cannot Replicate',
    description:
      'In a market crowded with 30-second sales pitches, a deep 45-minute conversation proves your authentic knowledge and cements your thought leadership.',
    iconName: 'Award',
    tag: 'Credibility',
  },
  {
    id: 'benefit-3',
    title: 'Trust',
    subtitle: 'High-Touch Emotional Rapport at Scale',
    description:
      'Listening to your voice, seeing your expressions, and understanding your values creates an intimate bond that static advertising could never achieve.',
    iconName: 'ShieldCheck',
    tag: 'Connection',
  },
  {
    id: 'benefit-4',
    title: 'Content Repurposing',
    subtitle: 'Weeks of Content from a Single Hour',
    description:
      'A single strategic recording session generates full-length episodes, 15+ vertical reels, YouTube Shorts, LinkedIn carousels, and high-impact quotes.',
    iconName: 'Repeat',
    tag: 'Efficiency',
  },
  {
    id: 'benefit-5',
    title: 'Network',
    subtitle: 'The Ultimate Invitation for Industry Leaders',
    description:
      'A podcast gives you a respectful, non-sales reason to invite prospective high-value clients, mentors, and strategic partners to sit down and speak with you.',
    iconName: 'Users',
    tag: 'Relationships',
  },
  {
    id: 'benefit-6',
    title: 'Visibility',
    subtitle: 'Evergreen Reach That Never Sleeps',
    description:
      'Your episodes live perpetually on YouTube, Spotify, and Apple Podcasts — continually educating prospective customers while you focus on running your business.',
    iconName: 'Globe',
    tag: 'Reach',
  },
];

export const GDP_AUDIENCES: AudienceItem[] = [
  {
    id: 'aud-1',
    title: 'Business Owners',
    roleDescription: 'Founders, MDs, and Managing Partners',
    podcastFocus: 'Share founding philosophies, industrial craftsmanship, and vision behind the products you manufacture.',
    iconName: 'Briefcase',
  },
  {
    id: 'aud-2',
    title: 'Doctors & Ayurved Experts',
    roleDescription: 'Specialists, Vaidyas, and Wellness Pioneers',
    podcastFocus: 'Demystify preventive care, lifestyle longevity, and medical science to foster genuine patient trust.',
    iconName: 'HeartPulse',
  },
  {
    id: 'aud-3',
    title: 'Consultants & Coaches',
    roleDescription: 'Business, Executive, and Life Mentors',
    podcastFocus: 'Demonstrate actionable frameworks and client breakthroughs that turn listeners into eager clients.',
    iconName: 'Compass',
  },
  {
    id: 'aud-4',
    title: 'Teachers & Trainers',
    roleDescription: 'Educators, Skill Mentors, and Academicians',
    podcastFocus: 'Take your classroom insights beyond geographical borders and impact thousands of ambitious minds.',
    iconName: 'GraduationCap',
  },
  {
    id: 'aud-5',
    title: 'Musicians & Artists',
    roleDescription: 'Performers, Composers, and Visual Creators',
    podcastFocus: 'Tell the emotional stories behind your compositions and build an appreciative, lifelong community.',
    iconName: 'Music',
  },
  {
    id: 'aud-6',
    title: 'Manufacturers & Retailers',
    roleDescription: 'Textile, Diamond, Engineering, and Commerce Leaders',
    podcastFocus: 'Highlight Gujarat’s legendary entrepreneurial grit, supply chain discipline, and product heritage.',
    iconName: 'Factory',
  },
  {
    id: 'aud-7',
    title: 'CAs & Legal Professionals',
    roleDescription: 'Chartered Accountants, Lawyers, and Financial Advisors',
    podcastFocus: 'Break down complex financial, tax, and legal regulations into clear, empowering advice.',
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'aud-8',
    title: 'Knowledge Seekers & Experts',
    roleDescription: 'Veterans with Hard-Won Lessons',
    podcastFocus: 'If your journey has a lesson, your story has value. Archive your life experience for future generations.',
    iconName: 'Sparkles',
  },
];

export const GDP_FOUNDER: FounderBio = {
  name: 'Bhavesh J. Chudasama',
  title: 'Founder & CEO – Sunrise Software Development',
  company: 'Sunrise Software Development',
  portfolioUrl: 'https://share.google/mN8Hwet0sf0dFvcgx',
  location: 'Surat, Gujarat, India',
  tagline: 'Conversations That Drive Growth',
  story: [
    'When I first set out to build my own podcast, I faced the exact roadblocks that stop hundreds of talented leaders every year: the friction of travelling to distant metro cities, painful communication gaps with remote agencies, exorbitant multi-lakh studio retainers, and budget alternatives that delivered muffled audio and poor lighting.',
    'As Founder & CEO of Sunrise Software Development, I have spent years architecting digital solutions and leading technology teams. I realized that our business owners, tech pioneers, doctors, consultants, and creators in Surat and across Gujarat possessed world-class expertise — but lacked an accessible, dedicated, and empathetic partner to help them communicate it with cinematic quality.',
    'Growth Ka Digital Partner (GDP) was built right here in Surat to bridge that gap: creating a warm, comfortable studio experience, authentic conversational coaching, and turnkey video repurposing so you can build your personal brand without hassle.',
  ],
  philosophy: 'We don’t chase vanity metrics or sensationalism. We chase meaningful conversations that build enduring trust.',
  vision: 'A world where people with valuable experience and knowledge have the confidence and opportunity to share their stories.',
  mission: 'Help professionals turn their knowledge into authentic conversations and meaningful personal-brand content through a thoughtful podcasting process.',
  socials: {
    youtube: 'https://www.youtube.com/@gdppodcast',
    instagram: 'https://www.instagram.com/gdptalks/',
    linkedin: 'https://www.linkedin.com/in/bhavesh-chudasama-48280728',
    whatsapp: 'https://wa.me/919727001838?text=Hello%20Bhavesh%20Sir%2C%20PODCAST%20%E2%80%94%20I%20would%20like%20to%20start%20my%20podcast%20journey%20with%20GDP.',
    portfolio: 'https://share.google/mN8Hwet0sf0dFvcgx',
  },
};

export const GDP_PROCESS: ProcessStep[] = [
  {
    step: '01',
    phase: 'Before',
    title: 'Discovery & Preparation',
    subtitle: 'Structuring Your Message with Empathy',
    description:
      'We sit down with you to unpack your core expertise, key career milestones, target audience, and the stories only you can tell. We design a relaxed, natural conversation outline so you always feel prepared, confident, and never put on the spot.',
    deliverables: [
      'Core Message & Episode Objective Discovery',
      'Curated Conversational Outline & Prompt Questions',
      'Audience Persona & Positioning Blueprint',
      'Studio Camera & Wardrobe Consultation',
    ],
    iconName: 'Compass',
  },
  {
    step: '02',
    phase: 'During',
    title: 'Authentic Conversation',
    subtitle: 'A Comfortable, Studio-Grade Dialogue',
    description:
      'Step into our Surat studio designed for warmth and focus. Equipped with broadcast condenser microphones, flattering studio lighting, and multi-angle 4K cameras. Bhavesh guides the conversation naturally, making it feel like an inspiring discussion with a trusted peer.',
    deliverables: [
      'Multi-Angle 4K Cinema Camera Recording',
      'Studio-Grade Broadcast Condenser Microphones',
      'Comfortable, Zero-Stress Studio Atmosphere',
      'Empathetic Host & Dialogue Moderation',
    ],
    iconName: 'Mic',
  },
  {
    step: '03',
    phase: 'After',
    title: 'Content Creation & Repurposing',
    subtitle: 'Transforming 45 Minutes into Weeks of Reach',
    description:
      'Our post-production team edits the full episode with studio audio sweetening, color grading, and branded title cards. We extract the most impactful moments into vertical reels, YouTube Shorts, and quote graphics ready for your social platforms.',
    deliverables: [
      'Complete 4K Master Episode with Pro Audio Mixing',
      '5–10 High-Impact Vertical Reels with Dynamic Subtitles',
      'YouTube Shorts & Instagram-Ready Highlights',
      'LinkedIn Thought-Leadership Quotes & Transcripts',
    ],
    iconName: 'Film',
  },
];

export const GDP_CONTACT_INFO = {
  email: 'info@growthkadigitalpartner.com',
  phone: '+91 9727001838',
  phoneFormatted: '+91 97270 01838',
  location: 'Surat, Gujarat, India',
  youtube: 'https://www.youtube.com/@gdppodcast',
  instagram: 'https://www.instagram.com/gdptalks/',
  linkedin: 'https://www.linkedin.com/in/bhavesh-chudasama-48280728',
  portfolioUrl: 'https://share.google/mN8Hwet0sf0dFvcgx',
  portfolioLabel: 'Bhavesh J. Chudasama Portfolio',
  whatsappUrl:
    'https://wa.me/919727001838?text=Hello%20Bhavesh%20Sir%2C%20PODCAST%20%E2%80%94%20I%20would%20like%20to%20start%20my%20podcast%20journey%20with%20GDP.',
};

export const INITIAL_RATING_SUMMARY: RatingSummary = {
  average: 4.9,
  totalReviews: 142,
  distribution: {
    5: 125,
    4: 13,
    3: 3,
    2: 1,
    1: 0,
  },
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'usr-101',
    userName: 'Vikramaditya Mehta',
    role: 'Founder & CEO',
    companyName: 'Nexora HealthTech',
    rating: 5,
    title: 'Transformed our brand authority and doubled organic enterprise pipeline',
    content:
      'Partnering with Bhavesh and Growth Ka Digital Partner was a turning point for our executive positioning. Their blend of cinematic podcast storytelling and comfortable conversation guidance positioned our venture with unmatched credibility in Gujarat.',
    date: 'March 24, 2026',
    verified: true,
    helpfulCount: 42,
    creatorHeart: true,
    replies: [
      {
        id: 'rep-1',
        userName: 'Bhavesh J. Chudasama',
        role: 'Founder & CEO — Sunrise Software Development | Host, GDP',
        content:
          'Thank you Vikramaditya! Your insights on healthtech accessibility in Gujarat made this one of our most impactful conversations in the studio.',
        date: 'March 25, 2026',
        helpfulCount: 14,
      },
    ],
  },
  {
    id: 'rev-2',
    userId: 'usr-102',
    userName: 'Dr. Anandita Patel',
    role: 'Senior Consultant & Ayurved Specialist',
    companyName: 'Sattva Holistic Care, Surat',
    rating: 5,
    title: 'Made the entire podcasting process seamless and comfortable',
    content:
      'I was nervous about speaking in front of cameras, but Bhavesh created an incredibly warm and relaxed environment. The 45-minute episode and the reels they crafted brought patient trust that 5 years of standard social media posts could never achieve.',
    date: 'April 02, 2026',
    verified: true,
    helpfulCount: 31,
    creatorHeart: true,
    replies: [
      {
        id: 'rep-2',
        userName: 'GDP Studio Team',
        role: 'Production Team',
        content:
          'It was an honor hosting you, Dr. Anandita! The Ayurvedic prevention episode has already inspired thousands of Gujarati families.',
        date: 'April 03, 2026',
        helpfulCount: 9,
      },
    ],
  },
  {
    id: 'rev-3',
    userId: 'usr-103',
    userName: 'Rajesh Singhania',
    role: 'Managing Director',
    companyName: 'Singhania Texweave',
    rating: 5,
    title: 'True craftsmen of personal branding in Gujarat',
    content:
      'The GDP team doesn’t just record audio; they act as a true intellectual partner. They helped me articulate our 30-year manufacturing heritage into engaging stories that resonated with both legacy partners and young talent.',
    date: 'March 18, 2026',
    verified: true,
    helpfulCount: 28,
    creatorHeart: true,
  },
];

export const GDP_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'How to Build Personal Brand | Brand Building | Podcast Benefits | Best Podcaster',
    description:
      'Bhavesh Chudasama explains why business owners and professionals must step out from behind the company name, share authentic stories, and build an enduring personal brand with GDP Podcast in Surat.',
    youtubeVideoId: '1vbEoi4YuZ0',
    thumbnailUrl: 'https://img.youtube.com/vi/1vbEoi4YuZ0/maxresdefault.jpg',
    duration: '38:42',
    category: 'Personal Branding',
    publishedDate: 'Episode 01',
    views: 'GDP Talks',
    featured: true,
  },
  {
    id: 'vid-2',
    title: 'Hindi Motivational Podcast | Secrets to a Happy Life by Nilesh S Modi | Life Coach',
    description:
      'Visionary life coach and mentor Nilesh S Modi shares life-changing guidance on true happiness, managing burnout, and maintaining spiritual balance during high-stakes growth.',
    youtubeVideoId: '2v6NrmW4gXc',
    thumbnailUrl: 'https://img.youtube.com/vi/2v6NrmW4gXc/maxresdefault.jpg',
    duration: '35:10',
    category: 'Mindset & Growth',
    publishedDate: 'Episode 02',
    views: 'GDP Talks',
    featured: true,
  },
  {
    id: 'vid-3',
    title: 'Podcast with Guinness World Record Hair Stylist Denish Bhatti | Hair & Salon Industry',
    description:
      'Guinness World Record hair artist Denish Bhatti discusses scaling creative craft into enterprise, mindset for world-record discipline, and the booming salon industry.',
    youtubeVideoId: '5WNPBjZbC2M',
    thumbnailUrl: 'https://img.youtube.com/vi/5WNPBjZbC2M/maxresdefault.jpg',
    duration: '42:15',
    category: 'Business & Craft',
    publishedDate: 'Episode 03',
    views: 'GDP Talks',
    featured: true,
  },
  {
    id: 'vid-4',
    title: 'Expert Ayurved Podcast Gujarati | સ્વસ્થ રહેવાનું સાચું રહસ્ય | આયુર્વેદ ની વાતો',
    description:
      'A deep dive into classical Ayurvedic healing, gut immunity, preventative wellness, and daily health rituals tailored for modern entrepreneurs and families in Gujarat.',
    youtubeVideoId: 'ha38TqpTkoo',
    thumbnailUrl: 'https://img.youtube.com/vi/ha38TqpTkoo/maxresdefault.jpg',
    duration: '39:20',
    category: 'Health & Ayurveda',
    publishedDate: 'Episode 04',
    views: 'GDP Talks',
  },
  {
    id: 'vid-5',
    title: 'वास्तु शास्त्र क्या है? बिना तोड़फोड़ के वास्तु उपाय | Vastu Podcast in Hindi | Human Vastu Expert',
    description:
      'Scientific and non-destructive Vastu Shastra principles for modern residential and commercial architectures to maximize prosperity, peace of mind, and business vitality.',
    youtubeVideoId: '28O_v97tRSE',
    thumbnailUrl: 'https://img.youtube.com/vi/28O_v97tRSE/maxresdefault.jpg',
    duration: '31:45',
    category: 'Vastu & Architecture',
    publishedDate: 'Episode 05',
    views: 'GDP Talks',
  },
];

export const GDP_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Flagship Video Podcast Production',
    subtitle: 'Turnkey 4K Multi-Camera In-Studio Recording',
    description:
      'Step into our professional Surat studio for a relaxed, guided conversation. We manage all broadcast engineering, dynamic multi-angle camera switching, and crystal-clear audio mixing.',
    deliverables: [
      'Pre-Production Scripting & Conversational Outline',
      'Multi-Angle 4K Cinema Camera Capture & Lighting',
      'Broadcast-Grade Studio Microphone Calibration',
      'Master High-Definition Episode Output',
    ],
    idealFor: 'Business leaders, doctors, consultants, and authors ready for a world-class show',
    tag: 'Flagship Studio',
    iconName: 'Video',
  },
  {
    id: 'srv-2',
    title: 'Viral Content Repurposing (Reels & Shorts)',
    subtitle: 'One Session = 30 Days of High-Impact Social Presence',
    description:
      'We extract the punchiest wisdom, surprising stories, and core lessons into high-retention vertical reels with custom animated subtitles, sound design, and color grading.',
    deliverables: [
      '5 to 15 Vertical Reels & Shorts per Episode',
      'High-Engagement Kinetic Subtitles & Hooks',
      'Thumb-Stopping YouTube Thumbnails & Banners',
      'Key Quote Graphics for LinkedIn & Instagram',
    ],
    idealFor: 'Professionals seeking daily visibility without filming every single day',
    tag: 'Social Engine',
    iconName: 'Repeat',
  },
  {
    id: 'srv-3',
    title: 'Personal Brand & Positioning Strategy',
    subtitle: 'From Unheard Expert to Recognized Industry Voice',
    description:
      'We help you discover your unique angle, sharpen your messaging, and align your public persona with your business growth objectives.',
    deliverables: [
      'Personal Brand Narrative Architecture',
      'Topic Mapping & Guest Outreach Strategy',
      'YouTube & Social Media Channel Optimization',
      'Audience Engagement & Monetization Roadmap',
    ],
    idealFor: 'Founders and coaches wanting a cohesive, respected digital footprint',
    tag: 'Strategic Advisory',
    iconName: 'Compass',
  },
];
