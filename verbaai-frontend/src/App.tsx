import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminInterviews = lazy(() => import("./pages/admin/Interviews"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <p className="mt-5 text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/interviews"
          element={
            <ProtectedRoute>
              <AdminInterviews />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
