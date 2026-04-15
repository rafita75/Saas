import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './core/landing/pages/Home';
import Login from './core/auth/pages/Login';
import Register from './core/auth/pages/Register';

function App() {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    // TODO: Agregar Dashboard
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-white">Dashboard en construcción</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;