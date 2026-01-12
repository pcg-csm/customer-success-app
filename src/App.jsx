import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import ActivityFeed from './pages/ActivityFeed';
import Presales from './pages/Presales';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Training from './pages/Training';
import Documentation from './pages/Documentation';
import { useData } from './context/DataContext';

function App() {
  const { currentUser, isLoading } = useData();

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#64748b'
      }}>
        Loading security session...
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="activity" element={<ActivityFeed />} />
          <Route path="presales" element={<Presales />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="training" element={<Training />} />
          <Route path="documentation" element={<Documentation />} />
        </Route>
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
