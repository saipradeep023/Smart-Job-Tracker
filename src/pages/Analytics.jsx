import { MdTrendingUp, MdInsights, MdSpeed } from 'react-icons/md'
import { useApplications } from '../context'
import PageTransition from '../components/PageTransition'
import { TrendLineChart } from '../components/Charts'

const InsightCard = ({ title, value, subtitle, icon: Icon, colorBg, colorText, colorBorder }) => (
  <div className={`bg-white border rounded-xl p-6 flex flex-col transition-shadow hover:shadow-md ${colorBorder}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-4 ${colorBg} ${colorText}`}>
      <Icon size={24} />
    </div>
    <div className="pb-4">
      <h3 className="text-slate-900 text-lg font-bold">{title}</h3>
    </div>
    <div className="mt-auto">
      <p className="text-slate-900 text-4xl font-extrabold tracking-tight mb-2">{value}</p>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{subtitle}</p>
    </div>
  </div>
)

const Analytics = () => {
  const { applications } = useApplications()

  const total = applications.length
  
  const interviews = applications.filter((a) => a.status === 'Interviewing' || a.status === 'Offer').length
  const callRate = total > 0 ? Math.round((interviews / total) * 100) : 0

  const salaries = applications.filter((a) => typeof a.salary === 'number' && a.salary > 0).map((a) => a.salary)
  const avgSalary = salaries.length > 0 
    ? `$${Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length).toLocaleString()}`
    : 'N/A'

  const platformCounts = {}
  applications.forEach((a) => {
    if (a.platform) platformCounts[a.platform] = (platformCounts[a.platform] || 0) + 1
  })
  const topPlatformEntry = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]
  const topPlatform = topPlatformEntry ? topPlatformEntry[0] : 'N/A'
  const topPlatformPct = topPlatformEntry && total > 0 ? Math.round((topPlatformEntry[1] / total) * 100) : 0

  return (
    <PageTransition>
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col min-h-full gap-10">
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Insights</h1>
            <p className="text-slate-500 font-medium mt-2">Deep dive into your application metrics over time.</p>
          </div>
        </div>

        {/* Application Velocity Chart */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col w-full">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-slate-900 font-bold text-lg tracking-tight m-0">Application Velocity</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Rolling 12-month trend of jobs added to your pipeline.</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MdTrendingUp size={24} />
            </div>
          </div>
          <div className="flex-1 -mt-2 -mx-4">
            <TrendLineChart applications={applications} />
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard
            title="Call Rate"
            value={`${callRate}%`}
            subtitle={total > 0 
              ? `You secure an interview for every ${Math.round(100/Math.max(1, callRate))} jobs you apply to on average.`
              : 'Add jobs to see your interview conversion rate.'}
            icon={MdInsights}
            colorBg="bg-emerald-50"
            colorText="text-emerald-600"
            colorBorder="border-emerald-500/20"
          />
          <InsightCard
            title="Top Sourcing"
            value={topPlatform}
            subtitle={topPlatform !== 'N/A'
              ? `${topPlatformPct}% of your total applications originated from this specific platform.`
              : 'Add platforms to your jobs to track sourcing attribution.'}
            icon={MdSpeed}
            colorBg="bg-blue-50"
            colorText="text-blue-600"
            colorBorder="border-blue-500/20"
          />
          <InsightCard
            title="Target Salary"
            value={avgSalary}
            subtitle={salaries.length > 0
              ? `Based on ${salaries.length} applications where you specified expected or listed compensation.`
              : 'Add salary details to jobs to track your target compensation average.'}
            icon={MdTrendingUp}
            colorBg="bg-slate-50"
            colorText="text-slate-600"
            colorBorder="border-slate-200"
          />
        </div>
      </div>
    </PageTransition>
  )
}

export default Analytics
