import { useEffect, useState } from 'react'
import api from '../utils/api'

const emptyStats = {
  totalRevenue: 0,
  productCount: 0,
  activeProductCount: 0,
  inactiveProductCount: 0,
  orderCount: 0,
  pendingOrderCount: 0,
  deliveredOrderCount: 0,
  todayOrderCount: 0,
  todayRevenue: 0,
  userCount: 0,
  recentOrders: [],
}

export default function useDashboardStats() {
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = async () => {
    setError('')
    try {
      const { data } = await api.get('/api/admin/dashboard')
      setStats({ ...emptyStats, ...(data || {}) })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refreshStats: fetchStats }
}
