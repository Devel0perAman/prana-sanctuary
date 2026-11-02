// Extra page sections: original Hindi lines (written for PRĀNA, not translations) + new section content.
// Edit freely — every string on the new sections lives here.

/** Verse bands. English lines written for PRĀNA; only `breath` and `lamp` keep a Hindi line (`hi`). */
export const VERSES = {
  breath:  { hi: 'साँस जब ठहरती है,\nतब भीतर का सूरज उगता है।', en: 'When the breath grows still,\nan inner sun begins to rise.', by: 'The first lesson of prana' },
  return:  { en: 'Yoga is not a posture —\nit is the road back to yourself.', by: 'Founder, Devi Ananda' },
  silence: { en: 'Where the noise ends,\npractice begins.', by: 'From the morning class' },
  nature:  { en: 'Steady as the mountain,\neasy as the river —\nthat is the way of prana.', by: 'Painted on the shala wall' },
  lamp:    { hi: 'हर श्वास एक दीया है,\nहर प्रश्वास एक प्रणाम।', en: 'Every inhale is a lamp,\nevery exhale a bow.', by: 'Dusk meditation' },
  guru:    { en: 'A teacher is not the one who shows you the road,\nbut the one who teaches you to walk.', by: 'For our teachers' },
  mat:     { en: 'In a tired world,\none quiet mat of space.', by: 'Online practice' },
  within:  { en: 'Go inward —\nthere is no hurry there.', by: 'Sound bath' },
  ganga:   { en: 'The river never rushes,\nyet it reaches the sea.', by: 'Ganga-side practice' },
  sunrise: { en: 'Today\'s breath\nmakes tomorrow\'s morning.', by: 'Brahma muhurta' },
}

/** Scrolling strip: Hindi + English keywords. */
export const MARQUEE = ['Prana', 'Breath', 'Stillness', 'Balance', 'Practice', 'Awareness', 'Ease', 'Community', 'Meditation', 'Ganga', 'Himalaya', 'Rishikesh']

/** Animated counters. [value, suffix, label, hindiLabel] */
export const COUNTERS = [
  [1200, '+', 'Practitioners annually', 'साधक हर साल'],
  [42, '', 'Weekly sessions', 'साप्ताहिक कक्षाएँ'],
  [48, '', 'Online courses', 'ऑनलाइन पाठ्यक्रम'],
  [24, '', 'Years of lineage', 'वर्षों की परंपरा'],
]

/** Dincharya — a day at the sanctuary. [time, title, hindi, text, icon] */
export const DAY_RHYTHM = [
  ['05:30', 'Brahma Muhurta Stillness', 'ब्रह्म मुहूर्त', 'Silent sitting and gentle pranayama while the valley is still dark and the air is cool.', 'sunrise'],
  ['07:00', 'Sunrise Salutations', 'सूर्य नमस्कार', 'Twelve rounds of Surya Namaskar on the mountain deck as the first light reaches the shala.', 'sun'],
  ['09:30', 'Alignment Lab', 'अंग-संरेखण', 'Small-group anatomy and posture clinic — props, cues and slow, precise work.', 'users'],
  ['12:30', 'Sattvic Table', 'सात्त्विक भोजन', 'A seasonal vegetarian lunch from our garden, eaten together, without screens.', 'leaf'],
  ['17:30', 'Dusk Meditation', 'संध्या ध्यान', 'Yoga nidra and candle-lit stillness as the light turns gold over the hills.', 'moon'],
  ['20:00', 'Nada Snana — Sound Bath', 'नाद स्नान', 'Singing bowls and gong in the Sound Dome. Lie back and let the sound do the work.', 'music'],
]

/** Weekly timetable. day-group → rows [time, practice, teacher, level, mode] */
export const SCHEDULE = {
  'Mon – Fri': [
    ['06:00', 'Sunrise Hatha', 'Kavita Ramachandran', 'All levels', 'Studio + Live'],
    ['08:30', 'Vinyasa Architecture', 'Devan Thorne', 'Intermediate', 'Studio'],
    ['12:15', 'Lunch-hour Reset (30 min)', 'Dr. Julian Vance', 'All levels', 'Studio + Live'],
    ['17:45', 'Restorative Yin', 'Acharya Kavita', 'Gentle', 'Studio + Live'],
    ['19:30', 'Pranayama & Nidra', 'Acharya Madhav Rao', 'All levels', 'Studio'],
  ],
  'Sat – Sun': [
    ['07:00', 'Mountain Deck Flow', 'Devan Thorne', 'All levels', 'Studio'],
    ['09:30', 'Beginner Foundations', 'Acharya Kavita', 'Beginner', 'Studio + Live'],
    ['11:30', 'Somatic Breathwork', 'Dr. Elena Rostova', 'All levels', 'Studio'],
    ['16:30', 'Sound Bath & Gong', 'Ayla Serapion', 'Gentle', 'Sound Dome'],
    ['18:30', 'Full-moon Dusk Meditation', 'Whole faculty', 'All levels', 'Monthly'],
  ],
}

/** "Your first class" steps. [title, hindi, text] */
export const FIRST_CLASS = [
  ['Book a slot', 'स्थान चुनिए', 'Pick any class on the timetable — or WhatsApp us and we will suggest the gentlest start.'],
  ['Arrive early', 'थोड़ा पहले आइए', 'Come 15 minutes ahead. Mats, bolsters and cedar blocks are provided; just bring water.'],
  ['Practise at your pace', 'अपनी गति से', 'No comparison, no mirrors. Teachers offer every pose in three versions.'],
  ['Stay for tea', 'चाय पर रुकिए', 'Herbal tea in the pavilion afterwards — the best part of the class, according to most students.'],
]

/** Retreats. */
export const RETREATS = [
  { img: 'life-deck', tag: '3 nights · Rishikesh', title: 'Silent Sunrise Weekend', hi: 'मौन की एक सुबह', text: 'Noble silence, guided sunrise practice and slow walks. A reset for overwhelmed minds.', date: 'Next: 14 – 17 Jan 2027', price: '₹38,000' },
  { img: 'g-bowls', tag: '5 nights · Sound Dome', title: 'Nada Yoga & Sound Immersion', hi: 'नाद ब्रह्म', text: 'Bowls, gong, mantra and breath — five days of listening, taught by our sound architect.', date: 'Next: 6 – 11 Mar 2027', price: '₹64,000' },
  { img: 'life-garden', tag: '7 nights · Rishikesh', title: 'Ganga Ayurveda Retreat', hi: 'गंगा किनारे आयुर्वेद', text: 'Panchakarma-inspired cleansing, daily abhyanga, riverside yoga and sattvic meals.', date: 'Next: 9 – 16 Apr 2027', price: '₹92,000' },
]

/** Journal. */
export const JOURNAL = [
  { img: 'g-vagus', tag: 'Breath', title: 'Why a longer exhale calms the body', hi: 'लंबी साँस, गहरी शांति', text: 'The vagus nerve, 4-6 breathing and a 5-minute practice you can do at your desk.', mins: 5 },
  { img: 'g-ayur', tag: 'Ayurveda', title: 'A winter morning routine that actually fits real life', hi: 'सर्दियों की सुबह', text: 'Warm water, oil, a short flow — three small habits from our resident Ayurveda guide.', mins: 6 },
  { img: 'g-yin', tag: 'Practice', title: 'Yin yoga for people who cannot sit still', hi: 'ठहरना भी एक कला है', text: 'Props, timers and kind thoughts for restless bodies. Start with just three minutes.', mins: 4 },
]

/** About — lineage timeline. [year, title, text] */
export const TIMELINE = [
  ['1998', 'The vow in the Himalaya', 'Devi Ananda Thorne begins her apprenticeship under Swami Vivekananda Parampara in Rishikesh.'],
  ['2004', 'First shala, six mats', 'A rented room above a spice shop — six mats, one harmonium and a waiting list.'],
  ['2011', 'The Tapovan campus', 'A quiet orchard above the Ganga, bought and slowly turned into the Sunlit Shala and Tea Pavilion.'],
  ['2018', 'Yoga Alliance accreditation', 'The 200-hour and 300-hour programmes are formally registered.'],
  ['2021', 'PRĀNA goes online', 'The on-demand library opens so practitioners everywhere can learn at home.'],
  ['2026', 'The Sound Dome', 'A rammed-earth acoustic chamber opens — home to gong baths and Nada Yoga.'],
]

/** About — values. [icon, title, hindi, text] */
export const VALUES = [
  ['heart', 'Seva', 'सेवा', 'Every cohort gives back — free community classes every month and a 15% scholarship fund.'],
  ['leaf', 'Ahimsa', 'अहिंसा', 'Plant-based kitchen, no single-use plastic, and a practice that never forces the body.'],
  ['users', 'Sangha', 'संगत', 'We learn better together. Tea, silence and stories are part of the syllabus.'],
  ['sparkles', 'Satya', 'सत्य', 'Honest teaching: what science supports, what tradition teaches, and where we are still learning.'],
]

/** About — sustainability. [value, label] */
export const CAMPUS = [
  ['100%', 'Solar & spring water'],
  ['14 acres', 'Native planting & orchard'],
  ['0', 'Single-use plastics on campus'],
  ['3 t', 'Compost made every season'],
]

/** Career — a day in the training. [time, title, text] */
export const TRAINING_DAY = [
  ['05:45', 'Pranayama & Silence', 'Breathwork and meditation before speech — the day starts quiet.'],
  ['07:30', 'Asana Lab', 'Two hours of alignment, adjustments and sequencing practice.'],
  ['10:30', 'Sattvic Brunch', 'Shared meal in the pavilion.'],
  ['11:30', 'Anatomy & Philosophy', 'Lecture, discussion and case studies — Sutras, fascia, nervous system.'],
  ['15:00', 'Practicum', 'Peer-teaching in small groups with faculty feedback.'],
  ['18:00', 'Evening Satsang', 'Chanting, reading and reflection. Lights out by 21:30.'],
]

/** Career — outcomes. [icon, title, text] */
export const OUTCOMES = [
  ['users', 'Studio teacher', 'Lead public classes at studios, gyms and wellness centres.'],
  ['sun', 'Retreat leader', 'Design and host weekend and week-long retreats.'],
  ['video', 'Online instructor', 'Teach live or record your own on-demand courses.'],
  ['heart', 'Therapeutic specialist', 'Work 1:1 with stress, posture and rehabilitation needs.'],
  ['building', 'Corporate wellbeing', 'Bring breathwork and desk-yoga to teams and schools.'],
  ['award', 'Teacher trainer', 'After experience, mentor future teachers as faculty.'],
]

/** Career — comparison. header + rows. */
export const COMPARE = {
  head: ['', '200-Hour Foundations', '300-Hour Advanced', 'Residency'],
  rows: [
    ['Duration', '12 weeks hybrid', '16 weeks hybrid', '6 months'],
    ['Format', 'Online + 3-week Rishikesh', 'Online + 10-day Rishikesh', 'In-studio'],
    ['Prerequisite', '6 months of practice', '200h certificate', 'Certified teacher'],
    ['Certificate', 'RYS 200', 'RYS 300', 'Mentorship letter'],
    ['Group size', 'Max 16', 'Max 16', 'Max 6'],
    ['Investment', '₹1,45,000', '₹2,25,000', 'Sponsored'],
  ],
}

/** Career — instalment steps. [title, text] */
export const PAYMENT_STEPS = [
  ['Apply', 'Fill the short application below — we reply within 48 hours.'],
  ['Conversation', 'A 20-minute call with our admissions teacher. No pressure.'],
  ['Reserve your seat', 'Pay a seat deposit securely through Razorpay (UPI, card, netbanking).'],
  ['Instalments', 'Balance in 3 monthly instalments before the cohort begins.'],
]

export const CAREER_FAQ = [
  ['Do I need to be able to do advanced poses?', 'No. We care about your commitment and curiosity, not flexibility. Six months of regular practice is enough for the 200-hour track.'],
  ['Is the certificate recognised outside India?', 'Our programmes are registered with Yoga Alliance (RYS 200 / RYS 300), which is recognised by studios worldwide. Always check the requirements of your specific employer or country.'],
  ['Can I work while studying?', 'The hybrid format is built for working people: weekday evenings online, plus an in-person immersion. Expect 12–15 hours a week.'],
  ['What if I need to pause?', 'You can move to the next cohort once without penalty. Your seat deposit stays valid for 12 months.'],
  ['Are scholarships available?', 'Yes — a 15% community scholarship fund. Tick the box in the application and tell us your story.'],
]

export const ABOUT_FAQ = [
  ['Can I visit the sanctuary without booking a class?', 'Yes — free sanctuary tours run daily 10:00–15:00. Just ring the bell at the gate and come in for tea.'],
  ['Is PRĀNA affiliated with a religion?', 'No. The practice draws on classical yoga philosophy, but everyone is welcome — whatever you believe or do not believe.'],
  ['Do you offer accommodation?', 'We have eight garden rooms on campus for retreat guests, plus a list of trusted guesthouses nearby.'],
  ['What is the food like?', 'Seasonal, vegetarian, mostly from our own kitchen garden. We can cater to vegan, gluten-free and most allergies with notice.'],
]

export const HOME_FAQ = [
  ['I have never done yoga. Where should I begin?', 'Start with “Beginner Yoga Foundations” online, or Saturday’s 09:30 class in the studio. Teachers will offer simpler versions of every pose.'],
  ['Do I need my own mat?', 'No. Mats, bolsters, blocks and straps are provided in the studio and cleaned after every class.'],
  ['Can I try before paying?', 'Yes — your first week of live and on-demand practice is a gift. No card required.'],
  ['How do online payments work?', 'Payments are processed by Razorpay (UPI, cards, netbanking, wallets). We never see your card details.'],
]

/** Courses — how it works. [title, hindi, text] */
export const HOW_IT_WORKS = [
  ['Choose a course', 'पाठ्यक्रम चुनिए', 'Browse by level, teacher or goal. Every course has a free preview lesson.'],
  ['Pay securely', 'सुरक्षित भुगतान', 'UPI, cards, netbanking or wallets through Razorpay. Instant receipt.'],
  ['Get your access', 'पहुँच पाइए', 'Your teacher team emails login details and the lesson library within hours.'],
  ['Practise anywhere', 'कहीं भी साधना', 'Phone, tablet or TV. Download for offline practice and learn at your pace.'],
]

/** Courses — what is included. [icon, title, text] */
export const INCLUDED = [
  ['video', '4K HDR lessons', 'Filmed in the shala with clear audio and multiple camera angles.'],
  ['download', 'Offline viewing', 'Download lessons on your phone or tablet for travel and low-network days.'],
  ['file-text', 'PDF companions', 'Printable sequencing sheets and breath guides for every course.'],
  ['message', 'Teacher Q&A', 'Ask questions in the monthly live Q&A circle (Unlimited plan).'],
  ['award', 'Completion certificate', 'A signed certificate you can share when you finish a course.'],
  ['refresh', '7-day refund', 'Not for you? Ask within 7 days for a full refund. No questions.'],
]

/** Courses — learning paths. */
export const PATHS = [
  { title: 'The Gentle Path', hi: 'सरल राह', for: 'New to yoga, stiff, or coming back after a break', steps: ['Beginner Yoga Foundations', 'Restorative Yin', 'Pranayama & Nervous System Reset'] },
  { title: 'The Strength Path', hi: 'शक्ति की राह', for: 'Practising already and ready for more', steps: ['Vinyasa Flow II', 'Advanced Asana & Arm Balance', 'The Art of Sequencing'] },
  { title: 'The Teacher Path', hi: 'गुरु की राह', for: 'Thinking about teaching one day', steps: ['Foundations of Somatic Flow', 'The Art of Sequencing', '200-Hour Teacher Training'] },
]

/** Gallery — reels (local looping clips). */
export const REELS = [
  { clip: 'reel-dusk', title: 'Golden Hour over the Valley', hi: 'सुनहरी साँझ', tag: 'Landscape' },
  { clip: 'reel-moon', title: 'Moonlit Meditation', hi: 'चाँदनी ध्यान', tag: 'Night' },
  { clip: 'reel-mist', title: 'Mist on the Ridge', hi: 'धुंध के पार', tag: 'Dawn' },
  { clip: 'bowls', title: 'Singing Bowls, Close-up', hi: 'नाद की गूँज', tag: 'Sound' },
  { clip: 'calm', title: 'Lotus Pond at Dawn', hi: 'कमल का सरोवर', tag: 'Garden' },
  { clip: 'deck', title: 'Warrior on the Mountain Deck', hi: '', tag: 'Practice' },
  { clip: 'ganga-aarti', title: 'Ganga Aarti at Dusk', hi: '', tag: 'Rishikesh' },
  { clip: 'bridge', title: 'Footbridge over the Ganga', hi: '', tag: 'Rishikesh' },
  { clip: 'ganga-dawn', title: 'Dawn on the River', hi: '', tag: 'Rishikesh' },
]

/** Gallery — "words on the wall" tiles. */
export const WALL = [
  { en: 'Peace in the breath,\nbalance in every step.', img: 'hatha' },
  { en: 'Silence, too,\nis a language.', img: 'g-bowls' },
  { en: 'The one who paused\nis the one who arrived.', img: 'life-pond' },
  { en: 'Every morning\nis a fresh beginning.', img: 'life-deck' },
]

/** Contact — how to reach. [icon, title, text] */
export const REACH = [
  ['plane', 'By air', 'Nearest airport: Jolly Grant, Dehradun (DED), about 35 km and 60–75 minutes by taxi. Delhi (DEL) is a 5–6 hour drive. We can arrange a pickup.'],
  ['train', 'By rail', 'Yoga Nagari Rishikesh station is 6 km away; Haridwar Junction (20 km) has the most trains from Delhi, Mumbai and Kolkata. Shared taxis run all day.'],
  ['car', 'By road', 'Delhi to Rishikesh via NH334 is 6 hours. Park near Tapovan Chowk and walk five minutes — we will send a pin on WhatsApp.'],
  ['bus', 'Local', 'Take an e-rickshaw to Laxman Jhula, then walk ten minutes up the lane. Our team will meet you at the gate on your first visit.'],
]

/** Contact — who to write to. [name, role, hindi, email, phone] */
export const TEAM_CONTACTS = [
  ['Sanctuary Concierge', 'Classes, visits & general questions', 'स्वागत', 'sanctuary@pranayoga.com', '+91 98765 43210'],
  ['Admissions', 'Teacher training & scholarships', 'प्रवेश', 'admissions@pranayoga.com', '+91 98765 43211'],
  ['Online Support', 'Courses, billing & access', 'सहायता', 'support@pranayoga.com', '+91 98765 43212'],
]
