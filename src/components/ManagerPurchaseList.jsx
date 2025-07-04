import React, { useEffect, useState } from 'react';
import axios from 'axios';

const URGENCY_MAP = {
  1: 'Çok Düşük',
  2: 'Düşük',
  3: 'Orta',
  4: 'Yüksek',
  5: 'Çok Yüksek',
};

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

const ManagerPurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectingIdx, setRejectingIdx] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Manager id'sini localStorage'dan al
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }
  const managerId = user?.id;

  useEffect(() => {
    if (!managerId) {
      setError('Kullanıcı bilgisi bulunamadı.');
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5293/api/Purchase/GetPurchaseByManagerId?managerId=${managerId}`)
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Veriler alınamadı.');
        setLoading(false);
      });
  }, [managerId]);

  const handleApprove = async (idx) => {
    const purchase = purchases[idx];
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdateApprovedPurchase', {
        id: purchase.id,
        statues: 'Onaylandı',
      });
      setPurchases((prev) => prev.filter((_, i) => i !== idx));
    } catch (e) {
      alert('Onaylama işlemi başarısız.');
    }
  };

  const handleReject = async (idx) => {
    if (!rejectionReason) {
      alert('Lütfen reddetme sebebini giriniz.');
      return;
    }
    const purchase = purchases[idx];
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdateRejectPurchase', {
        id: purchase.id,
        statues: 'Reddedildi',
        rejectionReason,
      });
      setPurchases((prev) => prev.filter((_, i) => i !== idx));
      setRejectingIdx(null);
      setRejectionReason('');
    } catch (e) {
      alert('Reddetme işlemi başarısız.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ background: GRAY, borderRadius: 12, padding: 32, boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)', marginTop: 32 }}>
      <h2 style={{ color: ORANGE_DARK, textAlign: 'center', marginBottom: 32, fontWeight: 700, letterSpacing: 1 }}>Satın Alma Talepleri (Yönetici)</h2>
      {purchases.length === 0 ? (
        <div style={{ color: ORANGE_DARK, textAlign: 'center', fontSize: 18 }}>Onay bekleyen satın alma talebi yok.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: WHITE, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px 0 ' + ORANGE + '22' }}>
          <thead>
            <tr style={{ background: ORANGE + '11' }}>
              <th style={thStyle}>Talep Nedeni</th>
              <th style={thStyle}>Ürünler</th>
              <th style={thStyle}>Durum</th>
              <th style={thStyle}>Öncelik</th>
              <th style={thStyle}>Talep Eden</th>
              <th style={thStyle}>Tarih</th>
              <th style={thStyle}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? GRAY : WHITE, transition: 'background 0.2s' }}>
                <td style={tdStyle}>{p.reason}</td>
                <td style={tdStyle}>
                  <table style={{ width: '100%', background: 'none', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, fontSize: 13 }}>Ürün</th>
                        <th style={{ ...thStyle, fontSize: 13 }}>Adet</th>
                        <th style={{ ...thStyle, fontSize: 13 }}>Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(p.items || []).map((item, i) => (
                        <tr key={i}>
                          <td style={{ ...tdStyle, fontSize: 14 }}>{item.productName}</td>
                          <td style={{ ...tdStyle, fontSize: 14 }}>{item.quantity}</td>
                          <td style={{ ...tdStyle, fontSize: 14 }}>{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span>{p.status}</span>
                    {p.status === 'Müdür Reddetti' && p.rejectionReason && (
                      <span style={{ color: ORANGE_DARK, fontSize: 13, fontWeight: 500 }}>
                        Reddetme Nedeni: {p.rejectionReason}
                      </span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>{URGENCY_MAP[p.urgencyLevel] || p.urgencyLevel}</td>
                <td style={tdStyle}>{p.username}</td>
                <td style={tdStyle}>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  {p.status === 'Talep Alındı' ? (
                    <>
                      <button style={approveBtnStyle} onClick={() => handleApprove(idx)}>Onayla</button>
                      <button style={rejectBtnStyle} onClick={() => setRejectingIdx(idx)}>Reddet</button>
                      {rejectingIdx === idx && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="text"
                            placeholder="Reddetme sebebi"
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            style={inputStyle}
                          />
                          <button style={sendBtnStyle} onClick={() => handleReject(idx)}>Gönder</button>
                          <button style={cancelBtnStyle} onClick={() => { setRejectingIdx(null); setRejectionReason(''); }}>İptal</button>
                        </div>
                      )}
                    </>
                  ) : p.status === 'Müdür Onayladı' ? (
                    <span style={{ color: ORANGE, fontWeight: 600 }}>Onaylandı</span>
                  ) : p.status === 'Müdür Reddetti' ? (
                    <span style={{ color: ORANGE_DARK, fontWeight: 600 }}>Reddedildi</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  color: ORANGE_DARK,
  fontWeight: 700,
  fontSize: 15,
  padding: '12px 10px',
  background: ORANGE + '11',
  border: 'none',
  textAlign: 'left',
  borderBottom: '2px solid ' + BORDER,
};

const tdStyle = {
  color: TEXT,
  fontSize: 15,
  padding: '10px 10px',
  border: 'none',
  verticalAlign: 'middle',
  borderBottom: '1px solid ' + BORDER,
};

const approveBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '6px 16px',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  marginRight: 8,
  transition: 'background 0.2s',
};

const rejectBtnStyle = {
  background: ORANGE_DARK,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '6px 16px',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const sendBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '6px 12px',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const cancelBtnStyle = {
  background: BORDER,
  color: TEXT,
  border: 'none',
  borderRadius: 8,
  padding: '6px 12px',
  fontWeight: 500,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const inputStyle = {
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid ' + ORANGE,
  fontSize: 14,
  outline: 'none',
  minWidth: 180,
  background: GRAY,
  color: TEXT,
};

export default ManagerPurchaseList;
