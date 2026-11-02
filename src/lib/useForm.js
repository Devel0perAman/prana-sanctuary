import { useState } from 'react'
import { api } from './api.js'

/** Shared form state + submission handling: validation → POST /api/contact → success / error + field errors from server. */
export function useContactSubmit({ initial, validate, toPayload }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' }) // idle | sending | success | error

  const onChange = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((p) => ({ ...p, [k]: v })); setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status.state === 'sending') return
    const found = validate(values); setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ state: 'error', message: 'Please check the highlighted fields and try again.' })
      requestAnimationFrame(() => document.querySelector('.field.has-error input, .field.has-error select, .field.has-error textarea')?.focus())
      return
    }
    setStatus({ state: 'sending', message: '' })
    try {
      await api.contact(toPayload(values))
      setStatus({ state: 'success', message: '' })
    } catch (err) {
      if (err.fields) setErrors(err.fields)
      setStatus({ state: 'error', message: err.message })
    }
  }
  const reset = () => { setValues(initial); setErrors({}); setStatus({ state: 'idle', message: '' }) }
  return { values, errors, status, onChange, submit, reset }
}
