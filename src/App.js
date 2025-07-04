import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import PurchaseForm from './components/PurchaseForm';
import PurchaseList from './components/PurchaseList';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveRequestList from './components/LeaveRequestList';
import ManagerLeaveRequests from './components/ManagerLeaveRequest';
import ApprovedLeaveRequestList from './components/ApprovedLeaveRequestList';
import ManagerPurchaseList from './components/ManagerPurchaseList';
import CreateUser from './components/CreateUser';
import ManagerApprovedPurchaseList from './components/ManagerApprovedPurchaseList';
import AddOffer from './components/AddOffer';
import UpdatePurchase from './components/UpdatePurchase';
import axios from 'axios';

const ORANGE = '#ff9100';
const ORANGE_DARK = '#ff6d00';
const WHITE = '#fff';
const GRAY = '#fff7ed';
const BORDER = '#ffe0b2';
const TEXT = '#ff6d00';

function App() {
  // user'ı state olarak tut
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  // Login/logout sonrası user'ı güncelle
  useEffect(() => {
    const onStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
        setIsLoggedIn(!!localStorage.getItem('user'));
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Router>
      <MainContent user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

function MainContent({ user, setUser, isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  // userInfo'yu merkezi olarak yönet
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    if (!user?.id) {
      setUserInfo(null);
      setUserLoading(false);
      return;
    }
    setUserLoading(true);
    axios.get(`http://localhost:5293/api/GetUserById?userId=${user.id}`)
      .then(res => { setUserInfo(res.data); setUserLoading(false); })
      .catch(() => { setUserInfo(null); setUserLoading(false); });
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (!isLoggedIn || !user) {
    return (
      <div style={{ minHeight: '100vh', background: GRAY }}>
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={() => {
            setUser(JSON.parse(localStorage.getItem('user')));
            setIsLoggedIn(true);
          }} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: GRAY,
      fontFamily: 'Inter, Arial, sans-serif',
      color: TEXT,
      display: 'flex',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        minHeight: '100vh',
        background: WHITE,
        borderRight: `2px solid ${BORDER}`,
        boxShadow: '2px 0 16px 0 rgba(255,145,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '0 0',
        position: 'relative',
      }}>
        {/* Profil alanı */}
        <div style={{
          padding: '32px 24px 18px 24px',
          borderBottom: `1.5px solid ${BORDER}`,
          background: GRAY,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 6,
        }}>
          {userLoading ? (
            <div style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 16 }}>Yükleniyor...</div>
          ) : userInfo ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 18, color: ORANGE_DARK }}>{userInfo.firstName} {userInfo.lastName}</div>
              <div style={{ fontSize: 15, color: ORANGE }}>{userInfo.jobTitle}</div>
            </>
          ) : (
            <div style={{ color: ORANGE_DARK, fontWeight: 600, fontSize: 16 }}>Kullanıcı bulunamadı</div>
          )}
          <button onClick={handleLogout} style={{
            background: ORANGE_DARK,
            color: WHITE,
            border: 'none',
            borderRadius: 8,
            padding: '7px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            marginTop: 10,
            boxShadow: '0 2px 8px 0 rgba(255,145,0,0.10)',
            transition: 'background 0.2s',
          }}>Çıkış Yap</button>
        </div>
        {/* Menü linkleri */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: '24px 0 0 0',
        }}>
          <SidebarLink to="/user-profile" label="Profilim" />
          <SidebarLink to="/create-purchase" label="Satın Alma Talep Oluştur" />
          <SidebarLink to="/view-purchase" label="Satın Alma Taleplerim" />
          <SidebarLink to="/create-leave" label="İzin Talebi Oluştur" />
          <SidebarLink to="/view-leave" label="İzin Taleplerim" />
          {user?.roleNames?.includes('Purchase') && (
            <>
              <SidebarLink to="/approved-purchase" label="Onaylanan Satın Almalar" />
            </>
          )}
          {user?.roleNames?.includes('HR') && (
            <>
              <SidebarLink to="/approved-leave-requests" label="Onay Bekleyen İzinler" />
              <SidebarLink to="/create-user" label="Kullanıcı Ekle" />
            </>
          )}
          {user?.roleNames?.includes('Manager') && (
            <>
              <SidebarLink to="/manager-leave-requests" label="Yönetici İzin Talepleri" />
              <SidebarLink to="/manager-purchase-requests" label="Satın Alma Talepleri (Yönetici)" />
            </>
          )}
        </nav>
      </aside>
      {/* Sayfa içeriği */}
      <main style={{
        flex: 1,
        minHeight: '100vh',
        background: GRAY,
        padding: '0 0 0 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0 24px', width: '100%' }}>
          <Routes>
            <Route path="/user-profile" element={<UserProfile userInfo={userInfo} />} />
            <Route path="/create-purchase" element={<PurchaseForm onSuccess={() => setReload(prev => !prev)} userInfo={userInfo} />} />
            <Route path="/view-purchase" element={<PurchaseList reload={reload} userInfo={userInfo} />} />
            <Route path="/create-leave" element={<LeaveRequestForm userInfo={userInfo} />} />
            <Route path="/view-leave" element={<LeaveRequestList userInfo={userInfo} />} />
            <Route path="/manager-leave-requests" element={user?.roleNames?.includes('Manager') ? <ManagerLeaveRequests userInfo={userInfo} /> : <Navigate to="/login" />} />
            <Route path="/approved-leave-requests" element={user?.roleNames?.includes('HR') ? <ApprovedLeaveRequestList userInfo={userInfo} /> : <Navigate to="/login" />} />
            <Route path="/manager-purchase-requests" element={user?.roleNames?.includes('Manager') ? <ManagerPurchaseList userInfo={userInfo} /> : <Navigate to="/login" />} />
            <Route path="/create-user" element={user?.roleNames?.includes('HR') ? <CreateUser userInfo={userInfo} /> : <Navigate to="/login" />} />
            <Route path="/approved-purchase" element={user?.roleNames?.includes('Purchase') ? <ManagerApprovedPurchaseList userInfo={userInfo} /> : <Navigate to="/login" />} />
            <Route path="/add-offer/:purchaseId" element={user?.roleNames?.includes('Purchase') ? <AddOffer /> : <Navigate to="/login" />} />
            <Route path="/update-purchase/:id" element={<UpdatePurchase />} />
            <Route path="*" element={<Navigate to="/user-profile" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        color: TEXT,
        background: 'none',
        border: 'none',
        borderLeft: `4px solid transparent`,
        borderRadius: 0,
        padding: '12px 28px',
        fontWeight: 600,
        fontSize: 16,
        textDecoration: 'none',
        transition: 'background 0.2s, color 0.2s, border 0.2s',
        marginBottom: 2,
        display: 'block',
      }}
      activeclassname="active"
    >
      {label}
    </Link>
  );
}

export default App;
