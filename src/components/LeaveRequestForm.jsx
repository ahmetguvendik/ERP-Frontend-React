import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

function LeaveRequestForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [quotas, setQuotas] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    requestType: '',
  });

  const [dayCount, setDayCount] = useState(0);

  // İzin türü karşılıkları
  const requestTypeMap = {
    1: 'Yıllık İzin',
    2: 'Mazeret İzni',
    3: 'Babalık İzni',
    4: 'Evlilik İzni',
    5: 'Ölüm İzni',
    6: 'Doğum İzni'
  };

  // İzin kotalarını getir
  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5293/api/LeaveQuota?id=${user.id}`)
        .then(res => setQuotas(res.data))
        .catch(err => console.error('Kotalar alınamadı', err));
    }
  }, [user]);

  // Gün farkı hesapla
  useEffect(() => {
    const { startDate, endDate } = formData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setDayCount(diff > 0 ? diff : 0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedQuota = quotas.find(q => q.requestType === parseInt(formData.requestType));

    if (!selectedQuota) {
      alert('Seçilen izin türü için kota bulunamadı.');
      return;
    }

    const remainingDays = selectedQuota.allowedDays - selectedQuota.usedDays;
    if (dayCount > remainingDays) {
      alert(`Yetersiz izin hakkı. Kalan gün: ${remainingDays}`);
      return;
    }

    try {
      await axios.post('http://localhost:5293/api/LeaveRequest', {
        employeeId: user.id,
        managerId: user.managerId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        requestType: parseInt(formData.requestType),
        status: "Pending",
        rejectionReason: "",
        createdAt: new Date().toISOString()
      });

      alert("İzin talebi gönderildi.");
      setFormData({ startDate: '', endDate: '', requestType: '' });
    } catch (error) {
      console.error('İzin talebi gönderilirken hata:', error);
      alert("Hata oluştu.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-gray)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: WHITE,
          borderRadius: 16,
          boxShadow: '0 4px 32px 0 ' + 'rgba(255,127,26,0.13)',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          color: TEXT,
          border: '1.5px solid ' + BORDER,
        }}
      >
        <h2 style={{ color: ORANGE_DARK, textAlign: 'center', marginBottom: 8, fontWeight: 700, letterSpacing: 1 }}>
          İzin Talebi Oluştur
        </h2>
        <label style={{ color: ORANGE_DARK, fontSize: 15, fontWeight: 600 }}>Başlangıç Tarihi:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          style={{
            background: GRAY,
            color: TEXT,
            border: '1.5px solid ' + BORDER,
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 15,
            outline: 'none',
            transition: 'border 0.2s',
            marginBottom: 2,
          }}
          onFocus={e => e.target.style.border = '1.5px solid ' + ORANGE}
          onBlur={e => e.target.style.border = '1.5px solid ' + BORDER}
        />
        <label style={{ color: ORANGE_DARK, fontSize: 15, fontWeight: 600 }}>Bitiş Tarihi:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          style={{
            background: GRAY,
            color: TEXT,
            border: '1.5px solid ' + BORDER,
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 15,
            outline: 'none',
            transition: 'border 0.2s',
            marginBottom: 2,
          }}
          onFocus={e => e.target.style.border = '1.5px solid ' + ORANGE}
          onBlur={e => e.target.style.border = '1.5px solid ' + BORDER}
        />
        <label style={{ color: ORANGE_DARK, fontSize: 15, fontWeight: 600 }}>İzin Türü:</label>
        <select
          name="requestType"
          value={formData.requestType}
          onChange={handleChange}
          required
          style={{
            background: GRAY,
            color: TEXT,
            border: '1.5px solid ' + BORDER,
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 15,
            outline: 'none',
            transition: 'border 0.2s',
            marginBottom: 2,
          }}
          onFocus={e => e.target.style.border = '1.5px solid ' + ORANGE}
          onBlur={e => e.target.style.border = '1.5px solid ' + BORDER}
        >
          <option value="">-- Seçiniz --</option>
          {quotas.map(q => (
            <option key={q.requestType} value={q.requestType}>
              {(requestTypeMap[q.requestType] || 'Bilinmeyen İzin')} - Kalan Gün: {q.allowedDays - q.usedDays}
            </option>
          ))}
        </select>
        <p style={{ color: ORANGE_DARK, fontSize: 15, fontWeight: 500 }}>Toplam Gün: <span style={{ color: TEXT, fontWeight: 700 }}>{dayCount}</span></p>
        <button
          type="submit"
          style={{
            background: ORANGE,
            color: WHITE,
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 1,
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

export default LeaveRequestForm;
