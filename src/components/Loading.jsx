import React from 'react'
import '../styles/Loading.css'

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h2 className="loading-text">Loading...</h2>
        <p className="loading-subtext">Please wait while we fetch your data</p>
      </div>
    </div>
  )
}
