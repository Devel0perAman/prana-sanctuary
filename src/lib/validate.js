// Client-side validation — mirrors server/lib/validate.js (the server is the source of truth).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s()-]{7,18}$/
const t = (v) => String(v ?? '').trim()

export function validateBuyer(v) {
  const e = {}
  if (t(v.name).length < 2) e.name = 'Please enter your full name.'
  if (!EMAIL.test(t(v.email))) e.email = 'Please enter a valid email address.'
  if (!PHONE.test(t(v.phone))) e.phone = 'Please enter a valid phone number.'
  return e
}

export function validateContact(v, { phoneRequired = false } = {}) {
  const e = {}
  if (t(v.name).length < 2) e.name = 'Please enter your full name.'
  if (!EMAIL.test(t(v.email))) e.email = 'Please enter a valid email address.'
  if (phoneRequired ? !PHONE.test(t(v.phone)) : t(v.phone) && !PHONE.test(t(v.phone))) e.phone = 'Please enter a valid phone number.'
  if (t(v.message).length < 10) e.message = 'Please tell us a little more (at least 10 characters).'
  if (v.date) {
    const d = new Date(v.date + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0)
    if (Number.isNaN(d.getTime()) || d < today) e.date = 'Please choose today or a future date.'
  }
  return e
}
export const validateEmail = (v) => (EMAIL.test(t(v)) ? null : 'Please enter a valid email address.')
