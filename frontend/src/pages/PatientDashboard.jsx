import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Activity,
  FileText,
  Pill,
  Calendar,
  Lock,
  LogOut,
} from "lucide-react";
import ChangePasswordModal from "../components/ChangePasswordModal";
import VitalsChart from "../components/VitalsChart";

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const { data: myProfile } = await api.get("/patients/profile/me");
        setProfile(myProfile);

        const [treatRes, reportRes, vitalsRes] = await Promise.all([
          api.get(`/treatments/${myProfile._id}`),
          api.get(`/reports/${myProfile._id}`),
          api.get(`/vitals/${myProfile._id}`),
        ]);

        setTreatments(treatRes.data);
        setReports(reportRes.data);
        setVitals(vitalsRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading your health records...
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col fixed left-0 top-0 p-6 shadow-xl">
        <h1 className="font-extrabold text-2xl text-primary tracking-tight mb-10">
          MediCare+
        </h1>

        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-all duration-300 shadow-sm">
            <Activity size={20} /> My Health
          </button>
        </div>

        {/* Password Button */}
        <div className="mt-10 border-t pt-5">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark font-medium border border-gray-200 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all shadow-sm"
          >
            <Lock size={16} /> Update Password
          </button>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-danger border border-gray-300 bg-white hover:bg-red-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10">
        <h1 className="text-4xl font-extrabold text-dark mb-2 tracking-tight">
          Hi, {profile?.name} 👋
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Here's your complete medical overview.
        </p>

        {/* Vitals Chart */}
        <div className="mb-10">
          {vitals.length > 0 ? (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="font-bold mb-4 text-lg text-dark">
                Health Vitals Trend
              </h2>
              <VitalsChart vitals={vitals} />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md text-center text-gray-400">
              No vitals recorded yet.
            </div>
          )}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Treatments */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-dark text-xl flex items-center gap-3">
              <Pill className="text-primary" size={22} />
              Recent Treatments
            </h2>

            {treatments.length > 0 ? (
              treatments.map((t) => (
                <div
                  key={t._id}
                  className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-primary text-lg">
                      {t.diagnosis}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold text-dark">Doctor:</span>{" "}
                      {t.doctorId?.name || "System Admin"}
                    </p>

                    <p>
                      <span className="font-semibold text-dark">
                        Medicines:
                      </span>{" "}
                      {t.medicines}
                    </p>

                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 border border-blue-200 shadow-sm">
                      <span className="font-semibold mr-2">
                        Doctor's Advice:
                      </span>
                      {t.advice}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-10 rounded-3xl text-center text-gray-400 shadow-md border border-gray-100">
                No treatments found.
              </div>
            )}
          </div>

          {/* Reports & Reminders */}
          <div className="space-y-8">
            {/* Reports Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="font-bold text-dark text-xl mb-5 flex items-center gap-3">
                <FileText className="text-blue-500" size={22} /> My Reports
              </h2>

              {reports.length > 0 ? (
                reports.map((r) => (
                  <a
                    key={r._id}
                    href={`http://localhost:5000/uploads/reports/${r.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-all duration-200 border border-transparent hover:border-gray-200 mb-2"
                  >
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {r.reportTitle}
                    </span>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Download
                    </span>
                  </a>
                ))
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">
                  No reports uploaded.
                </div>
              )}
            </div>

            {/* Appointment Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-7 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <Calendar size={22} />
                </div>
                <h3 className="font-bold text-lg">Checkups Reminder</h3>
              </div>

              <p className="opacity-90 text-sm leading-relaxed">
                Stay consistent with checkups. Early detection ensures healthier
                outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PatientDashboard;
