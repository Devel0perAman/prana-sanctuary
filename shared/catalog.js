// Single source of truth for everything that can be bought.
// Amounts are in paise (₹1 = 100 paise). The browser NEVER sends an amount —
// it only sends an item id, and the server looks the price up here.
export const CATALOG = {
  'course-foundations': { kind: 'course', name: 'Beginner Yoga Foundations: Aligning Breath & Bone', amount: 199900 },
  'course-pranayama':   { kind: 'course', name: 'Pranayama & Deep Nervous System Reset', amount: 199900 },
  'course-vinyasa':     { kind: 'course', name: 'Vinyasa Flow II: Dynamic Vitality & Agility', amount: 299900 },
  'course-yin':         { kind: 'course', name: 'Restorative Yin: Somatic Release for Chronic Stress', amount: 199900 },
  'course-asana':       { kind: 'course', name: 'Advanced Asana: Inversions & Arm Balance Biomechanics', amount: 299900 },
  'course-sequencing':  { kind: 'course', name: 'The Art of Sequencing: For Teachers & Dedicated Students', amount: 349900 },
  'ttc-200-deposit':    { kind: 'ttc',    name: '200-Hour Teacher Training — seat deposit', amount: 3499900 },
  'ttc-300-deposit':    { kind: 'ttc',    name: '300-Hour Advanced Training — seat deposit', amount: 4999900 },
  'plan-essential':     { kind: 'plan',   name: 'Digital Essential — 1 month', amount: 199900 },
  'plan-unlimited':     { kind: 'plan',   name: 'Sanctuary Unlimited — 1 month', amount: 399900 },
  'plan-annual':        { kind: 'plan',   name: 'Annual Immersion — 12 months', amount: 3499900 },
}

export const formatINR = (paise) =>
  '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })
