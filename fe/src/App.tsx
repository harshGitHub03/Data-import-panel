import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchMe, login as loginApi, logout as logoutApi, type AuthUser } from './api/auth.api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageData from './pages/ManageData';
import UploadExcel from './pages/UploadExcel';
import SocialAds from './pages/SocialAds';
import Users from './pages/Users';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    setUser(await loginApi(email, password));
  }

  async function logout() {
    await logoutApi();
    setUser(null);
  }

  if (loading) return null;
  if (!user) return <Login onLogin={login} />;

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={logout} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage-data" element={<ManageData />} />
        <Route path="/upload-excel" element={<UploadExcel />} />
        <Route path="/social-ads" element={<SocialAds />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
}

export default App;
