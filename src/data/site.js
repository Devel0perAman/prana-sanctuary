// Brand + contact details used across the site. Edit here, not in components.
export const SITE = {
  name: 'PRĀNA',
  tagline: 'Sanctuary',
  address: ['Tapovan, Laxman Jhula Road', 'Rishikesh, Uttarakhand 249192, India'],
  addressShort: 'Tapovan, Laxman Jhula Road, Rishikesh, Uttarakhand 249192',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'sanctuary@pranayoga.com',
  hours: [
    ['Monday – Friday', '05:30 AM – 08:30 PM IST'],
    ['Saturday & Sunday', '06:00 AM – 08:00 PM IST'],
    ['Full & New Moon Nights', 'Ganga-side Dusk Meditations'],
  ],
  social: [{ label: 'Instagram', href: 'https://instagram.com/pranasanctuary' }],
  coords: { lat: 30.1296, lon: 78.3247 },
}

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/yoga-career', label: 'Yoga Career' },
  { to: '/courses', label: 'Online Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
]

export const FOOTER_COLS = [
  { title: 'Sanctuary', links: [['Philosophy & Lineage', '/about'], ['Resident Teachers', '/about#faculty'], ['Online Library', '/courses'], ['Sanctuary Gallery', '/gallery'], ['Weekly Schedule', '/contact#hours']] },
  { title: 'Practices & Courses', links: [['Hatha & Somatic Flow', '/courses'], ['Vinyasa Architecture', '/courses'], ['Restorative Yin', '/courses'], ['Pranayama & Breathwork', '/courses'], ['200hr Teacher Training', '/yoga-career']] },
]

export const SITE_AREA = 'Tapovan, Rishikesh'

export const LEGAL = [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund & Cancellation', '/refunds']]
