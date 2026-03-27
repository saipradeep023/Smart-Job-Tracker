import { MdFilterList, MdSort, MdClose } from 'react-icons/md'

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected']
const PLATFORMS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other']
const SORT_OPTIONS = [
  { value: 'appliedDate-desc', label: 'Newest First' },
  { value: 'appliedDate-asc',  label: 'Oldest First' },
  { value: 'salary-desc',      label: 'Salary ↓' },
  { value: 'salary-asc',       label: 'Salary ↑' },
  { value: 'company-asc',      label: 'Company A–Z' },
  { value: 'company-desc',     label: 'Company Z–A' },
]

const filterSelectClasses = "bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 rounded-2xl py-3 pl-4 pr-10 outline-none transition-all cursor-pointer appearance-none hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
const selectBgIcon = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`

const Filters = ({ filters = {}, sortKey = 'appliedDate', sortDir = 'desc', onChange }) => {
  const sortValue = `${sortKey}-${sortDir}`

  const handleSort = (e) => {
    const [key, dir] = e.target.value.split('-')
    onChange?.({ filters, sortKey: key, sortDir: dir })
  }

  const handleStatus = (e) => {
    onChange?.({ filters: { ...filters, status: e.target.value }, sortKey, sortDir })
  }

  const handlePlatform = (e) => {
    onChange?.({ filters: { ...filters, platform: e.target.value }, sortKey, sortDir })
  }

  const hasActiveFilters = filters.status || filters.platform

  const clearFilters = () => {
    onChange?.({ filters: {}, sortKey, sortDir })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status filter */}
      <div className="relative flex items-center">
        <MdFilterList size={18} className="absolute left-3 text-slate-500 pointer-events-none" />
        <select 
          value={filters.status || ''} 
          onChange={handleStatus} 
          className={`${filterSelectClasses} pl-9`}
          style={{ backgroundImage: selectBgIcon, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Platform filter */}
      <select 
        value={filters.platform || ''} 
        onChange={handlePlatform} 
        className={filterSelectClasses}
        style={{ backgroundImage: selectBgIcon, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
      >
        <option value="">All Platforms</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Sort */}
      <div className="relative flex items-center">
        <MdSort size={18} className="absolute left-3 text-slate-500 pointer-events-none" />
        <select 
          value={sortValue} 
          onChange={handleSort} 
          className={`${filterSelectClasses} pl-9`}
          style={{ backgroundImage: selectBgIcon, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Clear button */}
      {hasActiveFilters && (
        <button 
          onClick={clearFilters} 
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 py-2.5 px-3 rounded-2xl transition-colors hover:text-red-600 hover:bg-slate-100"
        >
          <MdClose size={16} />
          Clear filters
        </button>
      )}
    </div>
  )
}

export default Filters
