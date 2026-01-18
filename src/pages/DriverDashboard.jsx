import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import CalendarStats from '../components/dashboard/CalendarStats';

export default function DriverDashboard() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalDetections: 0,
        totalDurationMinutes: 0,
        detectionBreakdown: {},
        recentTrips: []
    });
    const [durations, setDurations] = useState({
        todayHours: 0,
        weekHours: 0,
        monthHours: 0,
        yearHours: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch statistics summary
            const summaryData = await apiService.getStatisticsSummary();
            setStats({
                totalTrips: summaryData.total_trips || 0,
                totalDetections: summaryData.total_detections || 0,
                totalDurationMinutes: summaryData.total_duration_minutes || 0,
                detectionBreakdown: summaryData.detection_breakdown || {},
                recentTrips: summaryData.recent_trips || []
            });

            // Fetch driving durations
            const durationsData = await apiService.getDrivingStats();
            setDurations({
                todayHours: durationsData.today_hours || 0,
                weekHours: durationsData.week_hours || 0,
                monthHours: durationsData.month_hours || 0,
                yearHours: durationsData.year_hours || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <Sidebar />

            <main className="lg:ml-64 min-h-screen p-4 lg:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Driver Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sẵn sàng bắt đầu hành trình của bạn</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => {
                                document.documentElement.classList.toggle('dark');
                                setDarkMode(!darkMode);
                            }}
                        >
                            <span className="material-icons-round dark:hidden">dark_mode</span>
                            <span className="material-icons-round hidden dark:block">light_mode</span>
                        </button>
                        <button className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-icons-round">notifications</span>
                            {stats.totalDetections > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background-light dark:border-background-dark"></span>
                            )}
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.full_name || 'Driver'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {user?.full_name?.charAt(0) || 'D'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-icons-round text-green-600">directions_car</span>
                                        Bắt đầu hành trình mới
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Sẵn sàng giám sát buồn ngủ real-time khi lái xe</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 mt-2 md:mt-0">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                    Chưa bắt đầu
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-slate-200 dark:text-slate-700" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-2">play_circle</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">Sẵn sàng</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500 font-medium">Nhấn để bắt đầu</p>
                                </div>
                                <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-primary">
                                            <span className="material-icons-round">info</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hệ thống sẵn sàng</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click nút bên dưới để bắt đầu giám sát buồn ngủ real-time</p>
                                        </div>
                                    </div>
                                    <Link to="/camera-setup" className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group">
                                        <span className="material-icons-round">play_arrow</span>
                                        <span>Bắt đầu hành trình</span>
                                        <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thống kê lái xe</h2>
                                <button
                                    onClick={fetchDashboardData}
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    <span className="material-icons-round text-sm">refresh</span>
                                    Làm mới
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Hôm nay</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{durations.todayHours.toFixed(2)}h</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Tuần này</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{durations.weekHours.toFixed(2)}h</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Tháng này</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{durations.monthHours.toFixed(2)}h</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Năm nay</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{durations.yearHours.toFixed(2)}h</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-round text-blue-500">route</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Tổng chuyến</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTrips}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-round text-orange-500">warning</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Cảnh báo</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDetections}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-round text-green-500">schedule</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Tổng thời gian</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatDuration(stats.totalDurationMinutes)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <CalendarStats />
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-900 dark:text-white">Phân tích cảnh báo</h2>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(stats.detectionBreakdown).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${type === 'drowsy' || type === 'head drop' ? 'bg-red-500' :
                                                type === 'yawn' ? 'bg-yellow-500' :
                                                    type === 'phone' || type === 'smoking' ? 'bg-orange-500' :
                                                        'bg-green-500'
                                                }`}></span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{type}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{count}</span>
                                    </div>
                                ))}
                                {Object.keys(stats.detectionBreakdown).length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>
                                )}
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-900 dark:text-white">Chuyến đi gần đây</h2>
                                <Link to="/history" className="text-xs text-primary font-medium hover:underline">Xem tất cả</Link>
                            </div>
                            <div className="space-y-3">
                                {stats.recentTrips.slice(0, 5).map((trip, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <span className="material-icons-round text-primary text-lg">route</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Chuyến #{trip.trip_id}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(trip.start_time).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {stats.recentTrips.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">Chưa có chuyến đi nào</p>
                                )}
                            </div>
                        </Card>

                        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-4 text-white relative overflow-hidden">
                            <img alt="Banner Pattern" className="absolute top-0 right-0 h-full w-auto opacity-10 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUqs6tmqRFSWykdDhvb0t_l8uJywyf9uIHBg_Ar7jvEcfbMvmD2lo4aZEFkH4hY4pTcN6EhZBjOWfiRNq3JV7zzANJFI5SKNzUjIeYop1VIsTp_PnRcrSBxanqFzIrme6xTvxDXaseCnOEywsCv0EPhesUgE-OtXNo9MgJNETJuRmVGdB1gcEANa9Claubuky18C1wcBGz6aQei59Tq6Lda-5zMR1z9JFHb6hiMMtbXW8MowQsM__lSHEDRxuB8qG1ln7TixMohIkO" />
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-1">Gật Gù Pro</h3>
                                <p className="text-xs text-blue-100 mb-3">Nâng cấp để có phân tích nâng cao và lưu trữ cloud.</p>
                                <button className="bg-white text-primary text-xs font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">Nâng cấp ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
