import { useState, useEffect } from 'react'

/**
 * useDebounce — delays updating the returned value until after `delay` ms
 * have elapsed with no new changes to `value`.
 *
 * @param {*} value - The value to debounce.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {*} The debounced value.
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
