import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dummy veriler (gerekirse API'den çekilecek şekilde güncellenebilir)
const departments = [
  { id: '1', name: 'Bilgi Teknolojileri' },
  { id: '2', name: 'İnsan Kaynakları' },
];
const jobTypes = [
  { id: '1', name: 'Tam Zamanlı' },
  { id: '2', name: 'Yarı Zamanlı' },
];
const roles = [
  { id: '1', name: 'Çalışan' },
  { id: '2', name: 'Yönetici' },
  { id: '3', name: 'HR' },
];
const managers = [
  { id: 'm1', name: 'Ahmet Güvendik' },
  { id: 'm2', name: 'Ayşe Yılmaz' },
];

const initialState = {
  tcNo: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: 1,
  phoneNumber: '',
  startingJob: '',
  departmanId: '',
  jobTitle: '',
  jobTypeId: '',
  sicilNo: '',
  brutSalary: '',
  netSalary: '',
  iban: '',
  prim: '',
  disruptions: '',
  email: '',
  password: '',
  username: '',
  managerId: '',
  roleId: '',
};

const ORANGE = 'var(--color-orange)';
const ORANGE_DARK = 'var(--color-orange-dark)';
const WHITE = 'var(--color-white)';
const GRAY = 'var(--color-gray)';
const BORDER = 'var(--color-border)';
const TEXT = 'var(--color-text)';

const CreateUser = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Dinamik combobox verileri
  const [departments, setDepartments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Departmanlar
    axios.get('http://localhost:5293/api/Departman')
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments([]));
    // İş tipleri
    axios.get('http://localhost:5293/api/JobType')
      .then(res => setJobTypes(res.data))
      .catch(() => setJobTypes([]));
    // Roller
    axios.get('http://localhost:5293/api/Role')
      .then(res => setRoles(res.data))
      .catch(() => setRoles([]));
    // Managerlar (sadece manager rolündekiler)
    axios.get('http://localhost:5293/api/Role/GetManagerRole')
      .then(res => setManagers(res.data))
      .catch(() => setManagers([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5293/api/Register', {
        ...form,
        brutSalary: Number(form.brutSalary),
        netSalary: Number(form.netSalary),
        prim: Number(form.prim),
        disruptions: Number(form.disruptions),
        gender: Number(form.gender),
      });
      if (!res || res.status !== 200) throw new Error('Kayıt başarısız');
      setSuccess('Kullanıcı başarıyla eklendi!');
      setForm(initialState);
    } catch (err) {
      setError('Kullanıcı eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: WHITE, borderRadius: 16, padding: 32, boxShadow: '0 4px 32px 0 rgba(255,127,26,0.13)', marginTop: 32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', color: TEXT }}>
      <h2 style={{ color: ORANGE_DARK, textAlign: 'center', marginBottom: 32, fontWeight: 700, letterSpacing: 1 }}>Kullanıcı Ekle (HR)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Input label="TC No" name="tcNo" value={form.tcNo} onChange={handleChange} required />
        <Input label="Ad" name="firstName" value={form.firstName} onChange={handleChange} required />
        <Input label="Soyad" name="lastName" value={form.lastName} onChange={handleChange} required />
        <Input label="Doğum Tarihi" name="birthDate" value={form.birthDate} onChange={handleChange} type="date" required />
        <Select label="Cinsiyet" name="gender" value={form.gender} onChange={handleChange} options={[
          { value: 1, label: 'Erkek' },
          { value: 2, label: 'Kadın' },
        ]} />
        <Input label="Telefon" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
        <Input label="İşe Başlama" name="startingJob" value={form.startingJob} onChange={handleChange} type="date" required />
        <Select label="Departman" name="departmanId" value={form.departmanId} onChange={handleChange} options={departments.map(d => ({ value: d.id, label: d.name }))} required />
        <Input label="Pozisyon" name="jobTitle" value={form.jobTitle} onChange={handleChange} required />
        <Select label="İş Tipi" name="jobTypeId" value={form.jobTypeId} onChange={handleChange} options={jobTypes.map(j => ({ value: j.id, label: j.name }))} required />
        <Input label="Sicil No" name="sicilNo" value={form.sicilNo} onChange={handleChange} required />
        <Input label="Brüt Maaş" name="brutSalary" value={form.brutSalary} onChange={handleChange} type="number" required />
        <Input label="Net Maaş" name="netSalary" value={form.netSalary} onChange={handleChange} type="number" required />
        <Input label="IBAN" name="iban" value={form.iban} onChange={handleChange} required />
        <Input label="Prim" name="prim" value={form.prim} onChange={handleChange} type="number" required />
        <Input label="Kesinti" name="disruptions" value={form.disruptions} onChange={handleChange} type="number" required />
        <Input label="E-posta" name="email" value={form.email} onChange={handleChange} type="email" required />
        <Input label="Kullanıcı Adı" name="username" value={form.username} onChange={handleChange} required />
        <Input label="Şifre" name="password" value={form.password} onChange={handleChange} type="password" required />
        <Select label="Yönetici" name="managerId" value={form.managerId} onChange={handleChange} options={managers.map(m => ({ value: m.id, label: m.name }))} required />
        <Select label="Rol" name="roleId" value={form.roleId} onChange={handleChange} options={roles.map(r => ({ value: r.id, label: r.name }))} required />
        <button type="submit" style={submitBtnStyle} disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
      </form>
      {success && <div style={{ color: '#43e97b', marginTop: 16, textAlign: 'center' }}>{success}</div>}
      {error && <div style={{ color: '#ff003c', marginTop: 16, textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

function Input({ label, ...props }) {
  return (
    <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column' }}>
      <label style={{ color: ORANGE_DARK, marginBottom: 4, fontWeight: 600 }}>{label}</label>
      <input {...props} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid ' + BORDER, fontSize: 15, background: GRAY, color: TEXT, outline: 'none', marginBottom: 2, fontWeight: 500, transition: 'border 0.2s' }} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column' }}>
      <label style={{ color: ORANGE_DARK, marginBottom: 4, fontWeight: 600 }}>{label}</label>
      <select {...props} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid ' + BORDER, fontSize: 15, background: GRAY, color: TEXT, outline: 'none', marginBottom: 2, fontWeight: 500, transition: 'border 0.2s' }}>
        <option value="">Seçiniz</option>
        {options.map(opt => (
          <option key={opt.value || opt.id} value={opt.value || opt.id}>{opt.label || opt.name}</option>
        ))}
      </select>
    </div>
  );
}

const submitBtnStyle = {
  background: ORANGE,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '12px 32px',
  fontWeight: 700,
  fontSize: 17,
  cursor: 'pointer',
  margin: '24px auto 0',
  display: 'block',
  minWidth: 180,
  boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
  transition: 'background 0.2s',
};

export default CreateUser;
