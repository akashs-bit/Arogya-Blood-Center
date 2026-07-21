import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import RegisterDonor from "./pages/RegisterDonor";
import LoginDonor from "./pages/LoginDonor";
import Camps from "./pages/Camps";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reports from "./pages/Reports";
import EligibilityPage from "./pages/EligibilityPage";
import DonorSearch from "./pages/DonorSearch";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DonorsPage from "./pages/Admin/DonorsPage";
import EditDonorPage from "./pages/Admin/EditDonorPage";
import AlertsPage from "./pages/Admin/AlertsPage";
import CampsPage from "./pages/Admin/CampsPage";
import EditCampPage from "./pages/Admin/EditCampPage";
import ReportsPage from "./pages/Admin/ReportsPage";
import RegisterCamp from "./pages/RegisterCamps";
import ViewAllDonorsPage from "./pages/Admin/ViewAllDonorsPage";
import ViewAllCamps from "./pages/Admin/ViewAllCamps";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER LAYOUT */}

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />

          <Route path="register-donor" element={<RegisterDonor />} />

          <Route path="login-donor" element={<LoginDonor />} />

          <Route path="camps" element={<Camps />} />

          <Route path="about" element={<About />} />

          <Route path="contact" element={<Contact />} />

          <Route path="register-camps/:id" element={<RegisterCamp />} />

          <Route path="reports" element={<Reports />} />

          <Route path="eligibility" element={<EligibilityPage />} />

          <Route path="search-donor" element={<DonorSearch />} />
        </Route>

        {/* ADMIN LAYOUT */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="donors" element={<DonorsPage />} />

          <Route path="/admin/donors/edit/:id" element={<EditDonorPage />} />

          <Route path="/admin/donors/all" element={<ViewAllDonorsPage />} />

          <Route path="/admin/camps/all" element={<ViewAllCamps />} />

          <Route path="alerts" element={<AlertsPage />} />

          <Route path="camps" element={<CampsPage />} />

          <Route path="camps/edit/:id" element={<EditCampPage />} />

          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
