import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Shield } from 'lucide-react';

const ORANGE = '#ff7f1a';
const ORANGE_DARK = '#ff6600';
const WHITE = '#fff';
const GRAY = '#f8f9fa';
const BORDER = '#ffd9b3';
const TEXT = '#222';
const DISABLED = '#f3f3f3';

export default function LoginPage({ onLoginSuccess }) {
  const [tcNo, setTcNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateTC = (tc) => {
    if (!tc) return false;
    if (!/^\d+$/.test(tc)) return false;
    const digits = tc.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const check1 = (sum1 * 7 - sum2) % 10;
    const check2 = (sum1 + sum2 + digits[9]) % 10;
    return check1 === digits[9] && check2 === digits[10];
  };

  const handleTcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setTcNo(value);
    if (errors.tcNo) {
      setErrors(prev => ({ ...prev, tcNo: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!tcNo) {
      newErrors.tcNo = 'TC Kimlik numarası gereklidir';
    }
    if (!password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await import('../api').then(mod => mod.login({ tcNo, password }));
      setIsLoading(false);
      localStorage.setItem('user', JSON.stringify(response.data));
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      setErrors({ password: 'Giriş başarısız! TC Kimlik No veya şifre hatalı.' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: ORANGE + '08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: WHITE,
        borderRadius: 18,
        boxShadow: '0 4px 32px 0 ' + ORANGE + '22',
        padding: 36,
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: ORANGE, borderRadius: '50%', marginBottom: 18, boxShadow: '0 2px 8px 0 ' + ORANGE + '33' }}>
            <Shield style={{ width: 32, height: 32, color: WHITE }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Güvenli Giriş</h1>
          <p style={{ color: ORANGE_DARK, fontSize: 15 }}>TC Kimlik numaranız ile giriş yapın</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="tcNo" style={{ color: TEXT, fontWeight: 500, fontSize: 15, marginBottom: 2 }}>TC Kimlik Numarası</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: 12 }}><User style={{ width: 20, height: 20, color: ORANGE_DARK }} /></span>
              <input
                id="tcNo"
                type="text"
                value={tcNo}
                onChange={handleTcChange}
                placeholder="TC Kimlik numaranızı giriniz"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1.5px solid ' + BORDER,
                  borderRadius: 10,
                  fontSize: 16,
                  background: GRAY,
                  color: TEXT,
                  outline: 'none',
                  fontWeight: 500,
                  marginBottom: 2,
                  transition: 'border 0.2s',
                }}
                maxLength={11}
              />
            </div>
            {errors.tcNo && (
              <p style={{ color: ORANGE_DARK, fontSize: 13, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>⚠</span> {errors.tcNo}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="password" style={{ color: TEXT, fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Şifre</label>
            <div style={{ position: 'relative', height: 44 }}>
              <span style={{ position: 'absolute', left: 12, top: 12 }}>
                <Lock style={{ width: 20, height: 20, color: ORANGE_DARK }} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                placeholder="Şifrenizi giriniz"
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '12px 48px 12px 40px',
                  border: '1.5px solid ' + BORDER,
                  borderRadius: 10,
                  fontSize: 16,
                  background: GRAY,
                  color: TEXT,
                  outline: 'none',
                  fontWeight: 500,
                  marginBottom: 2,
                  transition: 'border 0.2s',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 44,
                  width: 32,
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff style={{ width: 20, height: 20, color: ORANGE_DARK }} /> : <Eye style={{ width: 20, height: 20, color: ORANGE_DARK }} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: ORANGE_DARK, fontSize: 13, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>⚠</span> {errors.password}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: ORANGE_DARK }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: 6, accentColor: ORANGE }}
              />
              Beni hatırla
            </label>
            <a href="#" style={{ color: ORANGE_DARK, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Şifremi unuttum</a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: ORANGE,
              color: WHITE,
              fontWeight: 700,
              fontSize: 17,
              border: 'none',
              borderRadius: 10,
              padding: '13px 0',
              marginTop: 8,
              boxShadow: '0 2px 8px 0 ' + ORANGE + '22',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <span>Giriş yapılıyor...</span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
        <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid ' + BORDER, textAlign: 'center' }}>
          {/* Kayıt olun linki kaldırıldı */}
        </div>
        <div style={{ marginTop: 24, background: ORANGE + '11', border: '1px solid ' + BORDER, borderRadius: 10, padding: 14, color: TEXT, fontSize: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, background: WHITE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield style={{ width: 16, height: 16, color: ORANGE }} />
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2, color: ORANGE_DARK }}>Güvenlik Uyarısı</div>
              <div style={{ color: TEXT }}>Kişisel bilgilerinizi korumak için güvenli bir bağlantı kullanıyoruz. TC kimlik numaranızı yalnızca güvenilir sitelerde paylaşın.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
