import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ORANGE = '#ff9100';
const ORANGE_DARK = '#ff6d00';
const WHITE = '#fff';
const GRAY = '#fff7ed';
const BORDER = '#ffe0b2';
const TEXT = '#ff6d00';

function UpdatePurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('http://localhost:5293/api/PurchaseItems', { params: { id } })
      .then(res => {
        setItems(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Ürünler alınamadı.');
        setLoading(false);
      });
  }, [id]);

  const handleItemChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleItemAdd = () => {
    setItems(items => [
      ...items,
      { id: '', productName: '', quantity: 1, description: '' }
    ]);
  };

  const handleItemRemove = (idx) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdatePurchase', {
        id,
        items: items.map(({ id, productName, quantity, description }) => {
          const item = { productName, quantity: Number(quantity), description };
          item.id = id || "string";
          return item;
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error(err);
      setError('Güncelleme başarısız.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: ORANGE_DARK }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif', padding: '32px 0' }}>
      <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 ' + ORANGE + '22', padding: '2.5rem 2rem', width: '100%', maxWidth: 600, color: TEXT }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Satın Alma Talebini Güncelle</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 15 }}>Ürünler</label>
            {items.map((item, idx) => (
              <div key={item.id || idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input
                  value={item.productName}
                  onChange={e => handleItemChange(idx, 'productName', e.target.value)}
                  required
                  placeholder="Ürün Adı"
                  style={{ flex: 2, padding: '8px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT }}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                  required
                  placeholder="Adet"
                  style={{ width: 80, padding: '8px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT }}
                />
                <input
                  value={item.description}
                  onChange={e => handleItemChange(idx, 'description', e.target.value)}
                  placeholder="Açıklama"
                  style={{ flex: 3, padding: '8px', border: '1.5px solid ' + BORDER, borderRadius: 8, fontSize: 15, background: GRAY, color: TEXT }}
                />
                <button type="button" onClick={() => handleItemRemove(idx)} style={{ background: ORANGE_DARK, color: WHITE, border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginLeft: 4 }}>
                  Sil
                </button>
              </div>
            ))}
            <button type="button" onClick={handleItemAdd} style={{ background: ORANGE, color: WHITE, border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4, width: '100%' }}>
              Ürün Ekle
            </button>
          </div>
          <button type="submit" disabled={loading} style={{ background: ORANGE, color: WHITE, border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
          {error && <div style={{ color: ORANGE_DARK, marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: ORANGE_DARK, marginTop: 8 }}>Başarıyla güncellendi!</div>}
        </form>
      </div>
    </div>
  );
}

export default UpdatePurchase; 