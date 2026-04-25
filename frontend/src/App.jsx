import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Achievements from "./pages/Achievements";
import Toppers from "./pages/Toppers";
import Staff from "./pages/Staff";

// Admin
import AdminLogin from "./features/auth/AdminLogin";
import AdminLayout from "./features/admin/AdminLayout";
import AdminHero from "./features/admin/AdminHero";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminNotices from "./features/admin/AdminNotices";
import AdminGallery from "./features/admin/AdminGallery";
import AdminAchievements from "./features/admin/AdminAchievements";
import AdminStudents from "./features/admin/AdminStudents";
import AdminStaff from "./features/admin/AdminStaff";

// Styles
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#f1f5f9" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" } },
          }}
        />

        <Routes>
          {/* Admin Login (no navbar/footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Panel (protected, with sidebar layout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="staff" element={<AdminStaff />} />
          </Route>

          {/* Public Pages (with navbar/footer) */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/toppers" element={<Toppers />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center pt-16">
                        <div className="text-center">
                          <h1 className="text-6xl font-bold gradient-text font-heading">404</h1>
                          <p className="text-dark-500 mt-2">Page not found</p>
                        </div>
                      </div>
                    }
                  />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
