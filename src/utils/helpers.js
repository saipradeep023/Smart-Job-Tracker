import { fetchMockProducts } from '../services/api'

// ─── Static lookup tables ─────────────────────────────────────────────────────

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected']
const PLATFORMS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other']
const LOCATIONS = [
  'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX',
  'Seattle, WA', 'Chicago, IL', 'Boston, MA', 'Los Angeles, CA',
]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomSalary = () => Math.floor(Math.random() * 120_000 + 60_000)

export const mapProductToJob = (product) => {
  const daysAgo = (product.id % 60) + 1
  const appliedDate = new Date(Date.now() - daysAgo * 86_400_000).toISOString()
  const status = STATUSES[product.id % STATUSES.length]

  let interviewDate = null
  if (status === 'Interviewing' || status === 'Offer') {
    const future = (product.id % 14) + 1
    interviewDate = new Date(Date.now() + future * 86_400_000).toISOString()
  }

  return {
    id: `mock-${product.id}`,
    company: product.brand || product.category || 'TechCorp',
    role: product.title.length > 40 ? product.title.slice(0, 40) : product.title,
    location: pick(LOCATIONS),
    salary: randomSalary(),
    platform: pick(PLATFORMS),
    status,
    appliedDate,
    interviewDate,
    notes: product.description?.slice(0, 120) || '',
    bookmarked: product.id % 5 === 0,
  }
}

export const fetchMockJobs = async (limit = 20) => {
  const products = await fetchMockProducts(limit)
  return products.map(mapProductToJob)
}

// ─── Filter & sort helpers ────────────────────────────────────────────────────

export const filterBySearch = (apps, query) => {
  if (!query?.trim()) return apps
  const q = query.toLowerCase()
  return apps.filter(
    (a) =>
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q)
  )
}

export const filterByFields = (apps, { status, platform } = {}) => {
  return apps.filter((a) => {
    if (status && a.status !== status) return false
    if (platform && a.platform !== platform) return false
    return true
  })
}

export const sortApplications = (apps, sortKey = 'appliedDate', direction = 'desc') => {
  return [...apps].sort((a, b) => {
    let aVal = a[sortKey]
    let bVal = b[sortKey]

    if (sortKey === 'appliedDate') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else if (sortKey === 'salary') {
      aVal = aVal ?? 0
      bVal = bVal ?? 0
    } else {
      aVal = aVal?.toLowerCase() ?? ''
      bVal = bVal?.toLowerCase() ?? ''
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export const formatSalary = (salary) => {
  if (!salary) return 'N/A'
  if (salary >= 1000) return `$${(salary / 1000).toFixed(0)}K`
  return `$${salary.toLocaleString()}`
}

export const getStatusClass = (status) => {
  const map = {
    Applied: 'status-Applied',
    Interviewing: 'status-Interviewing',
    Offer: 'status-Offer',
    Rejected: 'status-Rejected',
  }
  return map[status] || 'status-Applied'
}
