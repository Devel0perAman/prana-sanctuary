// Tiny History-API router (no dependency). Supports <Link>, navigate(), hash scrolling and scroll restoration.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext({ path: '/', hash: '', navigate: () => {} })
const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/'

export function Router({ children }) {
  const [loc, setLoc] = useState(() => ({ path: norm(location.pathname), hash: location.hash }))
  useEffect(() => {
    const on = () => setLoc({ path: norm(location.pathname), hash: location.hash })
    window.addEventListener('popstate', on); return () => window.removeEventListener('popstate', on)
  }, [])
  const navigate = useCallback((to) => {
    const u = new URL(to, location.origin)
    history.pushState({}, '', u.pathname + u.search + u.hash)
    setLoc({ path: norm(u.pathname), hash: u.hash })
  }, [])

  // After each navigation: scroll to #hash if present, else to top.
  useEffect(() => {
    if (loc.hash) {
      const t = setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [loc.path, loc.hash])

  const value = useMemo(() => ({ ...loc, navigate }), [loc, navigate])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useRouter = () => useContext(Ctx)

export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRouter()
  const external = /^(https?:|mailto:|tel:)/.test(to)
  if (external) return <a href={to} onClick={onClick} {...rest}>{children}</a>
  return (
    <a href={to} {...rest} onClick={(e) => {
      onClick?.(e)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return
      e.preventDefault(); navigate(to)
    }}>{children}</a>
  )
}

export function Routes({ routes, fallback }) {
  const { path } = useRouter()
  const Page = routes[path] || fallback
  return <Page key={path} />
}
