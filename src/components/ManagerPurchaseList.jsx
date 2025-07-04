import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const URGENCY_MAP = {
  1: 'Çok Düşük',
  2: 'Düşük',
  3: 'Orta',
  4: 'Yüksek',
  5: 'Çok Yüksek',
};

const ManagerPurchaseList = ({ userInfo }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectingIdx, setRejectingIdx] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const paginatedPurchases = purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [detailIdx, setDetailIdx] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Manager id'sini localStorage'dan al
  const managerId = user?.id;

  // Login/logout sonrası user'ı güncelle
  useEffect(() => {
    const onStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
    const purchase = purchases[(currentPage - 1) * itemsPerPage + idx];
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdateApprovedPurchase', {
        id: purchase.id,
        statues: 'Onaylandı',
      });
      setPurchases((prev) => prev.filter((_, i) => i !== (currentPage - 1) * itemsPerPage + idx));
    } catch (e) {
      alert('Onaylama işlemi başarısız.');
    }
  };

  const handleReject = async (idx) => {
    if (!rejectionReason) {
      alert('Lütfen reddetme sebebini giriniz.');
      return;
    }
    const purchase = purchases[(currentPage - 1) * itemsPerPage + idx];
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdateRejectPurchase', {
        id: purchase.id,
        statues: 'Reddedildi',
        rejectionReason,
      });
      setPurchases((prev) => prev.filter((_, i) => i !== (currentPage - 1) * itemsPerPage + idx));
      setRejectingIdx(null);
      setRejectionReason('');
    } catch (e) {
      alert('Reddetme işlemi başarısız.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '32px 0 0 0',
      display: 'block',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(255,145,0,0.10)',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 1100,
        color: '#ff6d00',
        margin: '0 auto',
        marginTop: 0,
      }}>
        <h2 style={{ color: '#ff9100', marginBottom: 18, fontWeight: 700, letterSpacing: 1 }}>Satın Alma Talepleri (Yönetici)</h2>
        {purchases.length === 0 ? (
          <div style={{ color: '#ff9100', textAlign: 'center', fontSize: 18 }}>Onay bekleyen satın alma talebi yok.</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none' }}>
              <thead>
                <tr style={{ background: '#ff9100' }}>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>Talep Nedeni</th>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>Durum</th>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>Öncelik</th>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>Talep Eden</th>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>Tarih</th>
                  <th style={{ color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 10px', borderBottom: '2px solid #ff6d00', textAlign: 'left' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPurchases.map((p, idx) => (
                  <tr key={p.id} style={{ background: idx % 2 === 0 ? '#fff7ed' : '#fff', transition: 'background 0.2s' }}>
                    {/* Talep Nedeni */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>{p.reason}</td>
                    {/* Durum */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>{p.status || p.statues}</td>
                    {/* Öncelik */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>{URGENCY_MAP[p.urgencyLevel] || p.urgencyLevel}</td>
                    {/* Talep Eden */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>{p.username}</td>
                    {/* Tarih */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    {/* İşlem */}
                    <td style={{ color: '#ff6d00', fontSize: 15, padding: '10px 10px', borderBottom: '1px solid #ffe0b2', verticalAlign: 'top' }}>
                      <button style={{
                        background: 'linear-gradient(90deg, #fff7ed 0%, #ff9100 100%)',
                        color: '#ff6d00',
                        border: '1.5px solid #ff9100',
                        borderRadius: 8,
                        padding: '6px 16px',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginRight: 8,
                        transition: 'background 0.2s',
                        boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                      }} onClick={() => setDetailIdx(idx)}>Detay</button>
                      {p.status === 'Talep Alındı' || p.statues === 'Talep Alındı' ? (
                        <>
                          <button style={{
                            background: 'linear-gradient(90deg, #ff9100 0%, #ff6d00 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 16px',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            marginRight: 8,
                            transition: 'background 0.2s',
                            boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                          }} onClick={() => handleApprove(idx)}>Onayla</button>
                          <button style={{
                            background: 'linear-gradient(90deg, #ff6d00 0%, #ff9100 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 16px',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                          }} onClick={() => setRejectingIdx(idx)}>Reddet</button>
                          {rejectingIdx === idx && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type="text"
                                placeholder="Reddetme sebebi"
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  border: '1.5px solid #ff9100',
                                  fontSize: 14,
                                  outline: 'none',
                                  minWidth: 180,
                                  background: '#fff7ed',
                                  color: '#ff6d00',
                                }}
                              />
                              <button style={{
                                background: 'linear-gradient(90deg, #ff6d00 0%, #ff9100 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '6px 12px',
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                              }} onClick={() => handleReject(idx)}>Gönder</button>
                              <button style={{
                                background: '#fff',
                                color: '#ff9100',
                                border: '1.5px solid #ff9100',
                                borderRadius: 8,
                                padding: '6px 12px',
                                fontWeight: 500,
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                              }} onClick={() => { setRejectingIdx(null); setRejectionReason(''); }}>İptal</button>
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#ff9100', fontWeight: 600 }}>
                          {p.status === 'Müdür Onayladı' || p.statues === 'Müdür Onayladı' ? 'Onaylandı' :
                            p.status === 'Müdür Reddetti' || p.statues === 'Müdür Reddetti' ? (p.rejectionReason ? `Reddedildi: ${p.rejectionReason}` : 'Reddedildi') : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 12 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: '#fff',
                    color: currentPage === 1 ? '#ffcc80' : '#ff9100',
                    border: '1.5px solid #ff9100',
                    borderRadius: 8,
                    padding: '7px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px 0 rgba(255,145,0,0.07)',
                    transition: 'background 0.2s',
                    opacity: currentPage === 1 ? 0.6 : 1,
                  }}
                >Önceki</button>
                <span style={{ color: '#ff9100', fontWeight: 600, fontSize: 16 }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    background: '#fff',
                    color: currentPage === totalPages ? '#ffcc80' : '#ff9100',
                    border: '1.5px solid #ff9100',
                    borderRadius: 8,
                    padding: '7px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px 0 rgba(255,145,0,0.07)',
                    transition: 'background 0.2s',
                    opacity: currentPage === totalPages ? 0.6 : 1,
                  }}
                >Sonraki</button>
              </div>
            )}
            {/* Detay Modal */}
            {detailIdx !== null && paginatedPurchases[detailIdx] && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(255,145,0,0.15)', display: 'flex',
                justifyContent: 'center', alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{ backgroundColor: '#fff', padding: 32, borderRadius: 16, width: 420, color: '#ff6d00', boxShadow: '0 4px 24px 0 rgba(255,145,0,0.15)', position: 'relative' }}>
                  <h3 style={{ color: '#ff9100', marginBottom: 18 }}>Ürünler ve Açıklamaları</h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {paginatedPurchases[detailIdx].items && paginatedPurchases[detailIdx].items.length > 0 ? (
                      paginatedPurchases[detailIdx].items.map((item, i) => (
                        <li key={i} style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: '#fff7ed', color: '#ff6d00', boxShadow: '0 1px 4px 0 rgba(255,145,0,0.07)' }}>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{item.productName} <span style={{ color: '#ff9100', fontWeight: 400 }}>x{item.quantity}</span></div>
                          <div style={{ fontSize: 15, marginTop: 4 }}>{item.description}</div>
                        </li>
                      ))
                    ) : (
                      <li>Ürün bulunamadı.</li>
                    )}
                  </ul>
                  <button style={{
                    background: '#fff',
                    color: '#ff9100',
                    border: '1.5px solid #ff9100',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    marginTop: 18,
                    boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
                  }} onClick={() => setDetailIdx(null)}>Kapat</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerPurchaseList;
