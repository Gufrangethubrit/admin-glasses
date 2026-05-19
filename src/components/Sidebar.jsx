import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IoGridOutline,
  IoSwapHorizontal,
  IoCart,
  IoAddCircleOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import '../styles/Sidebar.css'
import useDashboardStats from '../hooks/useDashboardStats'

const sidebarItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: IoGridOutline },
  { label: 'Add Product', to: '/admin/add', icon: IoAddCircleOutline },
  { label: 'Products', to: '/admin/products', icon: IoSwapHorizontal },
  { label: 'Orders', to: '/admin/orders', icon: IoCart },
  { label: 'Settings', to: '/admin/settings', icon: IoSettingsOutline },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { stats } = useDashboardStats()

  const getBadge = label => {
    if (label === 'Products') return stats.productCount
    if (label === 'Orders') return stats.pendingOrderCount
    return null
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'}`}>
      <div className="sidebar__header">
        <h2 className="sidebar__title">Navigation</h2>
        <button
          className="sidebar__toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          {sidebarOpen ? '-' : '+'}
        </button>
      </div>

      <div className="sidebar__content">
        <ul className="sidebar__items">
          {sidebarItems.map(({ label, to, icon }) => {
            const Icon = icon
            const badge = getBadge(label)
            return (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                  }
                >
                  <Icon className="sidebar__link-icon" size={18} />
                  {sidebarOpen && <span className="sidebar__link-text">{label}</span>}
                  {sidebarOpen && badge !== null && (
                    <span className="sidebar__link-badge">{badge}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="sidebar__footer">
        <p className="sidebar__version">v1.0.0</p>
        {sidebarOpen && (
          <div className="sidebar__stats">
            <div className="sidebar__stat">
              <span className="sidebar__stat-label">Orders Today</span>
              <span className="sidebar__stat-value">{stats.todayOrderCount}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
