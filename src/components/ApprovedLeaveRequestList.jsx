import React, { useEffect, useState } from 'react';

const LEAVE_TYPE_MAP = {
  1: 'Yıllık İzin',
  2: 'Mazeret İzni',
  3: 'Sağlık İzni',
  4: 'Doğum İzni',
  5: 'Babalık İzni',
  6: 'Ücretsiz İzin',
  // Diğer tipler eklenebilir
};

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

const ApprovedLeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);
  const paginatedRequests = leaveRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    fetch('http://localhost:5293/api/LeaveRequestByApproved/LeaveRequestByApproved')
      .then((res) => res.json())
      .then((data) => {
        setLeaveRequests(data.filter(lr => lr.status === 'Müdür Onayladı'));
        setLoading(false);
      })
      .catch((err) => {
        setError('Veriler alınamadı.');
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch('http://localhost:5293/api/UpdateHrLeaveRequest/UpdateHrLeaveRequest', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'HR Onayladı' }),
      });
      setLeaveRequests((prev) => prev.filter((lr) => lr.id !== id));
    } catch (e) {
      alert('Onaylama işlemi başarısız.');
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason) {
      alert('Lütfen reddetme sebebini giriniz.');
      return;
    }
    try {
      await fetch('http://localhost:5293/api/UpdateHrRejectLeaveRequest/UpdateHrRejectLeaveRequest', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'HR Reddetti', rejectionReason }),
      });
      setLeaveRequests((prev) => prev.filter((lr) => lr.id !== id));
      setRejectingId(null);
      setRejectionReason('');
    } catch (e) {
      alert('Reddetme işlemi başarısız.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif', padding: '32px 0' }}>
      <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)', padding: '2.5rem 2rem', width: '100%', maxWidth: 900, color: TEXT }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Onay Bekleyen İzinler</h2>
        {leaveRequests.length === 0 ? (
          <p style={{ color: ORANGE_DARK, textAlign: 'center' }}>Onay bekleyen izin yok.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse', background: 'none' }}>
                <thead>
                  <tr style={{ background: ORANGE + '11' }}>
                    <th style={thStyle}>Çalışan</th>
                    <th style={thStyle}>Yönetici</th>
                    <th style={thStyle}>Başlangıç</th>
                    <th style={thStyle}>Bitiş</th>
                    <th style={thStyle}>Tip</th>
                    <th style={thStyle}>Durum</th>
                    <th style={thStyle}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((lr, idx) => (
                    <tr key={lr.id} style={{ background: idx % 2 === 0 ? GRAY : WHITE }}>
                      <td style={tdStyle}>{lr.employeeName}</td>
                      <td style={tdStyle}>{lr.managerName}</td>
                      <td style={tdStyle}>{new Date(lr.startDate).toLocaleDateString()}</td>
                      <td style={tdStyle}>{new Date(lr.endDate).toLocaleDateString()}</td>
                      <td style={tdStyle}>{LEAVE_TYPE_MAP[lr.type] || lr.type}</td>
                      <td style={tdStyle}>{lr.status}</td>
                      <td style={tdStyle}>
                        <button style={approveBtnStyle} onClick={() => handleApprove(lr.id)}>Onayla</button>
                        <button style={rejectBtnStyle} onClick={() => setRejectingId(lr.id)}>Reddet</button>
                        {rejectingId === lr.id && (
                          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                              type="text"
                              placeholder="Reddetme sebebi"
                              value={rejectionReason}
                              onChange={e => setRejectionReason(e.target.value)}
                              style={inputStyle}
                            />
                            <button style={sendBtnStyle} onClick={() => handleReject(lr.id)}>Gönder</button>
                            <button style={cancelBtnStyle} onClick={() => { setRejectingId(null); setRejectionReason(''); }}>İptal</button>
                          </div>
                        )}
                      </td>
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
};

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

const approveBtnStyle = {
  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
  color: '#232946',
  border: 'none',
  borderRadius: 8,
  padding: '6px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  marginRight: 8,
  transition: 'background 0.2s',
};

const rejectBtnStyle = {
  background: 'linear-gradient(90deg, #ff003c 0%, #232946 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '6px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const sendBtnStyle = {
  background: 'var(--accent)',
  color: 'var(--accent-foreground)',
  border: 'none',
  borderRadius: 8,
  padding: '6px 12px',
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const cancelBtnStyle = {
  background: 'var(--border)',
  color: 'var(--foreground)',
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
  border: '1px solid var(--accent)',
  fontSize: 14,
  outline: 'none',
  minWidth: 180,
  background: 'var(--input)',
  color: 'var(--foreground)',
};

export default ApprovedLeaveRequestList;
