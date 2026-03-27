import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdAdd, MdWork, MdCheckCircle, MdCancel, MdAutoGraph } from 'react-icons/md'
import { useApplications } from '../context'
import { fetchMockJobs } from '../utils/helpers'
import PageTransition from '../components/PageTransition'
import { StatusPieChart, MonthlyBarChart } from '../components/Charts'

const StatCard = ({ title, value, icon: Icon, colorBg, colorText }) => (
  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-row items-center gap-4 transition-shadow hover:shadow-md">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colorBg} ${colorText}`}>
      <Icon size={28} />
    </div>
    <div>
      <h3 className="text-slate-900 text-3xl font-extrabold tracking-tight">{value}</h3>
      <p className="text-slate-600 font-semibold text-sm mt-0.5">{title}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const { applications, addApplication } = useApplications()
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeedMockData = async () => {
    try {
      setIsSeeding(true)
      const mockJobs = await fetchMockJobs(12)
      mockJobs.forEach((job) => addApplication(job))
    } catch (err) {
      console.error(err)
    } finally {
      setIsSeeding(false)
    }
  }

  const totalApps = applications.length
  const interviewing = applications.filter((a) => a.status === 'Interviewing').length
  const offers = applications.filter((a) => a.status === 'Offer').length
  const rejected = applications.filter((a) => a.status === 'Rejected').length

  const offerRate = totalApps > 0 ? Math.round((offers / totalApps) * 100) : 0

  return (
    <PageTransition>
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col min-h-full gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium mt-2">Here is a summary of your job search progress.</p>
          </div>
          <div className="flex items-center gap-4">
            {totalApps === 0 && (
              <button
                onClick={handleSeedMockData}
                disabled={isSeeding}
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-slate-300 text-slate-900 text-sm font-bold py-3 px-5 rounded-xl transition-all hover:bg-slate-50 disabled:opacity-50"
              >
                {isSeeding ? 'Loading...' : 'Load Mock Data'}
              </button>
            )}
            <Link 
              to="/applications/new" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] transition-all shrink-0"
            >
              <MdAdd size={20} />
              <span>Add Job</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Apps"
            value={totalApps}
            icon={MdWork}
            colorBg="bg-blue-50"
            colorText="text-blue-600"
          />
          <StatCard
            title="Interviews"
            value={interviewing}
            icon={MdAutoGraph}
            colorBg="bg-slate-100"
            colorText="text-slate-600"
          />
          <StatCard
            title="Offers"
            value={offers}
            icon={MdCheckCircle}
            colorBg="bg-emerald-50"
            colorText="text-emerald-600"
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon={MdCancel}
            colorBg="bg-red-50"
            colorText="text-red-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col col-span-1">
            <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-8 flex items-start justify-between">
              Application Pipeline
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-500/20 px-3 py-1 rounded-md">
                {offerRate}% Success
              </span>
            </h2>
            <div className="flex-1 -mt-2 -mx-4">
              <StatusPieChart applications={applications} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col lg:col-span-2">
            <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-8 flex items-start justify-between">
              <span>Application Volume <span className="text-slate-500 text-sm font-medium ml-2">(Last 8 Months)</span></span>
            </h2>
            <div className="flex-1 -mt-2 -mx-4">
              <MonthlyBarChart applications={applications} />
            </div>
          </div>
        </div>

        {/* Empty state hint */}
        {totalApps === 0 && (
          <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <MdAutoGraph size={32} />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Your dashboard is empty</h3>
            <p className="text-sm font-medium text-blue-700 leading-relaxed max-w-md mx-auto">
              Start tracking your applications manually, or load some mock data to see how the dashboard charts populate dynamically.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Dashboard
