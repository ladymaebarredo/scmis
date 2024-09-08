import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./HomePage";
import DashboardLayout from "./DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import CertificatePage from "./pages/dashboard/CertificatePage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import UsersPage from "./pages/dashboard/UsersPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
