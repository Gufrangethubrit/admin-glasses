import React from 'react'
import { IoTrendingUpOutline, IoBarChartOutline, IoPieChartOutline, IoCalendarOutline } from 'react-icons/io5'
import '../styles/Analytics.css'

export default function Analytics() {
  const chartData = [
    { month: 'Jan', revenue: 4000, orders: 240 },
    { month: 'Feb', revenue: 3000, orders: 221 },
    { month: 'Mar', revenue: 2000, orders: 229 },
    { month: 'Apr', revenue: 2780, orders: 200 },
    { month: 'May', revenue: 1890, orders: 229 },
    { month: 'Jun', revenue: 2390, orders: 200 },
  ]

  const topProducts = [
    { id: 1, name: 'Premium Aviator', sales: 450, revenue: '₹45,000' },
    { id: 2, name: 'Classic Wayfarer', sales: 380, revenue: '₹38,000' },
    { id: 3, name: 'Cat Eye Fashion', sales: 320, revenue: '₹32,000' },
    { id: 4, name: 'Retro Round', sales: 290, revenue: '₹29,000' },
  ]

  const metrics = [
    { label: 'Total Revenue', value: '₹15,67,89,023', icon: IoTrendingUpOutline, change: '+15.3%' },
    { label: 'Total Orders', value: '2,456', icon: IoBarChartOutline, change: '+8.2%' },
    { label: 'Avg Order Value', value: '₹4,502', icon: IoPieChartOutline, change: '+5.1%' },
    { label: 'Conversion Rate', value: '3.24%', icon: IoTrendingUpOutline, change: '+2.4%' },
  ]

  return (
    <div className='page-container'>
      <div className='page-header'>
        <h1 className='page-title'>Analytics</h1>
        <p className='page-subtitle'>Business performance and insights</p>
      </div>

      {/* Date Range Selector */}
      <div className='analytics-controls'>
        <button className='date-btn date-btn--active'>Last 7 days</button>
        <button className='date-btn'>Last 30 days</button>
        <button className='date-btn'>This Year</button>
      </div>

      {/* Metrics Cards */}
      <div className='metrics-grid'>
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className='metric-card'>
              <div className='metric-card__header'>
                <Icon className='metric-icon' size={24} />
                <span className='metric-change'>{metric.change}</span>
              </div>
              <p className='metric-label'>{metric.label}</p>
              <p className='metric-value'>{metric.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className='charts-grid'>
        <div className='chart-card'>
          <h3 className='chart-title'>Revenue Trend</h3>
          <div className='chart-placeholder'>
            <div className='chart-bars'>
              {chartData.map((data, idx) => (
                <div key={idx} className='chart-bar'>
                  <div 
                    className='bar' 
                    style={{ height: `${(data.revenue / 5000) * 100}%` }}
                  ></div>
                  <span className='bar-label'>{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='chart-card'>
          <h3 className='chart-title'>Orders Trend</h3>
          <div className='chart-placeholder'>
            <div className='chart-bars'>
              {chartData.map((data, idx) => (
                <div key={idx} className='chart-bar'>
                  <div 
                    className='bar' 
                    style={{ height: `${(data.orders / 300) * 100}%` }}
                  ></div>
                  <span className='bar-label'>{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className='dashboard-section'>
        <h2 className='section-title'>Top Products</h2>
        <div className='table-container'>
          <table className='analytics-table'>
            <thead className='table-head'>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody className='table-body'>
              {topProducts.map((product, idx) => (
                <tr key={product.id} className='table-row'>
                  <td className='table-cell'>
                    <span className='rank-badge'>#{idx + 1}</span>
                  </td>
                  <td className='table-cell'>{product.name}</td>
                  <td className='table-cell'>{product.sales} units</td>
                  <td className='table-cell table-cell--amount'>{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className='insights-section'>
        <h2 className='section-title'>Key Insights</h2>
        <div className='insights-grid'>
          <div className='insight-card'>
            <h4 className='insight-title'>📈 Revenue Growth</h4>
            <p className='insight-text'>Revenue increased by 15.3% compared to last period.</p>
          </div>
          <div className='insight-card'>
            <h4 className='insight-title'>🛒 Top Performer</h4>
            <p className='insight-text'>Premium Aviator is your top product with 450 sales.</p>
          </div>
          <div className='insight-card'>
            <h4 className='insight-title'>👥 Customer Base</h4>
            <p className='insight-text'>Acquired 234 new customers this month. Retention: 92%</p>
          </div>
          <div className='insight-card'>
            <h4 className='insight-title'>⏰ Peak Hours</h4>
            <p className='insight-text'>Most orders occur 6-9 PM. Run promotions then.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
