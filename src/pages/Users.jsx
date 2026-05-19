import React, { useState } from 'react'
import { IoSearchOutline, IoAddOutline, IoTrashOutline, IoPencilOutline, IoCloseOutline } from 'react-icons/io5'
import '../styles/Users.css'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const users = [
    { id: '#U001', name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joinDate: '15 Mar, 2026' },
    { id: '#U002', name: 'Jane Smith', email: 'jane@example.com', role: 'Premium', status: 'Active', joinDate: '20 Feb, 2026' },
    { id: '#U003', name: 'Bob Johnson', email: 'bob@example.com', role: 'Customer', status: 'Active', joinDate: '01 Jan, 2026' },
    { id: '#U004', name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '10 Dec, 2025' },
    { id: '#U005', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Customer', status: 'Inactive', joinDate: '05 Nov, 2025' },
  ]

  return (
    <div className='page-container'>
      <div className='page-header'>
        <h1 className='page-title'>Users Management</h1>
        <p className='page-subtitle'>Manage user accounts and permissions</p>
      </div>

      {/* Toolbar */}
      <div className='toolbar'>
        <div className='search-box'>
          <IoSearchOutline className='search-icon' size={18} />
          <input
            type='text'
            placeholder='Search users...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className='filter-select'
        >
          <option value='all'>All Roles</option>
          <option value='admin'>Admin</option>
          <option value='premium'>Premium</option>
          <option value='customer'>Customer</option>
        </select>
        <button className='btn btn--primary'>
          <IoAddOutline size={18} /> Add User
        </button>
      </div>

      {/* Users Stats */}
      <div className='users-stats'>
        <div className='stat-box'>
          <p className='stat-label'>Total Users</p>
          <p className='stat-value'>8,954</p>
        </div>
        <div className='stat-box'>
          <p className='stat-label'>Active</p>
          <p className='stat-value'>7,832</p>
        </div>
        <div className='stat-box'>
          <p className='stat-label'>Premium</p>
          <p className='stat-value'>1,456</p>
        </div>
        <div className='stat-box'>
          <p className='stat-label'>New This Month</p>
          <p className='stat-value'>234</p>
        </div>
      </div>

      {/* Users Table */}
      <div className='table-wrapper'>
        <div className='table-container'>
          <table className='users-table'>
            <thead className='table-head'>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='table-body'>
              {users.map((user) => (
                <tr key={user.id} className='table-row'>
                  <td className='table-cell table-cell--id'>{user.id}</td>
                  <td className='table-cell table-cell--name'>
                    <div className='user-avatar'>{user.name.charAt(0)}</div>
                    {user.name}
                  </td>
                  <td className='table-cell'>{user.email}</td>
                  <td className='table-cell'>
                    <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='table-cell'>
                    <span className={`status-badge status-badge--${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className='table-cell table-cell--date'>{user.joinDate}</td>
                  <td className='table-cell table-cell--actions'>
                    <button className='action-icon' title='Edit'>
                      <IoPencilOutline size={18} />
                    </button>
                    <button className='action-icon' title='Block/Unblock'>
                      <IoCloseOutline size={18} />
                    </button>
                    <button className='action-icon action-icon--delete' title='Delete'>
                      <IoTrashOutline size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className='pagination'>
        <button className='pagination-btn'>← Previous</button>
        <div className='pagination-info'>Page 1 of 45 (Total: 8,954 users)</div>
        <button className='pagination-btn'>Next →</button>
      </div>
    </div>
  )
}
