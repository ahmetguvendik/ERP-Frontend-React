import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ORANGE = '#ff9100';
const ORANGE_DARK = '#ff6d00';
const WHITE = '#fff';
const GRAY = '#fff7ed';
const BORDER = '#ffe0b2';
const TEXT = '#ff6d00';

function ManagerApprovedPurchaseList({ userInfo }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const paginatedPurchases = purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [openDetail, setOpenDetail] = useState(null);
  const [offers, setOffers] = useState({});
  const [offersLoading, setOffersLoading] = useState({});
  const [offersError, setOffersError] = useState({});

  useEffect(() => {
    if (!userInfo?.id) return;
    setLoading(true);
    axios.get('http://localhost:5293/api/Purchase/GetPurchaseByApprovedManager')
      .then(res => {
        setPurchases(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Veriler alınamadı.');
        setLoading(false);
      });
  }, [userInfo?.id]);

  const handleBackToManager = async (id) => {
    try {
      await axios.put('http://localhost:5293/api/Purchase/UpdateBackToManagerPurchase', { id });
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Talep müdüre geri gönderilemedi.');
    }
  };

  const handleOpenDetail = (purchaseId) => {
    if (openDetail === purchaseId) {
      setOpenDetail(null);
      return;
    }
    setOpenDetail(purchaseId);
  };

  useEffect(() => {
    if (openDetail) {
      setOffersLoading((prev) => ({ ...prev, [openDetail]: true }));
      setOffersError((prev) => ({ ...prev, [openDetail]: null }));
      axios.get(`http://localhost:5293/api/PurchaseOffer`, { params: { id: openDetail } })
        .then(res => {
          setOffers((prev) => ({ ...prev, [openDetail]: res.data }));
          setOffersLoading((prev) => ({ ...prev, [openDetail]: false }));
        })
        .catch(() => {
          setOffersError((prev) => ({ ...prev, [openDetail]: 'Teklifler alınamadı.' }));
          setOffersLoading((prev) => ({ ...prev, [openDetail]: false }));
        });
    }
  }, [openDetail]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif', padding: '32px 0' }}>
      <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 ' + ORANGE + '22', padding: '2.5rem 2rem', width: '100%', maxWidth: 1100, color: TEXT }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Müdür Onaylı Satın Alma Talepleri</h2>
        {purchases.length === 0 ? (
          <p style={{ color: ORANGE_DARK, textAlign: 'center' }}>Onaylanmış talep yok.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse', background: 'none' }}>
                <thead>
                  <tr style={{ background: ORANGE + '11' }}>
                    <th style={thStyle}>Talep Nedeni</th>
                    <th style={thStyle}>Talep Eden</th>
                    <th style={thStyle}>Müdür</th>
                    <th style={thStyle}>Tarih</th>
                    <th style={thStyle}>Durum</th>
                    <th style={thStyle}>Ürünler</th>
                    <th style={thStyle}>Teklif</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPurchases.map((purchase, index) => (
                    <React.Fragment key={purchase.id || index}>
                      <tr style={{ background: index % 2 === 0 ? GRAY : WHITE }}>
                        <td style={tdStyle}>{purchase.reason}</td>
                        <td style={tdStyle}>{purchase.username}</td>
                        <td style={tdStyle}>{purchase.managerName}</td>
                        <td style={tdStyle}>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>{purchase.status}</td>
                        <td style={tdStyle}>
                          <button
                            style={{
                              background: ORANGE,
                              color: WHITE,
                              border: 'none',
                              borderRadius: 8,
                              padding: '6px 14px',
                              fontWeight: 600,
                              fontSize: 15,
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                            onClick={() => handleOpenDetail(purchase.id)}
                          >{openDetail === purchase.id ? 'Kapat' : 'Detay'}</button>
                        </td>
                        <td style={tdStyle}>
                          <a href={`/add-offer/${purchase.id}`} style={{
                            background: ORANGE,
                            color: WHITE,
                            borderRadius: 8,
                            padding: '6px 18px',
                            fontWeight: 600,
                            fontSize: 15,
                            textDecoration: 'none',
                            boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
                            transition: 'background 0.2s',
                          }}>Teklif Gir</a>
                          <button
                            style={{
                              background: WHITE,
                              color: ORANGE_DARK,
                              border: '1.5px solid ' + ORANGE,
                              borderRadius: 8,
                              padding: '6px 14px',
                              fontWeight: 600,
                              fontSize: 15,
                              marginLeft: 8,
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              boxShadow: '0 2px 8px 0 ' + ORANGE + '11',
                            }}
                            onClick={() => handleBackToManager(purchase.id)}
                          >Müdüre Geri Gönder</button>
                        </td>
                      </tr>
                      {openDetail === purchase.id && (
                        <tr>
                          <td colSpan={7} style={{ background: GRAY, padding: 0 }}>
                            <div style={{ padding: '18px 24px' }}>
                              <h4 style={{ color: ORANGE_DARK, marginBottom: 10, fontWeight: 600 }}>Ürünler</h4>
                              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none' }}>
                                <thead>
                                  <tr>
                                    <th style={miniThStyle}>Ürün</th>
                                    <th style={miniThStyle}>Adet</th>
                                    <th style={miniThStyle}>Açıklama</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(purchase.items || []).map((item, i) => (
                                    <tr key={i}>
                                      <td style={miniTdStyle}>{item.productName}</td>
                                      <td style={miniTdStyle}>{item.quantity}</td>
                                      <td style={miniTdStyle}>{item.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <h4 style={{ color: ORANGE_DARK, margin: '18px 0 10px 0', fontWeight: 600 }}>Teklifler</h4>
                              {offersLoading[purchase.id] ? (
                                <div>Teklifler yükleniyor...</div>
                              ) : offersError[purchase.id] ? (
                                <div style={{ color: ORANGE_DARK }}>{offersError[purchase.id]}</div>
                              ) : (offers[purchase.id] && offers[purchase.id].length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none', marginTop: 8 }}>
                                  <thead>
                                    <tr>
                                      <th style={miniThStyle}>Firma</th>
                                      <th style={miniThStyle}>Tutar</th>
                                      <th style={miniThStyle}>Açıklama</th>
                                      <th style={miniThStyle}>Tarih</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {offers[purchase.id].map((offer, idx) => (
                                      <tr key={idx}>
                                        <td style={miniTdStyle}>{offer.companyName}</td>
                                        <td style={miniTdStyle}>{offer.amount}</td>
                                        <td style={miniTdStyle}>{offer.description}</td>
                                        <td style={miniTdStyle}>{new Date(offer.createdAt).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div style={{ color: ORANGE_DARK }}>Teklif yok.</div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 12 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: WHITE,
                    color: currentPage === 1 ? '#ffcc80' : ORANGE_DARK,
                    border: '1.5px solid ' + ORANGE,
                    borderRadius: 8,
                    padding: '7px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px 0 ' + ORANGE + '11',
                    transition: 'background 0.2s',
                    opacity: currentPage === 1 ? 0.6 : 1,
                  }}
                >Önceki</button>
                <span style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 16 }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    background: WHITE,
                    color: currentPage === totalPages ? '#ffcc80' : ORANGE_DARK,
                    border: '1.5px solid ' + ORANGE,
                    borderRadius: 8,
                    padding: '7px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px 0 ' + ORANGE + '11',
                    transition: 'background 0.2s',
                    opacity: currentPage === totalPages ? 0.6 : 1,
                  }}
                >Sonraki</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  color: ORANGE_DARK,
  padding: '10px 6px',
  fontWeight: 700,
  borderBottom: '2px solid ' + BORDER,
  fontSize: 16,
  background: ORANGE + '11',
};
const tdStyle = {
  color: TEXT,
  padding: '8px 6px',
  borderBottom: '1px solid ' + BORDER,
  fontSize: 15,
};
const miniThStyle = {
  color: ORANGE_DARK,
  fontWeight: 600,
  fontSize: 15,
  padding: '8px 6px',
  borderBottom: '1px solid ' + BORDER,
  textAlign: 'left',
  background: ORANGE + '11',
};
const miniTdStyle = {
  color: TEXT,
  fontSize: 15,
  padding: '7px 6px',
  borderBottom: '1px solid ' + BORDER,
};

export default ManagerApprovedPurchaseList; 