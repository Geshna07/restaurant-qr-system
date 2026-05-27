import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Customer Pages
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

// Auth
import LoginPage from './pages/LoginPage';

// Staff Pages
import StaffOrdersPage from './pages/staff/StaffOrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminTablesPage from './pages/admin/AdminTablesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Common
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/staff/orders" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Customer Routes - PUBLIC */}
      <Route path="/menu/:tableId" element={<MenuPage />} />
      <Route path="/cart/:tableId" element={<CartPage />} />
      <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Staff Routes - Protected */}
      <Route path="/staff/orders" element={
        <ProtectedRoute>
          <StaffOrdersPage />
        </ProtectedRoute>
      } />

      {/* Admin Routes - Protected (Admin only) */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/menu" element={
        <ProtectedRoute requiredRole="admin">
          <AdminMenuPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff" element={
        <ProtectedRoute requiredRole="admin">
          <AdminStaffPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/tables" element={
        <ProtectedRoute requiredRole="admin">
          <AdminTablesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredRole="admin">
          <AdminSettingsPage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
            <a href="/menu/table1" className="text-orange-500 mt-2 block font-medium">
              Go to Menu →
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid #374151'
              },
              success: {
                iconTheme: { primary: '#FF6B35', secondary: '#fff' }
              }
            }}
          />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;