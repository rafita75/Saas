import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard temporal (placeholder)
const Dashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600">¡Bienvenido! Has iniciado sesión correctamente.</p>
      <p className="text-gray-600 mt-2">
        Tenant: <strong>{localStorage.getItem('tenant_name')}</strong>
      </p>
      <p className="text-gray-600">
        Slug: <strong>{localStorage.getItem('tenant_slug')}</strong>
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;