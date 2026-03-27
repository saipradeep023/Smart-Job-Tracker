import { useState, useEffect } from 'react'
import { MdSearch, MdClose } from 'react-icons/md'
import useDebounce from '../hooks/useDebounce'

const SearchBar = ({ onSearch, placeholder = 'Search by company or role...', delay = 350 }) => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    onSearch?.(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <div className="relative w-full max-w-md">
      <MdSearch size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      <input
        id="job-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-2xl py-3 pl-10 pr-10 outline-none shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 rounded-md hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Clear search"
        >
          <MdClose size={18} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
