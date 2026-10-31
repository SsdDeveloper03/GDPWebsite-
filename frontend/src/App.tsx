import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { WhatsAppButton } from './components/common/WhatsAppButton';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PodcastPage } from './pages/PodcastPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages & Protected Layout
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { EpisodesPage } from './pages/admin/EpisodesPage';
import { EpisodeFormPage } from './pages/admin/EpisodeFormPage';
import { GuestApplicationsPage } from './pages/admin/GuestApplicationsPage';
import { GuestDetailPage } from './pages/admin/GuestDetailPage';
import { ContactMessagesPage } from './pages/admin/ContactMessagesPage';
import { ContactMessageDetailPage } from './pages/admin/ContactMessageDetailPage';

/**
 * Public shell wrapping website visitors with consumer Navbar and Footer.
 */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)] transition-colors duration-300 selection:bg-[#D9A441] selection:text-[#0E1326]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ReviewsProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/podcast" element={<PodcastPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="episodes" element={<EpisodesPage />} />
                <Route path="episodes/new" element={<EpisodeFormPage />} />
                <Route path="episodes/:id/edit" element={<EpisodeFormPage />} />
                <Route path="guests" element={<GuestApplicationsPage />} />
                <Route path="guests/:id" element={<GuestDetailPage />} />
                <Route path="messages" element={<ContactMessagesPage />} />
                <Route path="messages/:id" element={<ContactMessageDetailPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ReviewsProvider>
    </ThemeProvider>
  );
}

export default App;
