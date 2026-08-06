import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CommunicationCoach from "./pages/CommunicationCoach";
import CommunicationHistory from "./pages/CommunicationHistory";
import InterviewPractice from "./pages/InterviewPractice";
import InterviewHistory from "./pages/InterviewHistory";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/ResumeHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communication-coach"
                element={
                  <ProtectedRoute>
                    <CommunicationCoach />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communication-coach/history"
                element={
                  <ProtectedRoute>
                    <CommunicationHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <InterviewPractice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <ResumeAnalyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/history"
                element={
                  <ProtectedRoute>
                    <ResumeHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all: any unmatched path renders the 404 page instead
                  of a blank screen or React Router's default error UI. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
