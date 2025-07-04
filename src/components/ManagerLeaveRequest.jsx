import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

function ManagerLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Kullanıcı bilgisi
  const user = JSON.parse(localStorage.getItem('user'));

  // İzin türü karşılıkları
  const requestTypeMap = {
    1: 'Yıllık İzin',
    2: 'Mazeret İzni',
    3: 'Babalık İzni',
    4: 'Evlilik İzni',
    5: 'Ölüm İzni',
    6: 'Doğum İzni'
  };

  // İzin taleplerini çek
  useEffect(() => {
    if (!user?.id) return; // user id yoksa çık
    axios.get(`http://localhost:5293/api/LeaveRequestByManagerId/LeaveRequestByManagerId/${user.id}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error('İzinler alınamadı:', err));
  }, [user]);

  // Tarih formatla
  const formatDate = (str) => new Date(str).toLocaleDateString();

  // Onayla butonuna tıklandığında
  const handleApprove = async (id) => {
    console.log('Onaylanan id:', id);  // <- Burada idyi gör
    try {
      await axios.put('http://localhost:5293/api/UpdateLeaveRequest', {
        id: id,
        status: 'Müdür Onayladı',
        rejectionReason: ''
      });
      alert('Talep onaylandı.');
      // Listeyi yenilemek için tekrar izinleri çek
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Onaylama hatası:', err);
      alert('Onaylama sırasında hata oluştu.');
    }
  };

  // Reddet butonuna tıklandığında popup aç
  const handleReject = (id) => {
    setSelectedId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Reddet popup'ında gönder tuşuna tıklandığında
  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Lütfen reddetme nedenini girin.');
      return;
    }
    try {
      await axios.put('http://localhost:5293/api/UpdateRejectLeaveRequest/UpdateRejectLeaveRequest', {
        id: selectedId,
        status: 'Reddedildi',
        rejectionReason: rejectionReason
      });
      alert('Talep reddedildi.');
      setShowRejectModal(false);
      // Listeyi yenilemek için reddedilen talebi listeden çıkar
      setRequests(prev => prev.filter(r => r.id !== selectedId));
      setSelectedId(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Reddetme hatası:', err);
      alert('Reddetme sırasında hata oluştu.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: GRAY,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '32px 0',
    }}>
      <div style={{
        background: WHITE,
        borderRadius: 16,
        boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 1100,
        color: TEXT,
      }}>
        <h2 style={{ color: ORANGE_DARK, marginBottom: 18, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>Çalışan İzin Talepleri</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'none',
          }}>
            <thead>
              <tr style={{ background: ORANGE + '11' }}>
                <th style={thStyle}>Çalışan</th>
                <th style={thStyle}>İzin Türü</th>
                <th style={thStyle}>Başlangıç</th>
                <th style={thStyle}>Bitiş</th>
                <th style={thStyle}>Durum</th>
                <th style={thStyle}>Reddetme Nedeni</th>
                <th style={thStyle}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: ORANGE_DARK }}>Bekleyen izin talebi yok</td></tr>
              ) : (
                paginatedRequests.map((r) => (
                  <tr key={r.id} style={{ background: r.id % 2 === 0 ? GRAY : WHITE }}>
                    <td style={tdStyle}>{r.employeeName}</td>
                    <td style={tdStyle}>{requestTypeMap[r.type] || r.type}</td>
                    <td style={tdStyle}>{formatDate(r.startDate)}</td>
                    <td style={tdStyle}>{formatDate(r.endDate)}</td>
                    <td style={tdStyle}>{r.status}</td>
                    <td style={tdStyle}>{r.rejectionReason || '-'}</td>
                    <td style={tdStyle}>
                      {r.status === 'Beklemede' && (
                        <>
                          <button style={approveBtnStyle} onClick={() => handleApprove(r.id)}>Onayla</button>
                          <button style={rejectBtnStyle} onClick={() => handleReject(r.id)}>Reddet</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
        {showRejectModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ backgroundColor: WHITE, padding: 28, borderRadius: 14, width: 400, color: TEXT, boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)' }}>
              <h3 style={{ color: ORANGE_DARK, marginBottom: 12 }}>Red Nedeni</h3>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Reddetme nedenini yazınız..."
                style={{ width: '100%', background: GRAY, color: TEXT, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 10 }}
              />
              <div style={{ marginTop: 10, textAlign: 'right' }}>
                <button style={sendBtnStyle} onClick={confirmRejection}>Gönder</button>
                <button style={cancelBtnStyle} onClick={() => setShowRejectModal(false)}>İptal</button>
              </div>
            </div>
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
const approveBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  marginRight: 5,
  boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
  transition: 'background 0.2s',
};
const rejectBtnStyle = {
  background: ORANGE_DARK,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  marginLeft: 5,
  boxShadow: '0 2px 8px 0 ' + ORANGE_DARK + '22',
  transition: 'background 0.2s',
};
const sendBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  marginRight: 5,
  boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
  transition: 'background 0.2s',
};
const cancelBtnStyle = {
  background: BORDER,
  color: TEXT,
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  marginLeft: 5,
  boxShadow: '0 2px 8px 0 ' + BORDER + '22',
  transition: 'background 0.2s',
};

export default ManagerLeaveRequests;
