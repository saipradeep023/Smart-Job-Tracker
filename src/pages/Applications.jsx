import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MdAdd, MdWorkOutline } from 'react-icons/md'
import { useApplications } from '../context'
import { filterBySearch, filterByFields, sortApplications } from '../utils/helpers'
import PageTransition from '../components/PageTransition'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'

const TABS = [
  { id: 'All', label: 'All Jobs' },
  { id: 'Applied', label: 'Applied' },
  { id: 'Interviewing', label: 'Interviewing' },
  { id: 'Offer', label: 'Offers' },
  { id: 'Rejected', label: 'Rejected' },
]

const Applications = () => {
  const { applications, deleteApplication, toggleBookmark } = useApplications()

  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [sortKey, setSortKey] = useState('appliedDate')
  const [sortDir, setSortDir] = useState('desc')

  const processedApps = useMemo(() => {
    let result = applications
    if (activeTab !== 'All') {
      result = result.filter((a) => a.status === activeTab)
    }
    result = filterBySearch(result, searchQuery)
    result = filterByFields(result, filters)
    result = sortApplications(result, sortKey, sortDir)
    return result
  }, [applications, activeTab, searchQuery, filters, sortKey, sortDir])

  const handleFilterChange = ({ filters, sortKey, sortDir }) => {
    setFilters(filters)
    setSortKey(sortKey)
    setSortDir(sortDir)
  }

  const tabCounts = useMemo(() => {
    const counts = { All: applications.length }
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1
    })
    return counts
  }, [applications])

  return (
    <PageTransition>
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applications</h1>
            <p className="text-slate-500 font-medium mt-2">Manage and track your job search pipeline.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/applications/new" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] transition-all shrink-0"
            >
              <MdAdd size={20} />
              <span>Add Job</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 mb-8 pb-px no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-4 border-b-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tabCounts[tab.id] || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* Controls: Search + Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-5 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <Filters
            filters={filters}
            sortKey={sortKey}
            sortDir={sortDir}
            onChange={handleFilterChange}
          />
        </div>

        {/* Grid */}
        {processedApps.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            <AnimatePresence mode="popLayout">
              {processedApps.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onDelete={deleteApplication}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 py-24 px-8 flex-1 flex flex-col items-center justify-center rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-6">
              <MdWorkOutline size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
            <p className="text-slate-500 font-medium text-center max-w-md mb-8">
              {applications.length === 0
                ? "You haven't tracked any jobs yet. Add your first application to get started."
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {applications.length === 0 && (
              <Link to="/applications/new" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Track a new job <MdAdd size={20} />
              </Link>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Applications
