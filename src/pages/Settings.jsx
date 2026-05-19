import { useEffect, useState } from 'react'
import {
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoTwitter,
  IoSaveOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5'
import api from '../utils/api'
import '../styles/Form.css'
import '../styles/Settings.css'

const initialForm = {
  storeName: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  phonePrimary: '',
  phoneSecondary: '',
  whatsapp: '',
  email: '',
  instagram: '',
  facebook: '',
  youtube: '',
  twitter: '',
  mapEmbedUrl: '',
  consultantName: '',
  consultantTitle: '',
}

export default function Settings() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/api/settings')
        setForm({ ...initialForm, ...(data || {}) })
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      const { data } = await api.put('/api/settings', form)
      setForm({ ...initialForm, ...(data.settings || {}) })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Loading store settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Store Settings</h1>
        <p className="page-subtitle">Update contact details, social links and store information shown on the frontend.</p>
      </div>

      {saved && (
        <div className="success-message">
          <IoCheckmarkCircleOutline size={20} />
          Settings updated successfully.
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <form className="product-form settings-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <div className="form-section-head">
            <span className="form-section-num">01</span>
            <h2 className="form-section-title">Store Details</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input className="form-input" name="storeName" value={form.storeName} onChange={handleChange} placeholder="EyeMax Eyecare" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="settings-input-icon">
                <IoMailOutline size={17} />
                <input className="form-input settings-input-with-icon" name="email" value={form.email} onChange={handleChange} placeholder="store@email.com" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Footer Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Short store description" />
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <span className="form-section-num">02</span>
            <h2 className="form-section-title">Contact Information</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Phone</label>
              <div className="settings-input-icon">
                <IoCallOutline size={17} />
                <input className="form-input settings-input-with-icon" name="phonePrimary" value={form.phonePrimary} onChange={handleChange} placeholder="8787241227" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Phone</label>
              <input className="form-input" name="phoneSecondary" value={form.phoneSecondary} onChange={handleChange} placeholder="7905492433" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input className="form-input" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="918787241227" />
              <p className="form-hint-inline">Use country code, for example 91XXXXXXXXXX.</p>
            </div>
            <div className="form-group">
              <label className="form-label">Consultant Name</label>
              <input className="form-input" name="consultantName" value={form.consultantName} onChange={handleChange} placeholder="Dr. Manish Kumar" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Address Line 1</label>
              <div className="settings-input-icon">
                <IoLocationOutline size={17} />
                <input className="form-input settings-input-with-icon" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Belthra Marg, Near Power House" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address Line 2</label>
              <input className="form-input" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Nagra - Ballia" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Consultant Title</label>
            <input className="form-input" name="consultantTitle" value={form.consultantTitle} onChange={handleChange} placeholder="(B.OPTM) MAKAUT WEST BENGAL" />
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <span className="form-section-num">03</span>
            <h2 className="form-section-title">Social Links & Map</h2>
          </div>

          <div className="form-row">
            <SocialField icon={<IoLogoInstagram size={17} />} label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} />
            <SocialField icon={<IoLogoFacebook size={17} />} label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} />
          </div>
          <div className="form-row">
            <SocialField icon={<IoLogoYoutube size={17} />} label="Youtube URL" name="youtube" value={form.youtube} onChange={handleChange} />
            <SocialField icon={<IoLogoTwitter size={17} />} label="Twitter URL" name="twitter" value={form.twitter} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Google Map Embed URL</label>
            <textarea className="form-textarea settings-map-textarea" name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="Paste Google Maps embed src URL here" />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? <span className="btn-spinner" /> : <IoSaveOutline size={17} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SocialField({ icon, label, name, value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="settings-input-icon">
        {icon}
        <input className="form-input settings-input-with-icon" name={name} value={value} onChange={onChange} placeholder="https://..." />
      </div>
    </div>
  )
}
