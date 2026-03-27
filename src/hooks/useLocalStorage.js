import { useState, useEffect } from 'react'

/**
 * useLocalStorage — persist state to localStorage across sessions.
 * @param {string} key  - The localStorage key.
 * @param {*} initialValue - Default value if nothing stored yet.
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (err) {
      console.warn(`useLocalStorage: could not read key "${key}"`, err)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.warn(`useLocalStorage: could not write key "${key}"`, err)
    }
  }

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch {
          // ignore parse errors from other tabs
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  return [storedValue, setValue]
}

export default useLocalStorage
