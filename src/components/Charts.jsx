import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import { format, parseISO, startOfMonth } from 'date-fns'

export const STATUS_COLORS = {
  Applied:      '#94a3b8', /* slate-400 */
  Interviewing: '#3b82f6', /* blue-500 */
  Offer:        '#10b981', /* emerald-500 */
  Rejected:     '#ef4444', /* red-500 */
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] min-w-[120px]">
      {label && <p className="text-slate-600 mb-1.5 font-medium">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }} className="flex justify-between gap-4 font-bold mt-1">
          <span>{p.name}:</span>
          <span>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

const EmptyChart = ({ message }) => (
  <div className="flex items-center justify-center h-[260px] text-slate-500 text-sm font-medium">
    {message}
  </div>
)

export const StatusPieChart = ({ applications = [] }) => {
  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const data = Object.entries(STATUS_COLORS).map(([status, color]) => ({
    name: status,
    value: counts[status] ?? 0,
    color,
  })).filter((d) => d.value > 0)

  if (!data.length) return <EmptyChart message="No applications yet" />

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(v) => <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, marginLeft: '4px' }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const MonthlyBarChart = ({ applications = [] }) => {
  const monthMap = {}
  applications.forEach((a) => {
    if (!a.appliedDate) return
    const key = format(startOfMonth(parseISO(a.appliedDate)), 'MMM yy')
    monthMap[key] = (monthMap[key] ?? 0) + 1
  })

  const data = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(`01 ${a.month}`) - new Date(`01 ${b.month}`))
    .slice(-8)

  if (!data.length) return <EmptyChart message="No application history yet" />

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={36}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          width={30}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="count" name="Applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const TrendLineChart = ({ applications = [] }) => {
  const monthMap = {}
  applications.forEach((a) => {
    if (!a.appliedDate) return
    const key = format(startOfMonth(parseISO(a.appliedDate)), 'MMM yy')
    monthMap[key] = (monthMap[key] ?? 0) + 1
  })

  const data = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(`01 ${a.month}`) - new Date(`01 ${b.month}`))
    .slice(-12)

  if (!data.length) return <EmptyChart message="No trend data yet" />

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={30} dx={-10} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count"
          name="Applications"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: '#ffffff', stroke: '#3b82f6', r: 5, strokeWidth: 2 }}
          activeDot={{ r: 7, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
