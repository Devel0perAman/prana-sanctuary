// All page copy + structured content. Components stay presentational.

export const HERO_BADGES = [
  ['shield', 'Yoga Alliance Approved'],
  ['leaf', '100% Organic Materials'],
  ['globe', '12+ Lineage Teachers'],
]

export const PHILOSOPHY = [
  { icon: 'wind', title: 'Mindful Movement', text: 'Sequences designed around the natural rhythm of the spine, joints and breath, so strength is built without strain.' },
  { icon: 'heart', title: 'Somatic Guidance', text: 'Gentle nervous-system education that teaches the body to settle, soften and recover — on and off the mat.' },
  { icon: 'leaf', title: 'Ayurvedic Integration', text: 'Seasonal rituals, herbal teas and rest practices drawn from the Ayurvedic tradition to support the whole day.' },
]

export const DISCIPLINES = [
  { img: 'vinyasa', tag: 'Dynamic', title: 'Vinyasa Architecture', text: 'Synchronised breath-led movement that builds heat, strength and fluid awareness.', level: 'All Levels Welcome', rating: '4.9' },
  { img: 'hatha', tag: 'Foundational', title: 'Classical Hatha', text: 'Long-held, precisely aligned postures that develop stability, focus and calm.', level: 'Foundational', rating: '5.0' },
  { img: 'yin', tag: 'Restorative', title: 'Restorative Yin', text: 'Supported, slow-held shapes with bolsters and blankets for deep connective release.', level: 'Deep Rest', rating: '4.9' },
  { img: 'pranayama', tag: 'Breath & Sound', title: 'Pranayama & Sound', text: 'Breath architecture and singing-bowl immersion to steady the mind and quiet the nervous system.', level: 'Meditative', rating: '5.0' },
]

export const COURSES = [
  { id: 'course-foundations', img: 'outdoor', level: 'LEVEL 1', badge: 'Foundations', title: 'Beginner Yoga Foundations: Aligning Breath & Bone', text: 'Establish neuromuscular integrity through anatomical cues, gentle joint decompression and breath-led alignment.', duration: '30m avg', lessons: 12, rating: 4.9, reviews: 340, teacher: 'Acharya Kavita', role: 'Senior Somatic Lead', topic: 'Beginner', style: 'Foundations', intensity: 'Gentle' },
  { id: 'course-pranayama', img: 'pranayama', level: 'ALL LEVELS', badge: 'Vagal Tone', title: 'Pranayama & Deep Nervous System Reset', text: 'Vagus-nerve stimulation techniques, box breathing architectures and ancient breath rituals for stress recovery.', duration: '20m avg', lessons: 8, rating: 5.0, reviews: 512, teacher: 'Dr. Elena Rostova', role: 'Somatic Neurobiologist', topic: 'Breath', style: 'Pranayama', intensity: 'Gentle' },
  { id: 'course-vinyasa', img: 'sea', level: 'LEVEL 2', badge: 'Popular', title: 'Vinyasa Flow II: Dynamic Vitality & Agility', text: 'Elevate cardiovascular endurance and joint mobility through intelligent, creative sequencing.', duration: '45m avg', lessons: 16, rating: 4.9, reviews: 418, teacher: 'Devan Thorne', role: 'Movement Architect', topic: 'Vinyasa', style: 'Vinyasa', intensity: 'Strong' },
  { id: 'course-yin', img: 'yin', level: 'ALL LEVELS', badge: 'Deep Fascia', title: 'Restorative Yin: Somatic Release for Chronic Stress', text: 'Long-held, supported postures paired with somatic unwinding to soften connective tissue and the mind.', duration: '60m avg', lessons: 10, rating: 4.9, reviews: 289, teacher: 'Acharya Kavita', role: 'Senior Somatic Lead', topic: 'Restorative', style: 'Yin', intensity: 'Gentle' },
  { id: 'course-asana', img: 'headstand', level: 'LEVEL 3', badge: 'Biomechanics', title: 'Advanced Asana: Inversions & Arm Balance Biomechanics', text: 'Scapular stabilisation drills, core integration and fearless spatial awareness for Pincha, Handstand and beyond.', duration: '50m avg', lessons: 14, rating: 4.95, reviews: 195, teacher: 'Master Maya Lin', role: 'Biomechanics Faculty', topic: 'Advanced', style: 'Vinyasa', intensity: 'Strong' },
  { id: 'course-sequencing', img: 'group', level: 'ADVANCED', badge: 'Yoga Alliance 25hr', title: 'The Art of Sequencing: For Teachers & Dedicated Students', text: 'Curate intelligent energetic arcs, peak-pose scaffolding and verbal precision adjustments for any class.', duration: '60m avg', lessons: 20, rating: 5.0, reviews: 142, teacher: 'Devan Thorne', role: 'Movement Architect', topic: 'Teaching', style: 'Foundations', intensity: 'Moderate' },
]
export const COURSE_FILTERS = ['All', 'Beginner', 'Vinyasa', 'Restorative', 'Breath', 'Advanced', 'Teaching']

export const PLANS = [
  { id: 'plan-essential', name: 'Digital Essential', per: 'month', blurb: 'Ideal for independent home practitioners seeking regular access to our on-demand archive.', cta: 'Begin Essential', features: [['Unlimited on-demand video library (48+ courses)', true], ['4K HDR offline streaming on tablet & mobile', true], ['Audio-only meditation & pranayama tracks', true], ['Live weekly Zoom transmissions', false], ['Teacher Q&A mat circles', false]] },
  { id: 'plan-unlimited', name: 'Sanctuary Unlimited', per: 'month', featured: true, blurb: 'The full sanctuary experience at home. Live community practice, personal feedback and complete vault access.', cta: 'Join Sanctuary Unlimited', features: [['Complete on-demand course library (all styles)', true], ['4× weekly live mat streams with two-way video', true], ['Bi-weekly live teacher Q&A and alignment clinics', true], ['Private member community & practice accountability', true], ['Downloadable companion PDF guides & sequencing sheets', true]] },
  { id: 'plan-annual', name: 'Annual Immersion', per: 'year', save: 'Save 30%', blurb: 'For dedicated practitioners committed to deep transformation and physical retreat integration.', cta: 'Claim Annual Pass', features: [['All Sanctuary Unlimited perks included', true], ['1:1 45-minute virtual somatic assessment with faculty', true], ['20% in-person discount on Rishikesh retreats', true], ['Complimentary seasonal tea & linen bundle mailed home', true], ['Yoga Alliance Continuing Education credits included', true]] },
]

export const COURSE_FAQ = [
  ['How do the live stream practices work across different time zones?', 'Every live session is recorded and appears in your library within two hours, so you can practise at a time that suits you. Live sessions run on Indian Standard Time (IST) and the schedule shows your local time automatically.'],
  ['What props or home space setup do I need to begin?', 'A mat and a quiet floor space are enough to start. Each course page lists optional props — blocks, a strap, a bolster — along with household alternatives such as a firm cushion or a belt.'],
  ['Can I obtain Yoga Alliance CEU credits through the digital courses?', 'Selected advanced courses and the Annual Immersion include Yoga Alliance continuing-education credits. A certificate is issued once you complete the course and its short reflection.'],
  ['Can I cancel or pause my subscription whenever I travel?', 'Yes. Memberships are paid for the period you choose and never auto-renew without a reminder. Write to us before your period ends and we will pause your access for up to 90 days.'],
]

export const TESTIMONIALS = [
  { quote: 'PRĀNA completely dissolved my chronic shoulder holding pattern within four weeks. It is not just exercise — it is an intelligent re-patterning of your whole biological system.', name: 'Sarah Jenkins', role: 'Architect, Mumbai' },
  { quote: 'Completing the 200-hour Teacher Training was the most intellectually rigorous, yet deeply nurturing, journey of my life. The faculty genuinely protected my learning.', name: 'Marcus Thorne', role: 'Class of 2024 · Studio Owner' },
  { quote: 'The online courses possess the same rich, sacred atmosphere as the studio. I have noticed my sleep and heart rate variability improve physically, every day.', name: 'Dr. Priya Nair', role: 'Physician, Bengaluru' },
]

export const CAREER_PATHS = [
  { tier: 'RYS 200 CERTIFIED', meta: '12 Weeks Hybrid', title: '200-Hour Foundations of Teaching', text: 'Essential grounding for confident teaching: sequencing, adjustments, anatomy and the philosophy behind each posture.', price: '₹1,45,000', deposit: 'ttc-200-deposit', note: 'Full tuition · instalments available', cta: 'Enrol 200h Track', points: ['Vinyasa & Classical Hatha sequencing', 'Biomechanics, Bandhas and breath', "Patanjali's Sutras & living yoga philosophy", 'Hands-on adjustments & prop practice', '40-hour practicum teaching hours'] },
  { tier: 'RYS 300 CERTIFIED', meta: '16 Weeks Hybrid', title: '300-Hour Advanced Somatic Mastery', text: 'For 200h graduates ready to specialise: trauma-informed holding, nervous-system regulation and advanced pranayama.', price: '₹2,25,000', deposit: 'ttc-300-deposit', note: 'Includes 10-day Rishikesh in-studio immersion', cta: 'Enrol 300h Track', featured: true, points: ['Trauma-informed fascial release & somatic holding', 'Kumbhaka, Bandhas and advanced pranayama', 'Complementary rehabilitation protocols', 'Soundscapes, Nada Yoga and frequency tools', 'Mentored 60-hour teaching practicum'] },
  { tier: 'SANCTUARY FELLOWS', meta: '6 Month Apprenticeship', title: 'Mentorship & Studio Residency', text: 'A competitive paid fellowship for certified teachers — shadow senior faculty, teach in the studio and learn studio operations.', price: 'Sponsored', note: '+ Teaching stipend', cta: 'Apply for Residency', points: ['Co-teaching with Senior Sanctuary Faculty', 'Weekly scheduled live studio classes', 'Retreat architecture & financial planning', 'Audio/video production for online courses', 'Direct Studio Operations Support'] },
]

export const SYLLABUS = [
  { tab: '1. Anatomy & Biomechanics', label: 'PILLAR ONE · 60 CONTACT HOURS', title: 'Functional Anatomy & Somatic Biomechanics', text: "Move beyond standardised joint angles into somatic kinesthetic awareness. Study neuromuscular applications, nervous-system regulation, advanced pranayama and tactile alignment.", img: 'headstand', items: [['Fascia & Myofascial Slings', 'Mechanical transmission and functional tensegrity.'], ['Skeletal Individuality', 'Hip acetabulum variations and load-bearing adaptations.'], ['Cardiorespiratory Integration', 'Diaphragmatic mechanics and autonomic tonus.'], ['Environment & Protocols', 'Rehabilitation protocols, bolsters and safe modifications.']] },
  { tab: '2. Sequencing & Art of Cueing', label: 'PILLAR TWO · 50 CONTACT HOURS', title: 'The Architecture of a Class', text: 'Build classes with an energetic arc — arrival, heat, peak, release and integration — and learn the cueing language that makes every student feel seen.', img: 'vinyasa', items: [['Peak-Pose Scaffolding', 'Preparatory shapes, counter-poses and safe progression.'], ['Verbal & Tactile Cueing', 'Clear, inclusive language and consent-based adjustments.'], ['Theming & Pacing', 'Weaving breath, music and intention through 60-minute classes.'], ['Class Design Lab', 'Peer-teach and receive structured feedback.']] },
  { tab: '3. Yoga Philosophy & Ethics', label: 'PILLAR THREE · 50 CONTACT HOURS', title: 'Living Philosophy, Lived Ethics', text: 'Study the Yoga Sutras, Bhagavad Gita and Upanishads in context — and translate them into modern, inclusive, culturally respectful teaching.', img: 'sunrise', items: [['Yoga Sutras of Patanjali', 'The eight limbs and the psychology of stillness.'], ['Bhagavad Gita Reading Circle', 'Dharma, devotion and right action.'], ['Teaching Ethics', 'Boundaries, trauma-awareness and professional integrity.'], ['Cultural Humility', 'Honouring the lineage while teaching modern audiences.']] },
  { tab: '4. Business & Studio Operations', label: 'PILLAR FOUR · 40 CONTACT HOURS', title: 'Building a Sustainable Practice', text: 'From your first private client to running a studio — pricing, marketing, online delivery, insurance and community building.', img: 'group', items: [['Pricing & Packaging', 'Classes, privates, workshops and memberships.'], ['Online Delivery', 'Filming, live-streaming and course creation.'], ['Marketing with Integrity', 'Finding your people without compromising your values.'], ['Studio Operations', 'Scheduling, insurance, contracts and teacher teams.']] },
]

export const CAREER_STATS = [
  { icon: 'award', value: '98%', label: 'Certification Pass Rate', text: 'Verified on first examination round with Yoga Alliance.' },
  { icon: 'users', value: '450+', label: 'Active Global Teachers', text: 'Leading classes, studios and retreats worldwide.' },
  { icon: 'globe', value: '14', label: 'Partner Countries', text: 'Direct placement pathways in Bali, Kyoto, Zurich and Mallorca.' },
  { icon: 'briefcase', value: '84%', label: 'Employed Within 90 Days', text: 'Securing studio positions or launching profitable private client rosters.', dark: true },
]

export const ALUMNI = [
  { quote: "PRĀNA didn't just teach me how to cue downward dog. They taught me the energetic architecture of human presence. I opened my own sea-facing studio in Goa 8 months after completing the 300h.", name: 'Maya Lin-Thurston', role: 'Founder · Stella Sama Studio · Class of 2021' },
  { quote: 'The anatomy modules completely changed how I work with private clients. The residency fellowship gave me immediate live studio experience, and I now teach alongside athletes and surgeons.', name: 'Julian Moreau', role: 'Teacher · Rishikesh Sanctuary · Class of 2023' },
  { quote: 'The depth of classical philosophy was treated with the highest intellectual integrity, but authentic Vedika and Buddhist somatic epistemology. A rare combination.', name: 'Dr. Camille Renard', role: 'Author & Somatic Therapist · Class of 2022' },
]

export const PREREQS = [
  ['Consistent Practice', 'Minimum 6 months dedicated personal yoga practice for 200h applicants.'],
  ['Personal Statement of Intent', 'A one-page note on your relationship to movement, breath and teaching.'],
  ['30-Minute Admissions Interview', 'A friendly video conversation with the Programme Director.'],
  ['Need-Based Scholarship Fund', 'PRĀNA awards three 50% partial scholarships per cohort to underrepresented teachers, community caregivers and local non-profit leaders.'],
]

export const ABOUT_STATS = [['1,200+', 'Practitioners Annually'], ['24 Yrs', 'Lineage Transmission'], ['14 Acres', 'Native Cultivation'], ['100%', 'Solar & Spring Water']]
export const METHOD = [
  ['01. Somatic Breath', 'Pranayama practices that gently re-tune the nervous system, from the first inhale of class.'],
  ['02. Biomechanics', 'Alignment based on real anatomy — how your unique body is built — not on how a pose should look.'],
  ['03. Trauma-Informed', 'Invitational language, consent-based adjustments and spaces designed to feel safe.'],
  ['04. Sangha Circle', 'Community practice and shared meals that carry the benefits beyond the mat.'],
]
export const SPACES = [
  { img: 'space-shala', tag: 'Main Shala', title: 'The Sunlit Shala', text: 'Oriented to capture the first light of morning. Sprung cedar floors, hand-plastered walls and views across the valley.', meta: ['Capacity: 34 Mats', 'Acoustic Clay Panels'] },
  { img: 'space-dome', tag: 'Acoustic Chamber', title: 'The Sound Dome', text: 'A round chamber of rammed earth built for resonance — home to our gong baths, singing-bowl immersions and long Yin evenings.', meta: ['Capacity: 20 Mats', 'Gong & Bowl Library'] },
  { img: 'space-tea', tag: 'Sangha Space', title: 'Botanical Tea Pavilion', text: 'An open-air pavilion among citrus and sage where we gather after practice for tea, conversation and quiet.', meta: ['Capacity: 25 Guests', 'Herbal Tea Rituals'] },
]
export const FACULTY = [
  { initials: 'KR', badge: 'Elder Faculty', name: 'Kavita Ramachandran', role: 'Head of Pranayama & Nidra', text: '"Breath is the oldest technology we own. My work is helping you remember how to use it."', meta: ['Mysore Lineage', '30 Yrs Exp'] },
  { initials: 'JV', badge: 'Lineage Teacher', name: 'Dr. Julian Vance', role: 'Anatomy & Somatic Biomechanics', text: '"Much of the body\'s wisdom lives in the fascia. Alignment is a conversation, not an order."', meta: ['DPT Specialist', '18 Yrs Exp'] },
  { initials: 'AS', badge: 'Sound Architect', name: 'Ayla Serapion', role: 'Nada Yoga & Sound Healing', text: '"Vibration is medicine for the nervous system. Our instruments hold space for deep rest."', meta: ['Nepal Tradition', '14 Yrs Exp'] },
  { initials: 'MR', badge: 'Ayurveda Guide', name: 'Acharya Madhav Rao', role: 'Ayurveda & Philosophy', text: '"Ancient traditions offer a living map. Our daily rituals are how we return home."', meta: ['Kerala Lineage', '35 Yrs Exp'] },
]

export const GALLERY_FILTERS = ['All Works', 'Studio Practice', 'Breath & Meditation', 'Outdoors & Sunrise', 'Community', 'Rishikesh']
export const GALLERY_ITEMS = [
  { img: 'sea', cat: 'Outdoors & Sunrise', title: 'Bhavana Flow: Alignment at Dusk', series: 'Prana Flow Series', text: 'Soft light, slow breath — the closing sequence of our sunset class.' },
  { img: 'sound', cat: 'Breath & Meditation', title: 'Tibetan Singing Bowls & Sound Bath Ceremony', series: 'Acoustic Ethos', text: 'Resonant bronze, held breath and long exhales in the Sound Dome.' },
  { img: 'sunrise', cat: 'Outdoors & Sunrise', title: 'Sunrise Salutations on the Mountain Deck', series: 'Dawn Practice', text: 'Surya Namaskar as the valley wakes up.' },
  { img: 'group', cat: 'Community', title: '200hr Teacher Training Cohort: Anatomical Practicum', series: 'Academy Life', text: 'Hands-on biomechanics lab with the spring cohort.' },
  { img: 'yin', cat: 'Studio Practice', title: 'Restorative Yin & Organic Bolster Alignment', series: 'Restorative', text: 'Supported shapes, warm blankets, unhurried time.' },
  { img: 'desert', cat: 'Breath & Meditation', title: 'Silent Garden Walking Meditation', series: 'Botanical Sanctuary', text: 'Slow steps among sage and citrus after morning practice.' },
  { img: 'headstand', cat: 'Studio Practice', title: 'Advanced Inversion Clinic', series: 'Somatic Masterclass', text: 'Scapular stability drills ahead of a Pincha Mayurasana workshop.' },
  { img: 'campfire', cat: 'Community', title: 'Full Moon Fire Circle', series: 'Sangha Gatherings', text: 'Chant, silence and tea beside the fire on full-moon evenings.' },
  { img: 'pranayama', cat: 'Breath & Meditation', title: 'Vagus Nerve Reset: Breath Architecture', series: 'Somatic Masterclass', text: 'A guided pranayama session to down-regulate the nervous system.' },
  { img: 'outdoor', cat: 'Outdoors & Sunrise', title: 'Meadow Meditation, Valley Light', series: 'Dawn Practice', text: 'Cross-legged on the lawn as the mist lifts.' },
  { img: 'vinyasa', cat: 'Studio Practice', title: 'Vinyasa Architecture: Flow II', series: 'Studio Classes', text: 'Breath-led transitions through the Sunlit Shala.' },
  { img: 'philosophy', cat: 'Studio Practice', title: 'Quiet Hour: Self-Guided Practice', series: 'Open Shala', text: 'Unstructured time in the shala, held in silence.' },
  { img: 'rk-bridge', cat: 'Rishikesh', title: 'Laxman Jhula at First Light', series: 'Rishikesh Diaries', text: 'The footbridge before the crowds — the best time for a quiet crossing.' },
  { img: 'rk-aarti', cat: 'Rishikesh', title: 'Ganga Aarti, Triveni Ghat', series: 'Rishikesh Diaries', text: 'Lamps on the water as the evening bells begin.' },
  { img: 'rk-ganga', cat: 'Rishikesh', title: 'Morning by the River', series: 'Rishikesh Diaries', text: 'Seated practice on a sandbank while the mist lifts.' },
  { img: 'rk-hills', cat: 'Rishikesh', title: 'Foothills in the Mist', series: 'Rishikesh Diaries', text: 'The ridge above the shala on a cool November morning.' },
  { img: 'rk-cafe', cat: 'Community', title: 'Chai After Class', series: 'Sangha Gatherings', text: 'The pavilion fills up with tea, talk and long silences.' },
  { img: 'rk-grove', cat: 'Rishikesh', title: 'Forest Path Walking Meditation', series: 'Rishikesh Diaries', text: 'Slow steps beneath old trees, a short walk from the gate.' },
]
export const COMMUNITY_SHOTS = ['arms-up', 'stretch', 'campfire', 'neck']
export const GALLERY_STATS = [['120+', 'Curated Photographs'], ['9', 'Looping Reels'], ['3', 'Architectural Shalas'], ['1', 'Himalayan River']]
export const TOUR_POINTS = [['Binaural Acoustic Mastering', 'Hear the shala breathe: recorded with binaural microphones for headphone listening.'], ['Live Sunrise Lighting Simulation', 'Watch how morning light travels through the shala from 6 AM to noon.']]

export const HOME_STATS = [['3', 'Studio Shalas', 'Heated cedar, earth and garden air'], ['42', 'Weekly Sessions', 'From gentle yin to Ashtanga'], ['14', 'Master Mentors', 'Lineage-grounded yoga teachers'], ['Rishikesh', 'Uttarakhand', 'Himalayan foothills, a short walk from the Ganga']]
export const CONTACT_FAQ = [
  ['What should I wear or bring to my first class?', 'Wear breathable, flexible natural-fibre clothing. We supply eco-friendly mats, natural cork blocks, bolsters and organic cotton straps free of charge. You may bring your own refillable water bottle.'],
  ['Can beginners attend all-levels vinyasa classes?', 'Yes. Our instructors provide tiered adjustments for each posture. If you are entirely new to yoga, we particularly recommend our Gentle Somatic Flow or Candlelight Yin sessions on Tuesday and Thursday evenings.'],
  ['How do class credits and studio memberships work?', 'Single drop-ins are ₹1,500, with 10-class packs valid for 12 months. Unlimited Sanctuary Memberships include daily drop-ins, sound baths, guest passes and a 15% discount on residential retreats.'],
  ['Are private wellness consultations and mat rentals available?', 'Yes. We offer 1:1 private somatic bodywork, ayurvedic pulse assessments and private breathwork sessions with senior mentors. All equipment is sanitised with organic lavender and cedar oil between visits.'],
]
export const ETIQUETTE = [
  ['car', 'Two-wheeler and car parking inside the gate, a 6-minute walk from Laxman Jhula. Autos and e-rickshaws stop at Tapovan Chowk.'],
  ['clock', 'Please arrive 15 minutes before practice. Shala wooden doors seal promptly at the hour.'],
  ['lock', 'Silent device sanctuary. Private cedar lockers with biometric locks are provided.'],
  ['droplet', 'Complimentary filtered alkaline spring water and herbal infusions in our tea lounge.'],
]
export const TOPICS = ['Class & studio visit', 'Teacher training', 'Private wellness consultation', 'Private retreat', 'Online courses & billing', 'Something else']
export const TIMES = ['Morning Sadhana (6:30 AM)', 'Mid-morning (9:30 AM)', 'Afternoon (4:00 PM)', 'Evening Yin (6:30 PM)', 'No preference']
