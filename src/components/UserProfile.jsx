import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.id) return;

    axios.get(`http://localhost:5293/api/GetUserById?userId=${user.id}`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error('Kullanıcı bilgisi alınamadı:', err));
  }, [user]);

  if (!userInfo) return <p style={{ color: 'var(--color-orange-dark)', textAlign: 'center', marginTop: 40 }}>Yükleniyor...</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <div style={{
        background: 'var(--color-white)',
        borderRadius: 24,
        boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)',
        maxWidth: 420,
        width: '100%',
        padding: 0,
        overflow: 'hidden',
        fontFamily: 'Inter, Arial, sans-serif',
      }}>
        {/* Üst kısım: Avatar ve ana bilgiler */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-orange), var(--color-orange-dark))',
          padding: '36px 0 24px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img
            src={userInfo.avatarUrl || '/default-avatar.png'}
            alt={userInfo.firstName + ' ' + userInfo.lastName}
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--color-white)',
              boxShadow: '0 2px 16px 0 rgba(255,127,26,0.10)',
              marginBottom: 16,
              background: '#fff',
            }}
            onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
          />
          <h2 style={{ color: 'var(--color-white)', fontWeight: 700, fontSize: 26, margin: 0 }}>{userInfo.firstName} {userInfo.lastName}</h2>
          <div style={{ color: 'var(--color-white)', fontSize: 16, fontWeight: 500, marginTop: 4 }}>{userInfo.jobTitle}</div>
          <div style={{ color: userInfo.isActive ? 'var(--color-orange)' : '#ff003c', fontWeight: 600, fontSize: 15, marginTop: 6 }}>
            {userInfo.isActive ? 'Aktif' : 'Pasif'}
          </div>
          <button
            style={{
              marginTop: 18,
              background: 'var(--color-orange-dark)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(255,127,26,0.10)',
              transition: 'background 0.2s',
            }}
            onClick={() => window.alert('İletişim butonuna tıklandı!')}
          >
            İletişim Kur
          </button>
        </div>
        {/* Alt kısım: Diğer bilgiler */}
        <div style={{
          padding: '28px 28px 18px 28px',
          color: 'var(--color-text)',
          fontSize: 15,
        }}>
          <div style={{ marginBottom: 10 }}><strong>Kullanıcı Adı:</strong> {userInfo.userName}</div>
          <div style={{ marginBottom: 10 }}><strong>Bölüm:</strong> {userInfo.departmanName}</div>
          <div style={{ marginBottom: 10 }}><strong>İş Türü:</strong> {userInfo.jobTypeName}</div>
          <div style={{ marginBottom: 10 }}><strong>Başlangıç Tarihi:</strong> {new Date(userInfo.startingJob).toLocaleDateString()}</div>
          <div style={{ marginBottom: 10 }}><strong>Telefon:</strong> {userInfo.phoneNumber}</div>
          <div style={{ marginBottom: 10 }}><strong>Doğum Tarihi:</strong> {new Date(userInfo.birthDate).toLocaleDateString()}</div>
          <div style={{ marginBottom: 10 }}><strong>Cinsiyet:</strong> {userInfo.gender === 1 ? 'Erkek' : 'Kadın'}</div>
          <div style={{ marginBottom: 10 }}><strong>TC No:</strong> {userInfo.tcNo}</div>
          <div style={{ marginBottom: 10 }}><strong>Sicil No:</strong> {userInfo.sicilNo}</div>
          <div style={{ marginBottom: 10 }}><strong>Brüt Maaş:</strong> {userInfo.brutSalary.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <div style={{ marginBottom: 10 }}><strong>Net Maaş:</strong> {userInfo.netSalary.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
          <div style={{ marginBottom: 10 }}><strong>IBAN:</strong> {userInfo.iban}</div>
          <div style={{ marginBottom: 10 }}><strong>Prim:</strong> {userInfo.prim}</div>
          <div style={{ marginBottom: 10 }}><strong>Disruptions:</strong> {userInfo.disruptions}</div>
          <div style={{ marginBottom: 10 }}><strong>Yönetici:</strong> {userInfo.managerName}</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
