import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import LoginAdmin from "./pages/admin/LoginAdmin";
import Confirmacion from "./pages/Confirmacion";
import DashboardPage from "./pages/DashboardPage";
import ScannerPage from "./pages/ScannerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/envelope.css";
import "./styles/styles.css";
import "./styles/admin.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* LOGIN */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* ADMIN AREA */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/scanner"
          element={
            <ProtectedRoute>
              <ScannerPage />
            </ProtectedRoute>
          }
        />

        <Route path="/confirmacion" element={<Confirmacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
