import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layouts/AuthLayout";
import AdminPendingJobs from "./pages/AdminPendingJobs";
import AdminLayout from "./layouts/AdminLayout";


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          }
        />
        <Route path="/admin/pending-jobs" element={<AdminPendingJobs />} />
      </Routes>
    </>
  );
}
