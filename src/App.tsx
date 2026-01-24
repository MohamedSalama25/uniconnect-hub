import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Index from "./pages/Index";
import Accommodations from "./pages/Accommodations";
import MapPage from "./pages/MapPage";
import Services from "./pages/Services";
import Chat from "./pages/Chat";
import HelpRequests from "./pages/HelpRequests";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminPostsPage from "./pages/AdminPostsPage";
import AdminPostDetailsPage from "./pages/AdminPostDetailsPage";
import AccommodationDetail from "@/pages/AccommodationDetail";
import BookingPage from "./pages/BookingPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import LocationPrompt from "./components/globalComponents/LocationPrompt";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { GlobalImageViewer } from "./components/globalComponents/GlobalImageViewer";

import ProviderBookingsPage from "./pages/ProviderBookingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminRatingsPage from "./pages/AdminRatingsPage";


const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LocationPrompt />
          <GlobalImageViewer />
          <ScrollToTop />
          <Routes>
            <Route
              path="/welcome"
              element={isAuthenticated ? <Navigate to="/" replace /> : <LandingPage />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route
              path="/forget-password"
              element={isAuthenticated ? <Navigate to="/" replace /> : <ForgetPasswordPage />}
            />
            <Route
              path="/reset-password"
              element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />}
            />

            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/accommodations" element={<ProtectedRoute><Accommodations /></ProtectedRoute>} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/accommodation/:id/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/service/:id" element={<ProtectedRoute><ServiceDetailPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpRequests /></ProtectedRoute>} />
            <Route path="/admin/posts" element={<ProtectedRoute><AdminPostsPage /></ProtectedRoute>} />
            <Route path="/admin/post/:id" element={<ProtectedRoute><AdminPostDetailsPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/ratings" element={<ProtectedRoute><AdminRatingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/provider/bookings" element={<ProtectedRoute><ProviderBookingsPage /></ProtectedRoute>} />

            <Route path="*" element={<ProtectedWrapper><NotFound /></ProtectedWrapper>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Helper to keep layout for NotFound if authenticated
const ProtectedWrapper = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

export default App;
