import { useState, useEffect, useRef, useCallback } from 'react';

const getVietnameseLabel = (label) => {
    const labels = {
        'awake': 'Tỉnh táo',
        'distracted': 'Mất tập trung',
        'drowsy': 'Buồn ngủ',
        'head drop': 'Gục đầu',
        'phone': 'Dùng điện thoại',
        'smoking': 'Hút thuốc',
        'yawn': 'Ngáp'
    };
    return labels[label] || label;
};
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CameraDetection from '../components/monitoring/CameraDetection';
import apiService from '../services/api';

export default function MonitoringDashboard() {
    const [currentTrip, setCurrentTrip] = useState(null);
    const [detectionStats, setDetectionStats] = useState({
        awake: 0,
        distracted: 0,
        drowsy: 0,
        headDrop: 0,
        phone: 0,
        smoking: 0,
        yawn: 0,
        totalDetections: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const { showSuccess, showWarning, showError } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        startTrip();
    }, []);

    const startTrip = async () => {
        try {
            const trip = await apiService.startTrip();
            setCurrentTrip(trip);
            showSuccess('Đã bắt đầu hành trình!');
        } catch (error) {
            console.error('Error starting trip:', error);
            showError('Không thể bắt đầu hành trình');
        }
    };

    const [isCritical, setIsCritical] = useState(false);
    const [currentAlarmState, setCurrentAlarmState] = useState('NORMAL');
    const audioContextRef = useRef(null);

    // Initialize AudioContext
    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playTone = useCallback((frequency, type, duration) => {
        if (!audioContextRef.current) return;

        try {
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error('Audio play error:', e);
        }
    }, []);

    const playReminderSound = useCallback(() => {
        // Double beep
        playTone(800, 'sine', 0.1);
        setTimeout(() => playTone(800, 'sine', 0.1), 150);
    }, [playTone]);

    const playCriticalSound = useCallback(() => {
        // Siren effect
        playTone(1200, 'sawtooth', 0.3);
        setTimeout(() => playTone(1000, 'sawtooth', 0.3), 300);
        setTimeout(() => playTone(1200, 'sawtooth', 0.3), 600);
    }, [playTone]);

    const handleDetection = useCallback(async (data) => {
        if (!currentTrip) return;

        const { detections, alarmState, triggerAlarm } = data;
        setCurrentAlarmState(alarmState);

        // Update stats for each detection
        detections.forEach((detection) => {
            const { label } = detection;

            setDetectionStats(prev => {
                const newStats = { ...prev, totalDetections: prev.totalDetections + 1 };

                // Count by label type
                if (label === 'awake') newStats.awake++;
                else if (label === 'distracted') newStats.distracted++;
                else if (label === 'drowsy') newStats.drowsy++;
                else if (label === 'head drop') newStats.headDrop++;
                else if (label === 'phone') newStats.phone++;
                else if (label === 'smoking') newStats.smoking++;
                else if (label === 'yawn') newStats.yawn++;

                return newStats;
            });
        });

        // Set visual state based on Alarm State
        if (alarmState === 'ALARM_CRITICAL') {
            setIsCritical(true);
        } else {
            setIsCritical(false);
        }

        // Handle Audio Alerts (only when triggered)
        if (triggerAlarm) {
            if (alarmState === 'ALARM_CRITICAL') {
                playCriticalSound();

                // Also log to API
                try {
                    await apiService.createDetectionAutoTrip({
                        event_type: detections[0]?.label || 'drowsy',
                        confidence: detections[0]?.confidence || 0,
                        timestamp: new Date().toISOString(),
                        alarm_state: alarmState
                    });

                    showError(`⚠️ NGUY HIỂM: ${getVietnameseLabel(detections[0]?.label || 'Buồn ngủ')}!`);
                } catch (error) {
                    console.error('Error logging detection:', error);
                }
            } else if (alarmState === 'ALARM_WARNING' || alarmState === 'ALARM_CAUTION') {
                playReminderSound();
                showWarning(`⚠️ Nhắc nhở: ${getVietnameseLabel(detections[0]?.label || 'Cảnh báo')}`);
            }

            // Add to recent events
            const event = {
                type: detections[0]?.label || 'unknown',
                confidence: detections[0]?.confidence || 0,
                timestamp: new Date().toLocaleTimeString(),
                alarmState
            };
            setRecentEvents(prev => [event, ...prev].slice(0, 10));
        }
    }, [currentTrip, playCriticalSound, playReminderSound, showWarning, showError]);



    const getStatusColor = (detections) => {
        // Logic for Badge color based on recent detections or state
        if (isCritical) return 'danger';
        if (currentAlarmState === 'ALARM_WARNING' || currentAlarmState === 'ALARM_CAUTION') return 'warning';
        return 'success';
    };

    const handleEndTrip = async () => {
        try {
            await apiService.endTrip();
            showSuccess('Hành trình đã kết thúc!');
            navigate('/driver-dashboard');
        } catch (error) {
            console.error('Error ending trip:', error);
            showError('Lỗi khi kết thúc hành trình.');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 flex flex-col min-h-screen relative">
            {/* Red Screen Alarm Overlay */}
            <div className={`fixed inset-0 bg-red-600/30 z-50 pointer-events-none transition-opacity duration-300 ${isCritical ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce">
                        <h1 className="text-4xl font-black uppercase tracking-widest">CẢNH BÁO NGUY HIỂM!</h1>
                    </div>
                </div>
            </div>
            <Navbar />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Monitoring Console</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Giám sát buồn ngủ real-time với AI</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-secondary-dark px-3 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                        <span id="current-time">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="relative ring-4 ring-gray-100 dark:ring-gray-800/50 rounded-2xl overflow-hidden">
                            <CameraDetection onDetection={handleDetection} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Tỉnh táo</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{detectionStats.awake}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Buồn ngủ</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{detectionStats.drowsy}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Gật đầu</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-500">{detectionStats.headDrop}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Ngáp</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{detectionStats.yawn}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Điện thoại</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{detectionStats.phone}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Hút thuốc</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-500">{detectionStats.smoking}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Mất tập trung</p>
                                <p className="text-2xl font-bold text-orange-500 dark:text-orange-300">{detectionStats.distracted}</p>
                            </Card>
                            <Card className="p-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Tổng</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{detectionStats.totalDetections}</p>
                            </Card>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card className="relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full blur-2xl"></div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                Trạng thái hiện tại
                            </h3>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                                <div>
                                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">Đang giám sát</p>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">AI đang phân tích...</p>
                                </div>
                            </div>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Mức độ nguy hiểm</span>
                                    <Badge variant={getStatusColor(recentEvents.slice(0, 1))}>
                                        {getStatusColor(recentEvents.slice(0, 1)) === 'success' ? 'An toàn' :
                                            getStatusColor(recentEvents.slice(0, 1)) === 'warning' ? 'Cảnh báo' : 'Nguy hiểm'}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/driver-dashboard" className="flex flex-col items-center justify-center p-5 bg-white dark:bg-secondary-dark border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">dashboard</span>
                                <span className="font-bold text-sm">Dashboard</span>
                            </Link>
                            <button
                                onClick={handleEndTrip}
                                className="flex flex-col items-center justify-center p-5 bg-white dark:bg-secondary-dark border-2 border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                            >
                                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">stop_circle</span>
                                <span className="font-bold text-sm">Kết thúc</span>
                            </button>
                        </div>

                        <Card className="p-5 flex-grow flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">history</span>
                                    Sự kiện gần đây
                                </h3>
                                <span className="text-xs text-gray-500">{recentEvents.length} events</span>
                            </div>
                            <div className="space-y-3 overflow-y-auto max-h-96 custom-scrollbar">
                                {recentEvents.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">Chưa có sự kiện nào</p>
                                ) : (
                                    recentEvents.map((event, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${['drowsy', 'head drop'].includes(event.type) ? 'bg-red-100 dark:bg-red-900/30' :
                                                ['phone', 'smoking', 'distracted'].includes(event.type) ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    event.type === 'yawn' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                                        'bg-green-100 dark:bg-green-900/30'
                                                }`}>
                                                <span className={`material-symbols-outlined text-sm ${['drowsy', 'head drop'].includes(event.type) ? 'text-red-600 dark:text-red-400' :
                                                    ['phone', 'smoking', 'distracted'].includes(event.type) ? 'text-orange-600 dark:text-orange-400' :
                                                        event.type === 'yawn' ? 'text-yellow-600 dark:text-yellow-400' :
                                                            'text-green-600 dark:text-green-400'
                                                    }`}>
                                                    {event.type === 'phone' ? 'phone_iphone' :
                                                        event.type === 'smoking' ? 'smoking_rooms' :
                                                            event.type === 'yawn' ? 'face' : 'warning'}
                                                </span>
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{getVietnameseLabel(event.type)}</p>
                                                <p className="text-xs text-gray-500">{event.timestamp} • {(event.confidence * 100).toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
