import { useState, useEffect } from 'react'
import { IoSearchOutline, IoCheckmarkCircleOutline, IoRefreshOutline } from 'react-icons/io5'
import api from '../utils/api'
import '../styles/OrdersPage.css'

const STATUS_OPTIONS = [
  'Order Placed', 'Processing', 'Shipped',
  'Out for Delivery', 'Delivered', 'Cancelled',
]

const STATUS_COLOR = {
  'Order Placed':     'orange',
  'Processing':       'purple',
  'Shipped':          'blue',
  'Out for Delivery': 'cyan',
  'Delivered':        'green',
  'Cancelled':        'red',
}

export default function Orders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('All')
  const [saved, setSaved]         = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/order/list')
      setOrders(data)
    } catch (err) {
      console.error('Fetch orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put('/api/order/update-status', { orderId: id, status: newStatus })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o))
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  const visible = orders.filter(o => {
    const matchSearch =
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const fmt = val => val ? `₹${Number(val).toLocaleString()}` : '—'
  const fmtDate = ts => ts ? new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Orders</h1>
        <p className="page-subtitle">Manage and update status of all customer orders</p>
      </div>

      {/* Stats */}
      <div className="orders-stats">
        <div className="stat-box">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{orders.filter(o => o.status === 'Order Placed').length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">In Transit</p>
          <p className="stat-value">{orders.filter(o => ['Shipped', 'Out for Delivery'].includes(o.status)).length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Delivered</p>
          <p className="stat-value">{orders.filter(o => o.status === 'Delivered').length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <IoSearchOutline className="search-icon" size={18} />
          <input type="text" placeholder="Search by Order ID..."
            value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)} className="filter-select">
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn--ghost" onClick={fetchOrders} title="Refresh">
          <IoRefreshOutline size={17} />
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-container">
          <table className="orders-table">
            <thead className="table-head">
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr><td colSpan={7} className="table-empty">Loading orders...</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">No orders found.</td></tr>
              ) : visible.map(order => (
                <tr key={order._id} className="table-row">
                  <td className="table-cell table-cell--id">
                    #{order._id?.slice(-8).toUpperCase()}
                  </td>
                  <td className="table-cell">{order.items?.length || 0} items</td>
                  <td className="table-cell table-cell--amount">{fmt(order.amount)}</td>
                  <td className="table-cell">
                    <span className={`payment-badge payment-badge--${order.paymentMethod === 'COD' ? 'cod' : 'online'}`}>
                      {order.paymentMethod || 'COD'}
                    </span>
                  </td>
                  <td className="table-cell table-cell--date">{fmtDate(order.date)}</td>
                  <td className="table-cell">
                    <span className={`status-badge status-badge--${STATUS_COLOR[order.status] || 'orange'}`}>
                      {order.status || 'Order Placed'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="status-update-wrap">
                      <select
                        className={`status-select status-select--${STATUS_COLOR[order.status] || 'orange'}`}
                        value={order.status || 'Order Placed'}
                        onChange={e => updateStatus(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {saved === order._id && (
                        <span className="status-saved">
                          <IoCheckmarkCircleOutline size={13} /> Updated
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <div className="pagination-info">Showing {visible.length} of {orders.length} orders</div>
      </div>
    </div>
  )
}
