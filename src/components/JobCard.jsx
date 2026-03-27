import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  MdEdit, MdDelete, MdBookmark, MdBookmarkBorder,
  MdLocationOn, MdAttachMoney, MdCalendarToday, MdOpenInNew,
} from 'react-icons/md'
import { motion } from 'framer-motion'
import { getClearbitLogoUrl } from '../services/api'
import { formatSalary } from '../utils/helpers'

const getStatusClasses = (status) => {
  const map = {
    Applied: 'bg-slate-100 text-slate-700',
    Interviewing: 'bg-blue-50 text-blue-700',
    Offer: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-red-50 text-red-600',
  }
  const dotMap = {
    Applied: 'bg-slate-500',
    Interviewing: 'bg-blue-500',
    Offer: 'bg-emerald-500',
    Rejected: 'bg-red-500',
  }
  return {
    badge: map[status] || map.Applied,
    dot: dotMap[status] || dotMap.Applied,
  }
}

const JobCard = ({ job, onDelete, onToggleBookmark }) => {
  const [logoError, setLogoError] = useState(false)
  const logoUrl = getClearbitLogoUrl(job.company)
  
  const appliedFormatted = job.appliedDate
    ? format(new Date(job.appliedDate), 'MMM d, yyyy')
    : '—'

  const statusStyle = getStatusClasses(job.status)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            {!logoError && logoUrl ? (
              <img
                src={logoUrl}
                alt={job.company}
                className="w-8 h-8 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-slate-600 font-bold text-lg">
                {job.company?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-900 font-bold text-base truncate" title={job.company}>
              {job.company}
            </h3>
            <p className="text-slate-600 text-sm font-semibold truncate mt-0.5" title={job.role}>
              {job.role}
            </p>
          </div>
        </div>

        <span className={`shrink-0 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/5 ${statusStyle.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {job.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-600 font-medium">
        {job.location && (
          <span className="flex items-center gap-1.5 truncate" title={job.location}>
            <MdLocationOn size={16} className="shrink-0 text-slate-500" />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1.5">
            <MdAttachMoney size={16} className="shrink-0 text-emerald-500" />
            {formatSalary(job.salary)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <MdCalendarToday size={15} className="shrink-0 text-slate-500" />
          {appliedFormatted}
        </span>
        {job.platform && (
          <span className="flex items-center gap-1.5 truncate" title={job.platform}>
            <MdOpenInNew size={15} className="shrink-0 text-slate-500" />
            {job.platform}
          </span>
        )}
      </div>

      {job.notes && (
        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-200 line-clamp-2">
          {job.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto">
        <button
          onClick={() => onToggleBookmark?.(job.id)}
          aria-label={job.bookmarked ? 'Remove bookmark' : 'Bookmark'}
          className={`p-1.5 -ml-1.5 rounded-lg transition-colors ${
            job.bookmarked ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500 hover:bg-slate-50'
          }`}
        >
          {job.bookmarked ? <MdBookmark size={22} /> : <MdBookmarkBorder size={22} />}
        </button>

        <div className="flex items-center gap-1">
          <Link
            to={`/applications/${job.id}`}
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Edit"
          >
            <MdEdit size={18} />
          </Link>
          <button
            onClick={() => onDelete?.(job.id)}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default JobCard
