import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import RequireAdminAuth from './components/admin/RequireAdminAuth';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WhatsAppButton />
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex min-h-screen flex-col bg-stone-50">
              <Navbar />
              <div className="flex-1">
                <HomePage />
              </div>
              <Footer />
            </div>
          }
        />
        <Route
          path="/properties"
          element={
            <div className="flex min-h-screen flex-col bg-stone-50">
              <Navbar />
              <div className="flex-1">
                <PropertiesPage />
              </div>
              <Footer />
            </div>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <div className="flex min-h-screen flex-col bg-stone-50">
              <Navbar />
              <div className="flex-1">
                <PropertyDetailPage />
              </div>
              <Footer />
            </div>
          }
        />
        <Route path="/contact" element={<Navigate to={{ pathname: '/', hash: '#contact' }} replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdminAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="properties" element={<AdminPropertiesPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="inquiries" element={<AdminInquiriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
