import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ORANGE = '#ff9100';
const ORANGE_DARK = '#ff6d00';
const WHITE = '#fff';
const GRAY = '#fff7ed';
const BORDER = '#ffe0b2';
const TEXT = '#ff6d00';

function AddOffer() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5293/api/Purchase/CreatePurchaseOffer', {
        purchaseRequestId: purchaseId,
        companyName: form.companyName,
        amount: Number(form.amount),
        description: form.description,
      });
      setSuccess(true);
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError('Teklif eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif', padding: '32px 0' }}>
      <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 ' + ORANGE + '22', padding: '2.5rem 2rem', width: '100%', maxWidth: 420, color: TEXT }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Teklif Ekle</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 15 }}>Firma Adı</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT, marginTop: 4 }}
            />
          </div>
          <div>
            <label style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 15 }}>Teklif Tutarı</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT, marginTop: 4 }}
            />
          </div>
          <div>
            <label style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 15 }}>Açıklama</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '10px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT, marginTop: 4 }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ background: ORANGE, color: WHITE, border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Kaydediliyor...' : 'Teklif Ekle'}
          </button>
          {error && <div style={{ color: ORANGE_DARK, marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: ORANGE_DARK, marginTop: 8 }}>Teklif başarıyla eklendi!</div>}
        </form>
      </div>
    </div>
  );
}

export default AddOffer; 