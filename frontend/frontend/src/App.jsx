import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/authContext";
import PrivateRoute from "./utils/privateRoute";

import Layout from "./components/layout.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import CreateLead from "./pages/createLead.jsx";
import EditLead from "./pages/editLead.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads/create" element={<CreateLead />} />
              <Route path="/leads/edit/:id" element={<EditLead />} />
              <Route path="/settings" element={<div style={{padding:16}}>Settings</div>} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<div style={{padding:16}}>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
