import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Activity, FileText, ArrowLeft, Plus, AlertTriangle, Upload, Sparkles 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import VitalsChart from '../components/VitalsChart'; // Import Vitals Chart

const PatientDetails = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('treatments');
  const [loading, setLoading] = useState(true);

  // Data States
  const [treatments, setTreatments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // AI Summary State
  const [summaryModal, setSummaryModal] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const { data: patientData } = await api.get(`/patients/${pid}`);
        setPatient(patientData);
        
        // Fetch ALL data
        const [treatRes, vitalsRes, reportsRes, alertsRes, appRes] = await Promise.all([
            api.get(`/treatments/${patientData._id}`),
            api.get(`/vitals/${patientData._id}`),
            api.get(`/reports/${patientData._id}`),
            api.get(`/alerts/patient/${patientData._id}`),
            api.get(`/appointments/${patientData._id}`) 
        ]);

        setTreatments(treatRes.data); 
        setVitals(vitalsRes.data); 
        setReports(reportsRes.data);
        setAlerts(alertsRes.data); 
        setAppointments(appRes.data);
      } catch (error) {
        console.error("Error loading patient:", error);
        toast.error("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [pid]);

  // --- AI Summarization Handler ---
  const handleAISummary = async (fileName) => {
      setSummaryModal({ status: 'loading', title: `Summarizing ${fileName}...` });
      try {
          const { data } = await api.post('/ai/summarize-report', { fileName });

          setSummaryModal({
              status: 'complete',
              title: 'AI Summary Complete (Key Points)',
              summary: data.summary,
          });
      } catch (error) {
          console.error(error);
          setSummaryModal({ status: 'error', title: 'Summary Failed', summary: 'Could not connect to AI Engine or read file.' });
      }
  };

  if (loading) return <div className="p-10 text-center">Loading Patient File...</div>;
  if (!patient) return <div className="p-10 text-center text-red-500">Patient Not Found</div>;

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate('/doctor/patients')} className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2"/> Back to List
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 flex justify-between items-start border border-gray-100">
            <div className="flex gap-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-primary font-bold text-3xl uppercase">
                    {patient.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-dark mb-2">{patient.name}</h1>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-dark font-mono">{patient.pid}</span>
                        <span>{patient.age} Years</span>
                        <span>{patient.gender}</span>
                        <span>{patient.contactEmail}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 min-w-[180px]">
                 <button onClick={() => navigate(`/doctor/patient/${patient.pid}/treatment/new`)} className="btn-primary px-4 py-2 text-sm flex items-center justify-center gap-2">
                    <Plus size={16} /> New Treatment
                 </button>
                 <button onClick={() => navigate(`/doctor/patient/${patient.pid}/appointment/new`)} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Calendar size={16} /> Schedule Visit
                 </button>
                 <button onClick={() => navigate(`/doctor/patient/${patient.pid}/vitals/new`)} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Activity size={16} /> Add Vitals
                 </button>
                 <button onClick={() => navigate(`/doctor/patient/${patient.pid}/report/new`)} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Upload size={16} /> Upload Report
                 </button>
                 <button onClick={() => navigate(`/doctor/patient/${patient.pid}/alert/new`)} className="bg-red-50 text-danger border border-red-100 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <AlertTriangle size={16} /> Flag Alert
                 </button>
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {['treatments', 'appointments', 'vitals', 'reports', 'alerts'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 whitespace-nowrap ${
                        activeTab === tab 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 min-h-[400px] p-6">
            
            {/* TREATMENTS TAB */}
            {activeTab === 'treatments' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-dark mb-4">Medical History</h3>
                    {treatments.length > 0 ? treatments.map((t) => (
                        <div key={t._id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-primary text-lg">{t.diagnosis}</h4>
                                <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <p className="text-sm text-dark mb-1">
                                <strong>Doctor:</strong> {t.doctorId?.name || 'System Admin'}
                            </p>
                            
                            <p className="text-sm text-gray-600"><strong>Symptoms:</strong> {t.symptoms}</p>
                            <p className="text-sm text-gray-600"><strong>Rx:</strong> {t.medicines}</p>
                            {t.advice && <p className="text-sm text-gray-500 italic mt-2 bg-gray-50 p-2 rounded border-l-2 border-gray-300">Note: {t.advice}</p>}
                        </div>
                    )) : <div className="text-center py-10 text-gray-400">No treatment records found.</div>}
                </div>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-dark mb-4">Upcoming Visits</h3>
                    {appointments.length > 0 ? appointments.map((a) => (
                        <div key={a._id} className="flex items-center justify-between border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Calendar size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-dark">{a.purpose}</h4>
                                    <p className="text-sm text-gray-500">{new Date(a.date).toLocaleDateString()} at {a.time}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {a.status}
                            </span>
                        </div>
                    )) : <div className="text-center py-10 text-gray-400">No appointments scheduled.</div>}
                </div>
            )}

            {/* VITALS TAB (Updated with Chart) */}
            {activeTab === 'vitals' && (
                <div>
                    <h3 className="text-lg font-bold text-dark mb-4">Vitals Overview</h3>
                    
                    {/* Chart Section */}
                    {vitals.length > 0 && (
                        <div className="mb-8">
                            <VitalsChart vitals={vitals} />
                        </div>
                    )}

                    {/* Table Section */}
                    {vitals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr><th className="p-3 rounded-tl-lg">Date</th><th className="p-3">BP (mmHg)</th><th className="p-3">Sugar (mg/dL)</th><th className="p-3 rounded-tr-lg">Heart Rate (bpm)</th></tr>
                                </thead>
                                <tbody className="divide-y">
                                    {vitals.map((v) => (
                                        <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3">{new Date(v.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 font-mono text-gray-700">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</td>
                                            <td className="p-3 font-mono text-gray-700">{v.sugar}</td>
                                            <td className="p-3 font-mono text-gray-700">{v.heartRate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <div className="text-center py-10 text-gray-400">No vitals recorded. Add some to see the chart!</div>}
                </div>
            )}

            {/* REPORTS TAB (Updated with AI Summary) */}
            {activeTab === 'reports' && (
                <div>
                    <h3 className="text-lg font-bold text-dark mb-4">Lab Reports</h3>
                    {reports.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {reports.map((r) => (
                                <div key={r._id} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg flex-shrink-0"><FileText size={20}/></div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-dark truncate">{r.reportTitle}</p>
                                            <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 flex-shrink-0">
                                        {/* AI SUMMARIZE BUTTON */}
                                        <button 
                                            onClick={() => handleAISummary(r.fileName)} 
                                            className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors flex items-center gap-1"
                                            disabled={summaryModal?.status === 'loading'}
                                        >
                                            <Sparkles size={14} /> Summarize
                                        </button>
                                        
                                        <a 
                                            href={`http://localhost:5000/uploads/reports/${r.fileName}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-primary bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                             ))}
                        </div>
                    ) : <div className="text-center py-10 text-gray-400">No reports uploaded.</div>}
                </div>
            )}

            {/* ALERTS TAB */}
            {activeTab === 'alerts' && (
                <div>
                    <h3 className="text-lg font-bold text-dark mb-4">Critical Alerts</h3>
                    {alerts.length > 0 ? alerts.map((a) => (
                        <div key={a._id} className={`border-l-4 ${a.level === 'High' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'} p-4 rounded-r-xl mb-3 transition-all hover:shadow-sm`}>
                            <div className="flex justify-between">
                                <h4 className={`font-bold ${a.level === 'High' ? 'text-red-700' : 'text-yellow-700'}`}>{a.type}</h4>
                                <span className="text-xs opacity-70">{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm mt-1 text-gray-800">{a.message}</p>
                        </div>
                    )) : <div className="text-center py-10 text-gray-400">No alerts found.</div>}
                </div>
            )}

        </div>
      </div>

      {/* AI Summary Modal */}
      {summaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100">
                <div className={`p-6 border-b border-gray-100 ${summaryModal.status === 'error' ? 'bg-red-50' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
                    <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                        {summaryModal.status === 'loading' ? <span className="animate-spin text-purple-600"><Sparkles size={20}/></span> : <Sparkles size={20} className="text-purple-600"/>}
                        {summaryModal.title}
                    </h2>
                </div>
                
                <div className="p-6">
                    {summaryModal.status === 'loading' && (
                        <div className="text-center py-8">
                            <div className="animate-pulse flex space-x-4 justify-center mb-4">
                                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                            </div>
                            <p className="text-gray-500 text-sm">Analyzing document structure...</p>
                        </div>
                    )}
                    
                    {summaryModal.status === 'complete' && (
                        <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {summaryModal.summary}
                        </div>
                    )}
                    
                    {summaryModal.status === 'error' && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
                            {summaryModal.summary}
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setSummaryModal(null)} 
                        disabled={summaryModal.status === 'loading'}
                        className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
                    >
                        Close Summary
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;