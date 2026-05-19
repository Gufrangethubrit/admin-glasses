import { useState, useEffect } from 'react'
import {
  IoSearchOutline, IoAddOutline, IoTrashOutline, IoPencilOutline,
  IoCloseOutline, IoCheckmarkCircle, IoEyeOutline,
  IoAlertCircleOutline, IoImageOutline, IoRefreshOutline,
} from 'react-icons/io5'
import api from '../utils/api'
import '../styles/ProductsList.css'

const CATEGORIES = ['Sunglasses', 'Eyeglasses']
const GENDERS    = ['Men', 'Women', 'Kids']
const SIZES      = ['Small', 'Medium', 'Large']
const BADGES     = ['None', 'New', 'Sale', 'Best Seller', 'Limited Edition']

export default function Lists() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')
  const [editProduct, setEdit]  = useState(null)
  const [viewProduct, setView]  = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [deleting, setDeleting] = useState(false)

  /* ── Fetch products ── */
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/product/list-products')
      setProducts(data)
    } catch (err) {
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  /* ── Filter ── */
  const visible = products.filter(p => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p._id?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'All' ||
      (filter === 'Active'        && p.isActive) ||
      (filter === 'Inactive'      && !p.isActive) ||
      (filter === 'Out of Stock'  && !p.inStock)
    return matchSearch && matchFilter
  })

  /* ── Edit helpers ── */
  const setField  = (key, val) => setEdit(p => ({ ...p, [key]: val }))
  const toggleArr = (key, val) => setEdit(p => ({
    ...p,
    [key]: (p[key] || []).includes(val)
      ? p[key].filter(v => v !== val)
      : [...(p[key] || []), val],
  }))

  const saveEdit = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',        editProduct.name        || '')
      fd.append('brand',       editProduct.brand       || '')
      fd.append('description', editProduct.description || '')
      fd.append('category',    editProduct.category    || '')
      fd.append('price',       String(editProduct.price))
      fd.append('oldPrice',    editProduct.oldPrice ? String(editProduct.oldPrice) : '')
      fd.append('badge',       editProduct.badge       || 'None')
      fd.append('bestseller',  String(editProduct.bestseller || false))
      fd.append('isActive',    String(editProduct.isActive !== false))
      fd.append('inStock',     String(editProduct.inStock  !== false))
      fd.append('gender',      JSON.stringify(editProduct.gender  || []))
      fd.append('sizes',       JSON.stringify(editProduct.sizes   || []))

      await api.put(`/api/product/update-product/${editProduct._id}`, fd)

      setSaved(true)
      fetchProducts()
      setTimeout(() => { setSaved(false); setEdit(null) }, 1200)
    } catch (err) {
      console.error('Update error:', err)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/api/product/list-products/${deleteId}`)
      setProducts(prev => prev.filter(p => p._id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleting(false)
    }
  }

  const discount = editProduct?.price && editProduct?.oldPrice
    ? Math.round((1 - editProduct.price / editProduct.oldPrice) * 100)
    : 0

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Products List</h1>
        <p className="page-subtitle">Manage your product inventory</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <IoSearchOutline className="search-icon" size={18} />
          <input type="text" placeholder="Search by name or brand..."
            value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
          {['All', 'Active', 'Inactive', 'Out of Stock'].map(f => <option key={f}>{f}</option>)}
        </select>
        <button className="btn btn--ghost" onClick={fetchProducts} title="Refresh">
          <IoRefreshOutline size={17} />
        </button>
        <a href="/admin/add" className="btn btn--primary">
          <IoAddOutline size={17} /> Add Product
        </a>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-container">
          <table className="products-table">
            <thead className="table-head">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr><td colSpan={6} className="table-empty">Loading products...</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">No products found.</td></tr>
              ) : visible.map(p => (
                <tr key={p._id} className="table-row">
                  <td className="table-cell table-cell--name">
                    <div className="product-thumb">
                      {p.image1
                        ? <img src={p.image1} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                        : <IoImageOutline size={18} />
                      }
                    </div>
                    <div>
                      <p className="product-name">{p.name}</p>
                      <p className="product-brand">{p.brand || '—'}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="cat-badge">{p.category}</span>
                  </td>
                  <td className="table-cell table-cell--price">
                    <span className="price-current">₹{Number(p.price).toLocaleString()}</span>
                    {p.oldPrice && <span className="price-old">₹{Number(p.oldPrice).toLocaleString()}</span>}
                  </td>
                  <td className="table-cell">
                    <span className={`stock-badge ${!p.inStock ? 'stock-badge--low' : 'stock-badge--ok'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge status-badge--${p.isActive ? 'active' : 'inactive'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell table-cell--actions">
                    <button className="action-icon action-icon--view" title="View" onClick={() => setView(p)}>
                      <IoEyeOutline size={16} />
                    </button>
                    <button className="action-icon action-icon--edit" title="Edit" onClick={() => setEdit({ ...p })}>
                      <IoPencilOutline size={16} />
                    </button>
                    <button className="action-icon action-icon--delete" title="Delete" onClick={() => setDeleteId(p._id)}>
                      <IoTrashOutline size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <div className="pagination-info">Showing {visible.length} of {products.length} products</div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div className="modal-overlay" onClick={() => setEdit(null)}>
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Edit Product</h2>
                <p className="modal-sub">{editProduct.name}</p>
              </div>
              <button className="modal-close" onClick={() => setEdit(null)}><IoCloseOutline size={22} /></button>
            </div>
            <div className="modal-body">

              <div className="modal-section">
                <h3 className="modal-section-title">Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-input" value={editProduct.name || ''}
                      onChange={e => setField('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input type="text" className="form-input" value={editProduct.brand || ''}
                      onChange={e => setField('brand', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} value={editProduct.description || ''}
                    onChange={e => setField('description', e.target.value)} />
                </div>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">Category & Variants</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <div className="chip-group">
                      {CATEGORIES.map(c => (
                        <button type="button" key={c}
                          className={`chip ${editProduct.category === c ? 'chip--active' : ''}`}
                          onClick={() => setField('category', c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <div className="chip-group">
                      {GENDERS.map(g => (
                        <button type="button" key={g}
                          className={`chip ${(editProduct.gender || []).includes(g) ? 'chip--active' : ''}`}
                          onClick={() => toggleArr('gender', g)}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sizes</label>
                  <div className="chip-group">
                    {SIZES.map(s => (
                      <button type="button" key={s}
                        className={`chip ${(editProduct.sizes || []).includes(s) ? 'chip--active' : ''}`}
                        onClick={() => toggleArr('sizes', s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">Pricing</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹)</label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix">₹</span>
                      <input type="number" className="form-input form-input--prefix"
                        value={editProduct.price || ''} onChange={e => setField('price', Number(e.target.value))} min="0" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original MRP (₹)</label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix">₹</span>
                      <input type="number" className="form-input form-input--prefix"
                        value={editProduct.oldPrice || ''} onChange={e => setField('oldPrice', e.target.value ? Number(e.target.value) : null)} min="0" />
                    </div>
                  </div>
                </div>
                {discount > 0 && (
                  <div className="discount-preview">
                    <span className="discount-badge">−{discount}% OFF</span>
                    <span className="discount-text">Customer saves ₹{editProduct.oldPrice - editProduct.price}</span>
                  </div>
                )}
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">Badge & Status</h3>
                <div className="form-group">
                  <label className="form-label">Badge</label>
                  <select className="form-select" value={editProduct.badge || 'None'}
                    onChange={e => setField('badge', e.target.value)}>
                    {BADGES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="toggle-group">
                  {[
                    { key: 'bestseller', label: 'Featured / Best Seller', desc: 'Show on homepage' },
                    { key: 'isActive',   label: 'Active / Published',     desc: 'Visible to customers' },
                    { key: 'inStock',    label: 'In Stock',               desc: 'Available for purchase' },
                  ].map(t => (
                    <label key={t.key} className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">{t.label}</span>
                        <span className="toggle-desc">{t.desc}</span>
                      </div>
                      <div className={`toggle-switch ${editProduct[t.key] ? 'toggle-switch--on' : ''}`}
                        onClick={() => setField(t.key, !editProduct[t.key])}>
                        <div className="toggle-thumb" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn btn--primary" onClick={saveEdit} disabled={saving}>
                {saved
                  ? <><IoCheckmarkCircle size={16} /> Saved!</>
                  : saving
                    ? 'Saving...'
                    : <><IoCheckmarkCircle size={16} /> Save Changes</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewProduct && (
        <div className="modal-overlay" onClick={() => setView(null)}>
          <div className="modal modal--md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{viewProduct.name}</h2>
                <p className="modal-sub">{viewProduct.brand}</p>
              </div>
              <button className="modal-close" onClick={() => setView(null)}><IoCloseOutline size={22} /></button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-img-placeholder">
                  {viewProduct.image1
                    ? <img src={viewProduct.image1} alt={viewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    : <><IoImageOutline size={40} /><span>No Image</span></>
                  }
                </div>
                <div className="view-details">
                  <div className="view-row"><span className="view-key">Category</span><span className="view-val">{viewProduct.category}</span></div>
                  <div className="view-row"><span className="view-key">Gender</span><span className="view-val">{(viewProduct.gender || []).join(', ') || '—'}</span></div>
                  <div className="view-row"><span className="view-key">Sizes</span><span className="view-val">{(viewProduct.sizes || []).join(', ') || '—'}</span></div>
                  <div className="view-row"><span className="view-key">Price</span>
                    <span className="view-val view-val--price">
                      ₹{Number(viewProduct.price).toLocaleString()}
                      {viewProduct.oldPrice && <s className="view-old">₹{Number(viewProduct.oldPrice).toLocaleString()}</s>}
                    </span>
                  </div>
                  <div className="view-row"><span className="view-key">Badge</span><span className="view-val">{viewProduct.badge || 'None'}</span></div>
                  <div className="view-row"><span className="view-key">Status</span>
                    <span className={`status-badge status-badge--${viewProduct.isActive ? 'active' : 'inactive'}`}>
                      {viewProduct.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              {viewProduct.description && (
                <div className="view-desc">
                  <p className="view-key">Description</p>
                  <p className="view-desc-text">{viewProduct.description}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setView(null)}>Close</button>
              <button className="btn btn--primary" onClick={() => { setView(null); setEdit({ ...viewProduct }) }}>
                <IoPencilOutline size={15} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Product</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)}><IoCloseOutline size={22} /></button>
            </div>
            <div className="modal-body modal-body--center">
              <div className="delete-icon"><IoAlertCircleOutline size={40} /></div>
              <p className="delete-msg">This action cannot be undone. The product will be permanently removed.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={confirmDelete} disabled={deleting}>
                <IoTrashOutline size={15} /> {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
