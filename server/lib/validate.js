// Shared server-side validators. Client mirrors these rules in src/lib/validate.js.
export const clean = (v, max = 500) =>
  String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s()-]{7,18}$/

export function validateBuyer(b = {}) {
  const v = { name: clean(b.name, 100), email: clean(b.email, 150).toLowerCase(), phone: clean(b.phone, 20) }
  const errors = {}
  if (v.name.length < 2) errors.name = 'Please enter your full name.'
  if (!EMAIL.test(v.email)) errors.email = 'Please enter a valid email address.'
  if (!PHONE.test(v.phone)) errors.phone = 'Please enter a valid phone number.'
  return { value: v, errors }
}

export function validateContact(b = {}) {
  const v = {
    name: clean(b.name, 100), email: clean(b.email, 150).toLowerCase(), phone: clean(b.phone, 20),
    topic: clean(b.topic, 80), date: clean(b.date, 20), time: clean(b.time, 40),
    message: clean(b.message, 2000), matRequested: Boolean(b.matRequested), kind: b.kind === 'application' ? 'application' : 'inquiry',
  }
  const errors = {}
  if (v.name.length < 2) errors.name = 'Please enter your full name.'
  if (!EMAIL.test(v.email)) errors.email = 'Please enter a valid email address.'
  if (v.phone && !PHONE.test(v.phone)) errors.phone = 'Please enter a valid phone number.'
  if (v.date && !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) errors.date = 'Please choose a valid date.'
  if (v.message.length < 10) errors.message = 'Please tell us a little more (at least 10 characters).'
  return { value: v, errors }
}

export function validateEmail(email) {
  const v = clean(email, 150).toLowerCase()
  return EMAIL.test(v) ? { value: v } : { errors: { email: 'Please enter a valid email address.' } }
}
