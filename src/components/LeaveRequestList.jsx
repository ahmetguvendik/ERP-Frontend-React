import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

function LeaveRequestList() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.id) return;

    axios.get(`http://localhost:5293/api/LeaveRequestByEmployeeId?employeeId=${user.id}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error('İzinler alınırken hata:', err));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const requestTypeMap = {
    1: 'Yıllık İzin',
    2: 'Mazeret İzni',
    3: 'Babalık İzni',
    4: 'Evlilik İzni',
    5: 'Ölüm İzni',
    6: 'Doğum İzni'
  };

  return (
    <div style={{ minHeight: '100vh', background: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif', padding: '32px 0' }}>
      <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)', padding: '2.5rem 2rem', width: '100%', maxWidth: 900, color: TEXT }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Başvurduğum İzinler</h2>
        {requests.length === 0 ? (
          <p style={{ color: ORANGE_DARK, textAlign: 'center' }}>Henüz bir izin talebiniz yok.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse', background: 'none' }}>
                <thead>
                  <tr style={{ background: ORANGE + '11' }}>
                    <th style={thStyle}>İzin Türü</th>
                    <th style={thStyle}>Başlangıç</th>
                    <th style={thStyle}>Bitiş</th>
                    <th style={thStyle}>Yönetici</th>
                    <th style={thStyle}>Durum</th>
                    <th style={thStyle}>Red Nedeni</th>
                    <th style={thStyle}>Talep Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? GRAY : WHITE }}>
                      <td style={tdStyle}>{requestTypeMap[r.type] || 'Bilinmeyen İzin'}</td>
                      <td style={tdStyle}>{formatDate(r.startDate)}</td>
                      <td style={tdStyle}>{formatDate(r.endDate)}</td>
                      <td style={tdStyle}>{r.managerName}</td>
                      <td style={tdStyle}>{r.status}</td>
                      <td style={tdStyle}>{r.rejectionReason || '-'}</td>
                      <td style={tdStyle}>{formatDate(r.createdAt)}</td>
                    </tr>
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

export default LeaveRequestList;
