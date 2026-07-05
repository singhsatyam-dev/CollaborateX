import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import SignUp from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import EditorPage from "./pages/EditorPage";
import DashboardPage from "./pages/dashboardPage";
import ProtectedRoute from "./routes/protectedRoutes";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFound";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
