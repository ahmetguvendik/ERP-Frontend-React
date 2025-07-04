import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ORANGE = '#ff7f1a';
const ORANGE_DARK = '#ff6600';
const WHITE = '#fff';
const GRAY = '#f8f9fa';
const BORDER = '#ffd9b3';
const TEXT = '#222';

function PurchaseList({ reload }) {
  const [purchases, setPurchases] = useState([]);
  const [openDetail, setOpenDetail] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      console.warn('Kullanıcı bilgisi bulunamadı.');
      return;
    }

    axios.get(`http://localhost:5293/api/Purchase?userId=${user.id}`)
      .then(res => setPurchases(res.data))
      .catch(err => console.error('Talep listesi alınırken hata oluştu:', err));
  }, [reload]);

  return (
    <div style={{
      minHeight: '100vh',
      background: ORANGE + '08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '32px 0',
    }}>
      <div style={{
        background: WHITE,
        borderRadius: 16,
        boxShadow: '0 4px 32px 0 ' + ORANGE + '22',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 900,
        color: TEXT,
      }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Satın Alma Talepleri</h2>
        {purchases.length === 0 ? (
          <p style={{ color: ORANGE_DARK, textAlign: 'center' }}>Henüz talep yok.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              marginTop: '10px',
              borderCollapse: 'collapse',
              background: 'none',
            }}>
              <thead>
                <tr style={{ background: ORANGE + '11' }}>
                  <th style={thStyle}>Talep Nedeni</th>
                  <th style={thStyle}>Tarih</th>
                  <th style={thStyle}>Durum</th>
                  <th style={thStyle}>Detay</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <React.Fragment key={purchase.id || index}>
                    <tr style={{ background: index % 2 === 0 ? GRAY : WHITE }}>
                      <td style={tdStyle}>{purchase.reason}</td>
                      <td style={tdStyle}>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                      <td style={tdStyle}>{purchase.status || purchase.statues}</td>
                      <td style={tdStyle}>
                        <button
                          style={detailBtnStyle}
                          onClick={() => setOpenDetail(openDetail === purchase.id ? null : purchase.id)}
                        >
                          {openDetail === purchase.id ? 'Kapat' : 'Detay'}
                        </button>
                      </td>
                    </tr>
                    {openDetail === purchase.id && (
                      <tr>
                        <td colSpan={4} style={{ background: GRAY, padding: 0 }}>
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
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
const detailBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '6px 18px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  transition: 'background 0.2s',
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

export default PurchaseList;
