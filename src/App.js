import { useState } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  return (
    <Router>
      <MainContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

function MainContent({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  // Kullanıcı bilgisini güvenli şekilde al
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-gray)',
      padding: 0,
      fontFamily: 'Inter, Arial, sans-serif',
      color: 'var(--color-text)',
    }}>
      {isLoggedIn && user && (
        <nav style={{
          marginBottom: 32,
          background: 'var(--color-orange)',
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(255,127,26,0.10)',
          padding: '18px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Her rol için ortak talep oluşturma */}
          <Link to="/create-purchase" style={navLinkStyle}>Satın Alma Talep Oluştur</Link>
          <Link to="/view-purchase" style={navLinkStyle}>Satın Alma Taleplerim</Link>
          <Link to="/create-leave" style={navLinkStyle}>İzin Talebi Oluştur</Link>
          <Link to="/view-leave" style={navLinkStyle}>İzin Taleplerim</Link>
          <Link to="/user-profile" style={navLinkStyle}>Profilim</Link>
          {/* HR için özel menü */}
          {user?.roleName === 'HR' && (
            <>
              <Link to="/approved-leave-requests" style={navLinkStyle}>Onay Bekleyen İzinler</Link>
              <Link to="/create-user" style={navLinkStyle}>Kullanıcı Ekle</Link>
            </>
          )}
          {/* Manager için özel menü */}
          {user?.roleName === 'Manager' && (
            <>
              <Link to="/manager-leave-requests" style={navLinkStyle}>Yönetici İzin Talepleri</Link>
              <Link to="/manager-purchase-requests" style={navLinkStyle}>Satın Alma Talepleri (Yönetici)</Link>
            </>
          )}
          <button onClick={handleLogout} style={{
            background: 'var(--color-orange-dark)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginLeft: 'auto',
            boxShadow: '0 2px 8px 0 rgba(255,127,26,0.10)',
            transition: 'background 0.2s',
          }}>Çıkış Yap</button>
        </nav>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/user-profile" />
              ) : (
                <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
              )
            }
          />

          {/* Talep oluşturma sayfası (her rol için açık) */}
          <Route
            path="/create-purchase"
            element={
              isLoggedIn ? (
                <PurchaseForm onSuccess={() => setReload(prev => !prev)} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Staff Talepleri */}
          <Route
            path="/view-purchase"
            element={
              isLoggedIn ? (
                <PurchaseList reload={reload} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Ana Sayfa Yönlendirmesi */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/user-profile" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/user-profile"
            element={
              isLoggedIn ? (
                <UserProfile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/create-leave"
            element={
              isLoggedIn ? <LeaveRequestForm /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/view-leave"
            element={
              isLoggedIn ? <LeaveRequestList /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/manager-leave-requests"
            element={
              isLoggedIn && user?.roleName === 'Manager' ? (
                <ManagerLeaveRequests />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* HR için onay bekleyen izinler */}
          <Route
            path="/approved-leave-requests"
            element={
              isLoggedIn && user?.roleName === 'HR' ? (
                <ApprovedLeaveRequestList />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Manager için satın alma talepleri */}
          <Route
            path="/manager-purchase-requests"
            element={
              isLoggedIn && user?.roleName === 'Manager' ? (
                <ManagerPurchaseList />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* HR için kullanıcı ekleme */}
          <Route
            path="/create-user"
            element={
              isLoggedIn && user?.roleName === 'HR' ? (
                <CreateUser />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: 'var(--color-white)',
  background: 'transparent',
  fontWeight: 600,
  fontSize: 15,
  padding: '8px 18px',
  borderRadius: 8,
  textDecoration: 'none',
  transition: 'background 0.2s, color 0.2s',
  marginRight: 6,
  display: 'inline-block',
};

const logoutBtnStyle = {
  background: 'var(--destructive)',
  color: 'var(--destructive-foreground)',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  marginLeft: 8,
  boxShadow: 'var(--shadow-md)',
  transition: 'background 0.2s',
};

const panelTitleStyle = {
  color: 'var(--foreground)',
  textAlign: 'center',
  margin: '40px 0 24px 0',
  fontWeight: 700,
  letterSpacing: 1,
  fontSize: 28,
};

export default App;
