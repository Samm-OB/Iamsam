// localStorage can throw (private mode, blocked storage) — never let that break the UI.
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`samos:${key}`)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(`samos:${key}`, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
