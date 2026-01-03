import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { TranslationProvider } from './contexts/TranslationContext'
import Header from './components/Header'
import BottomNavigation from './components/BottomNavigation'
import { Toaster } from 'react-hot-toast'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const VendorListPage = lazy(() => import('./pages/VendorListPage'))
const VendorDetailPage = lazy(() => import('./pages/VendorDetailPage'))
const CategorySubcategoriesPage = lazy(() => import('./pages/CategorySubcategoriesPage'))
const MoreOptionsPage = lazy(() => import('./pages/MoreOptionsPage'))
const AgentRegistrationPage = lazy(() => import('./pages/AgentRegistrationPage'))
const CallEnquiryPage = lazy(() => import('./pages/CallEnquiryPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const OTPPage = lazy(() => import('./pages/OTPPage'))
const PageDetailPage = lazy(() => import('./pages/PageDetailPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))

function AppContent() {
  const location = useLocation()
  const showHeader = location.pathname === '/'
  const showBottomNav = !['/login', '/register', '/otp'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-white font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif] overflow-x-hidden">
      {showHeader && <Header />}
      <Suspense
        fallback={
          <div className="w-full py-10 text-center text-gray-600 text-sm">Loading...</div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryName" element={<CategoriesPage />} />
          <Route path="/category/:categoryName" element={<CategorySubcategoriesPage />} />
          <Route path="/vendors/:subcategoryName" element={<VendorListPage />} />
          <Route path="/vendor/:vendorId" element={<VendorDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/more" element={<MoreOptionsPage />} />
          <Route path="/agent-registration" element={<AgentRegistrationPage />} />
          <Route path="/call-enquiry" element={<CallEnquiryPage />} />
          <Route path="/page/:pageId" element={<PageDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Suspense>
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <TranslationProvider>
      <Router>
        <AppContent />
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </TranslationProvider>
  )
}

export default App
