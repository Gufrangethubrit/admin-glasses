import React from 'react'
import {
  IoTrendingUpOutline,
  IoShirtOutline,
  IoCartOutline,
  IoPeopleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoRefreshOutline,
} from 'react-icons/io5'
import '../styles/Dashboard.css'
import useDashboardStats from '../hooks/useDashboardStats'

const formatCurrency = value => `Rs.${Number(value || 0).toLocaleString('en-IN')}`
const formatNumber = value => Number(value || 0).toLocaleString('en-IN')
const formatDate = value => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const statusClass = status => String(status || 'Order Placed').toLowerCase().replace(/\s+/g, '-')

export default function Home() {
  const { stats, loading, error, refreshStats } = useDashboardStats()

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: IoTrendingUpOutline, helper: `Today ${formatCurrency(stats.todayRevenue)}`, color: 'gold' },
    { label: 'Products', value: formatNumber(stats.productCount), icon: IoShirtOutline, helper: `${formatNumber(stats.activeProductCount)} active`, color: 'blue' },
    { label: 'Orders', value: formatNumber(stats.orderCount), icon: IoCartOutline, helper: `${formatNumber(stats.pendingOrderCount)} pending`, color: 'green' },
    { label: 'Users', value: formatNumber(stats.userCount), icon: IoPeopleOutline, helper: 'Registered customers', color: 'orange' },
  ]

  return (
    <div className='page-container'>
      <div className='dashboard-top-row'>
        <div className='page-header'>
          <h1 className='page-title'>Dashboard</h1>
          <p className='page-subtitle'>Live overview from products, orders and users.</p>
          {error && <p className='dashboard-error'>{error}</p>}
        </div>
        <div className='quick-actions'>
          <button type='button' className='action-btn action-btn--secondary' onClick={refreshStats}>
            <IoRefreshOutline size={16} /> Refresh
          </button>
          <a href='/admin/add' className='action-btn action-btn--primary'>+ Add Product</a>
          <a href='/admin/products' className='action-btn action-btn--secondary'>All Products</a>
          <a href='/admin/orders' className='action-btn action-btn--secondary'>All Orders</a>
        </div>
      </div>

      <div className='stats-grid'>
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`stat-card stat-card--${stat.color}`}>
              <div className='stat-card__header'>
                <div className='stat-card__icon'><Icon size={24} /></div>
                <span className='stat-card__change'>{loading ? 'Loading' : stat.helper}</span>
              </div>
              <h3 className='stat-card__label'>{stat.label}</h3>
              <p className='stat-card__value'>{loading ? '...' : stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className='dashboard-mini-grid'>
        <div className='mini-card'>
          <IoTimeOutline size={20} />
          <div>
            <span className='mini-card__label'>Orders Today</span>
            <strong>{formatNumber(stats.todayOrderCount)}</strong>
          </div>
        </div>
        <div className='mini-card'>
          <IoCheckmarkCircleOutline size={20} />
          <div>
            <span className='mini-card__label'>Delivered Orders</span>
            <strong>{formatNumber(stats.deliveredOrderCount)}</strong>
          </div>
        </div>
        <div className='mini-card'>
          <IoShirtOutline size={20} />
          <div>
            <span className='mini-card__label'>Inactive / Out of Stock</span>
            <strong>{formatNumber(stats.inactiveProductCount)}</strong>
          </div>
        </div>
      </div>

      <div className='dashboard-section'>
        <div className='section-header'>
          <h2 className='section-title'>Recent Orders</h2>
          <a href='/admin/orders' className='section-link'>View All</a>
        </div>

        <div className='table-container'>
          <table className='dashboard-table'>
            <thead className='table-head'>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className='table-body'>
              {loading ? (
                <tr><td className='table-cell' colSpan={6}>Loading recent orders...</td></tr>
              ) : stats.recentOrders.length ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className='table-row'>
                    <td className='table-cell table-cell--id'>#{String(order._id).slice(-8).toUpperCase()}</td>
                    <td className='table-cell'>{order.customer}</td>
                    <td className='table-cell'>{order.itemsCount}</td>
                    <td className='table-cell table-cell--amount'>{formatCurrency(order.amount)}</td>
                    <td className='table-cell'>
                      <span className={`status-badge status-badge--${statusClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td className='table-cell table-cell--date'>{formatDate(order.date)}</td>
                  </tr>
                ))
              ) : (
                <tr><td className='table-cell' colSpan={6}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
