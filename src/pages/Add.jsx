import { useState, useRef } from 'react'
import {
  IoCheckmarkCircle, IoCloseOutline, IoCloudUploadOutline,
  IoImageOutline, IoToggleOutline,
} from 'react-icons/io5'
import api from '../utils/api'
import '../styles/Form.css'

const CATEGORIES = ['Sunglasses', 'Eyeglasses']
const GENDERS    = ['Men', 'Women', 'Kids']
const SIZES      = ['Small', 'Medium', 'Large']
const BADGES     = ['None', 'New', 'Sale', 'Best Seller', 'Limited Edition']

const INIT = {
  name: '', brand: '', description: '',
  category: '', gender: [], sizes: [],
  price: '', oldPrice: '',
  badge: 'None', bestseller: false, isActive: true,
  images: [],
}

export default function Add() {
  const [form, setForm]         = useState(INIT)
  const [previews, setPreviews] = useState([])
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef()

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const toggleArr = (key, val) => setForm(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
  }))

  const handleImages = e => {
    const files = Array.from(e.target.files).slice(0, 4 - form.images.length)
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))])
    setForm(p => ({ ...p, images: [...p.images, ...files] }))
  }

  const removeImage = i => {
    setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))
    setPreviews(p => p.filter((_, j) => j !== i))
  }

  const discount = form.price && form.oldPrice
    ? Math.round((1 - Number(form.price) / Number(form.oldPrice)) * 100)
    : 0

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!form.images.length) {
      setError('Please upload at least one product image.')
      return
    }
    if (!form.category) {
      setError('Please select a category.')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name',        form.name)
      fd.append('brand',       form.brand)
      fd.append('description', form.description)
      fd.append('category',    form.category)
      fd.append('price',       form.price)
      fd.append('oldPrice',    form.oldPrice || '')
      fd.append('badge',       form.badge)
      fd.append('bestseller',  String(form.bestseller))
      fd.append('isActive',    String(form.isActive))
      fd.append('inStock',     'true')
      fd.append('gender',      JSON.stringify(form.gender))
      fd.append('sizes',       JSON.stringify(form.sizes))
      fd.append('colors',      JSON.stringify([]))
      fd.append('features',    JSON.stringify([]))
      fd.append('specs',       JSON.stringify([]))
      fd.append('date',        String(Date.now()))

      form.images.forEach((img, i) => fd.append(`image${i + 1}`, img))

      await api.post('/api/product/add-product', fd)

      setSuccess(true)
      setForm(INIT)
      setPreviews([])
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Fill in the details to list a new eyewear product</p>
      </div>

      {success && (
        <div className="success-message">
          <IoCheckmarkCircle size={20} />
          <span>Product added successfully!</span>
        </div>
      )}
      {error && (
        <div className="error-message">
          <IoCloseOutline size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">

        {/* ── Basic Info ── */}
        <div className="form-section">
          <h2 className="form-section-title">Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name <span className="req">*</span></label>
              <input type="text" className="form-input" placeholder="e.g., Classic Aviator Pro"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input type="text" className="form-input" placeholder="e.g., GlassesStore"
                value={form.brand} onChange={e => set('brand', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description <span className="req">*</span></label>
            <textarea className="form-textarea" rows={3}
              placeholder="Describe the product — material, style, use case..."
              value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>
        </div>

        {/* ── Category & Gender ── */}
        <div className="form-section">
          <h2 className="form-section-title">Category</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category <span className="req">*</span></label>
              <div className="chip-group">
                {CATEGORIES.map(c => (
                  <button type="button" key={c}
                    className={`chip ${form.category === c ? 'chip--active' : ''}`}
                    onClick={() => set('category', c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="chip-group">
                {GENDERS.map(g => (
                  <button type="button" key={g}
                    className={`chip ${form.gender.includes(g) ? 'chip--active' : ''}`}
                    onClick={() => toggleArr('gender', g)}>{g}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div className="chip-group">
              {SIZES.map(s => (
                <button type="button" key={s}
                  className={`chip ${form.sizes.includes(s) ? 'chip--active' : ''}`}
                  onClick={() => toggleArr('sizes', s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="form-section">
          <h2 className="form-section-title">Pricing</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Selling Price (₹) <span className="req">*</span></label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">₹</span>
                <input type="number" className="form-input form-input--prefix" placeholder="1299"
                  value={form.price} onChange={e => set('price', e.target.value)} min="0" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Original MRP (₹) <span className="form-hint-inline">for strikethrough</span></label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">₹</span>
                <input type="number" className="form-input form-input--prefix" placeholder="1799"
                  value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} min="0" />
              </div>
            </div>
          </div>
          {discount > 0 && (
            <div className="discount-preview">
              <span className="discount-badge">−{discount}% OFF</span>
              <span className="discount-text">Customer saves ₹{Number(form.oldPrice) - Number(form.price)}</span>
            </div>
          )}
        </div>

        {/* ── Badge & Status ── */}
        <div className="form-section">
          <h2 className="form-section-title">Badge & Visibility</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Badge</label>
              <select className="form-select" value={form.badge} onChange={e => set('badge', e.target.value)}>
                {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="toggle-group">
            <label className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Featured / Best Seller</span>
                <span className="toggle-desc">Show in Best Sellers section on homepage</span>
              </div>
              <div className={`toggle-switch ${form.bestseller ? 'toggle-switch--on' : ''}`}
                onClick={() => set('bestseller', !form.bestseller)}>
                <div className="toggle-thumb" />
              </div>
            </label>
            <label className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-label">Active / Published</span>
                <span className="toggle-desc">Visible to customers on the website</span>
              </div>
              <div className={`toggle-switch ${form.isActive ? 'toggle-switch--on' : ''}`}
                onClick={() => set('isActive', !form.isActive)}>
                <div className="toggle-thumb" />
              </div>
            </label>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="form-section">
          <h2 className="form-section-title">
            Product Images <span className="form-hint-inline">(max 4, first is main)</span>
          </h2>
          <div className="image-grid">
            {previews.map((src, i) => (
              <div key={i} className="image-preview">
                <img src={src} alt={`Preview ${i + 1}`} />
                <button type="button" className="image-remove" onClick={() => removeImage(i)}>
                  <IoCloseOutline size={14} />
                </button>
                {i === 0 && <span className="image-main-badge">Main</span>}
              </div>
            ))}
            {previews.length < 4 && (
              <div className="image-upload-slot" onClick={() => fileRef.current.click()}>
                <IoImageOutline size={28} />
                <span>Click to upload</span>
                <span className="upload-sub">PNG, JPG up to 5MB</span>
                <input ref={fileRef} type="file" accept="image/*" multiple
                  style={{ display: 'none' }} onChange={handleImages} />
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="form-actions">
          <button type="button" className="btn btn--secondary"
            onClick={() => { setForm(INIT); setPreviews([]); setError('') }}>
            Reset
          </button>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading
              ? <><span className="btn-spinner" /> Uploading...</>
              : <><IoCheckmarkCircle size={17} /> Add Product</>
            }
          </button>
        </div>

      </form>
    </div>
  )
}
