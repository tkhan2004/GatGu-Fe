import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationStep1 from './pages/RegistrationStep1';
import VehicleSetup from './pages/VehicleSetup';
import MonitoringDashboard from './pages/MonitoringDashboard';
import DriverDashboard from './pages/DriverDashboard';
import HistoryPage from './pages/HistoryPage';
import CameraSetupPage from './pages/CameraSetupPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import './styles/index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registration" element={<RegistrationStep1 />} />

                        {/* Protected routes - require authentication */}
                        <Route
                            path="/vehicle-setup"
                            element={
                                <ProtectedRoute>
                                    <VehicleSetup />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/monitoring"
                            element={
                                <ProtectedRoute>
                                    <MonitoringDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver-dashboard"
                            element={
                                <ProtectedRoute>
                                    <DriverDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute>
                                    <HistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/camera-setup"
                            element={
                                <ProtectedRoute>
                                    <CameraSetupPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/emergency-contacts"
                            element={
                                <ProtectedRoute>
                                    <EmergencyContactsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all - redirect to landing */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
