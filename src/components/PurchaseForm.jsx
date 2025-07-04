import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send, AlertCircle } from 'lucide-react';
import { createPurchase } from '../api';

const ORANGE = '#ff7f1a';
const ORANGE_DARK = '#ff6600';
const WHITE = '#fff';
const GRAY = '#f8f9fa';
const BORDER = '#ffd9b3';
const TEXT = '#222';
const DISABLED = '#f3f3f3';

export default function PurchaseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    userId: '',
    managerId: '',
    departmentId: '',
    urgencyLevel: 1,
    reason: '',
    items: [{ id: 'ITM-001', productName: '', quantity: 0, description: '' }]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id || '',
        managerId: user.managerId || '',
        departmentId: user.departmanId || ''
      }));
    }
  }, []);

  const urgencyLevels = [
    { value: 1, label: 'Düşük', color: ORANGE + '22', text: ORANGE },
    { value: 2, label: 'Orta', color: ORANGE + '55', text: ORANGE_DARK },
    { value: 3, label: 'Yüksek', color: ORANGE + '99', text: ORANGE_DARK },
    { value: 4, label: 'Acil', color: ORANGE, text: WHITE }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem = {
      id: `ITM-${String(formData.items.length + 1).padStart(3, '0')}`,
      productName: '',
      quantity: 0,
      description: ''
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reason.trim()) newErrors.reason = 'Talep gerekçesi zorunludur';
    formData.items.forEach((item, index) => {
      if (!item.productName.trim()) newErrors[`item_${index}_productName`] = 'Ürün adı zorunludur';
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Miktar 0\'dan büyük olmalıdır';
      if (!item.description.trim()) newErrors[`item_${index}_description`] = 'Açıklama zorunludur';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createPurchase(formData);
      alert('Satın alma talebi başarıyla gönderildi!');
      setFormData(prev => ({
        ...prev,
        reason: '',
        urgencyLevel: 1,
        items: [{ id: 'ITM-001', productName: '', quantity: 0, description: '' }]
      }));
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: ORANGE + '08', padding: '32px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ background: WHITE, borderRadius: 16, boxShadow: '0 4px 32px 0 ' + ORANGE + '22', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`, padding: '28px 32px' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: WHITE, margin: 0 }}>Satın Alma Talebi</h1>
            <p style={{ color: '#fffbe6', marginTop: 6, fontSize: 16 }}>Departman ihtiyaçlarınız için talep oluşturun</p>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 32, background: WHITE }}>
            {/* Sistem Bilgileri */}
            <div style={{ background: GRAY, borderRadius: 10, padding: 18, marginBottom: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: ORANGE_DARK, marginBottom: 12 }}>Sistem Bilgileri</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                <div>
                  <label style={sysLabel}>Kullanıcı ID</label>
                  <input type="text" value={formData.userId} disabled style={sysInput} />
                </div>
                <div>
                  <label style={sysLabel}>Yönetici ID</label>
                  <input type="text" value={formData.managerId} disabled style={sysInput} />
                </div>
                <div>
                  <label style={sysLabel}>Departman ID</label>
                  <input type="text" value={formData.departmentId} disabled style={sysInput} />
                </div>
              </div>
            </div>
            {/* Aciliyet ve Gerekçe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 28 }}>
              <div>
                <label style={label}>Aciliyet Seviyesi</label>
                <select
                  value={formData.urgencyLevel}
                  onChange={e => handleInputChange('urgencyLevel', parseInt(e.target.value))}
                  style={input}
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    background: urgencyLevels.find(l => l.value === formData.urgencyLevel)?.color,
                    color: urgencyLevels.find(l => l.value === formData.urgencyLevel)?.text
                  }}>{urgencyLevels.find(l => l.value === formData.urgencyLevel)?.label}</span>
                </div>
                <div style={{ marginTop: 18 }}>
                  <label style={label}>Talep Gerekçesi <span style={{ color: ORANGE_DARK }}>*</span></label>
                  <textarea
                    value={formData.reason}
                    onChange={e => handleInputChange('reason', e.target.value)}
                    rows={4}
                    style={{ ...input, resize: 'vertical', minHeight: 80, borderColor: errors.reason ? ORANGE_DARK : BORDER, width: 'calc(100% + 120px)', maxWidth: 600, marginLeft: 0 }}
                    placeholder="Satın alma talebinizin gerekçesini açıklayın..."
                  />
                  {errors.reason && (
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', color: ORANGE_DARK, fontSize: 14 }}>
                      <AlertCircle size={16} style={{ marginRight: 4 }} />
                      {errors.reason}
                    </div>
                  )}
                </div>
              </div>
              <div />
            </div>
            {/* Ürünler */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: ORANGE_DARK }}>Talep Edilen Ürünler</h3>
                <button type="button" onClick={addItem} style={addBtn}><Plus size={16} style={{ marginRight: 6 }} />Ürün Ekle</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {formData.items.map((item, index) => (
                  <div key={item.id} style={{ background: GRAY, borderRadius: 10, padding: 16, border: '1px solid ' + BORDER }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <h4 style={{ fontWeight: 600, color: TEXT }}>Ürün #{index + 1}</h4>
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} style={removeBtn}><Trash2 size={16} /></button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={miniLabel}>Ürün Adı <span style={{ color: ORANGE_DARK }}>*</span></label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={e => handleItemChange(index, 'productName', e.target.value)}
                          style={{ ...input, borderColor: errors[`item_${index}_productName`] ? ORANGE_DARK : BORDER }}
                          placeholder="Ürün adını giriniz"
                        />
                        {errors[`item_${index}_productName`] && (
                          <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', color: ORANGE_DARK, fontSize: 13 }}>
                            <AlertCircle size={14} style={{ marginRight: 4 }} />
                            {errors[`item_${index}_productName`]}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={miniLabel}>Miktar <span style={{ color: ORANGE_DARK }}>*</span></label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          style={{ ...input, width: '100%', borderColor: errors[`item_${index}_quantity`] ? ORANGE_DARK : BORDER }}
                          placeholder="0"
                        />
                        {errors[`item_${index}_quantity`] && (
                          <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', color: ORANGE_DARK, fontSize: 13 }}>
                            <AlertCircle size={14} style={{ marginRight: 4 }} />
                            {errors[`item_${index}_quantity`]}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={miniLabel}>Açıklama <span style={{ color: ORANGE_DARK }}>*</span></label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleItemChange(index, 'description', e.target.value)}
                          style={{ ...input, borderColor: errors[`item_${index}_description`] ? ORANGE_DARK : BORDER }}
                          placeholder="Ürün açıklaması"
                        />
                        {errors[`item_${index}_description`] && (
                          <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', color: ORANGE_DARK, fontSize: 13 }}>
                            <AlertCircle size={14} style={{ marginRight: 4 }} />
                            {errors[`item_${index}_description`]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid ' + BORDER, paddingTop: 24 }}>
              <button type="submit" style={submitBtn}><Send size={16} style={{ marginRight: 8 }} />Talebi Gönder</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const label = { color: TEXT, fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' };
const miniLabel = { color: TEXT, fontWeight: 500, fontSize: 13, marginBottom: 2, display: 'block' };
const sysLabel = { color: ORANGE_DARK, fontWeight: 600, fontSize: 14, marginBottom: 2, display: 'block' };
const sysInput = { background: DISABLED, color: '#888', border: '1px solid ' + BORDER, borderRadius: 7, padding: '8px 10px', fontSize: 14, outline: 'none', marginBottom: 2, width: '100%' };
const input = { background: WHITE, color: TEXT, border: '1px solid ' + BORDER, borderRadius: 7, padding: '10px 12px', fontSize: 15, outline: 'none', transition: 'border 0.2s', marginBottom: 2, width: '100%' };
const addBtn = { background: ORANGE, color: WHITE, border: 'none', borderRadius: 8, padding: '9px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.2s', boxShadow: '0 2px 8px 0 ' + ORANGE + '22' };
const removeBtn = { background: 'none', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', outline: 'none', padding: 0, color: ORANGE_DARK };
const submitBtn = { background: ORANGE, color: WHITE, border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 700, fontSize: 17, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 2px 8px 0 ' + ORANGE + '22', display: 'flex', alignItems: 'center', transition: 'background 0.2s' };
