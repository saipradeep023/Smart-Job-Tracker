import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  MdDashboard, MdWork, MdAddCircleOutline, MdBarChart, MdMenu, MdClose,
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: MdDashboard },
  { to: '/applications', label: 'Applications', Icon: MdWork },
  { to: '/applications/new', label: 'Add Job', Icon: MdAddCircleOutline },
  { to: '/analytics', label: 'Analytics', Icon: MdBarChart },
]

const NavItems = ({ onClick }) =>
  navItems.map(({ to, label, Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/applications/new' ? false : true}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-500'} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  ))

const Sidebar = () => (
  <aside className="hidden md:flex flex-col w-[260px] h-screen overflow-y-auto bg-white border-r border-slate-200 px-6 py-8 shrink-0">
    <div className="flex items-center gap-3 mb-10">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white">
        <MdWork size={20} />
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-900">JobTracker</span>
    </div>

    <nav className="flex flex-col gap-2 flex-1">
      <NavItems />
    </nav>

    <p className="text-center text-xs font-medium text-slate-500 mt-8">Smart Job Tracker v1.0</p>
  </aside>
)

const MobileNav = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex md:hidden items-center justify-between bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <MdWork size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">JobTracker</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-slate-600 p-2"
          aria-label="Toggle menu"
        >
          {open ? <MdClose size={26} /> : <MdMenu size={26} />}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-slate-200 px-6 py-8 z-30 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <MdWork size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">JobTracker</span>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItems onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  )
}

const Layout = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
    <Sidebar />
    <div className="flex flex-col flex-1 min-w-0 h-screen">
      <MobileNav />
      <main className="flex-1 w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
)

export default Layout
