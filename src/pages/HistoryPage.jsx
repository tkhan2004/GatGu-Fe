import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function HistoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);
    const [period, setPeriod] = useState('THIS_MONTH');

    useEffect(() => {
        fetchTrips();
    }, [period]);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyTrips(50, period);
            setTrips(data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTripDetails = async (tripId) => {
        try {
            const data = await apiService.getTripDetails(tripId);
            setTripDetails(data);
            setSelectedTrip(tripId);
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    const formatDuration = (start, end) => {
        if (!end) return 'Đang diễn ra';
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    const getStatusBadge = (status) => {
        const variants = {
            'ONGOING': 'warning',
            'COMPLETED': 'success',
            'CANCELLED': 'danger'
        };
        return variants[status] || 'default';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <Sidebar />

            <main className="lg:ml-64 p-4 lg:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử hành trình</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xem lại các chuyến đi của bạn</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg px-4 py-2"
                        >
                            <option value="TODAY">Hôm nay</option>
                            <option value="THIS_WEEK">Tuần này</option>
                            <option value="THIS_MONTH">Tháng này</option>
                            <option value="THIS_YEAR">Năm nay</option>
                        </select>
                        <button
                            onClick={() => navigate('/driver-dashboard')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trips List */}
                    <div className="lg:col-span-1">
                        <Card className="p-0 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="font-bold text-gray-900 dark:text-white">Danh sách chuyến đi</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trips.length} chuyến</p>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {trips.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <span className="material-icons-round text-6xl text-gray-300 dark:text-gray-600 mb-4">route</span>
                                        <p className="text-gray-500 dark:text-gray-400">Chưa có chuyến đi nào</p>
                                    </div>
                                ) : (
                                    <div className="p-2 space-y-2">
                                        {trips.map((trip) => (
                                            <button
                                                key={trip.trip_id}
                                                onClick={() => fetchTripDetails(trip.trip_id)}
                                                className={`w-full text-left p-4 rounded-lg transition-all ${selectedTrip === trip.trip_id
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-icons-round text-primary">route</span>
                                                        <span className="font-semibold text-gray-900 dark:text-white">Chuyến #{trip.trip_id}</span>
                                                    </div>
                                                    <Badge variant={getStatusBadge(trip.status)}>
                                                        {trip.status === 'ONGOING' ? 'Đang đi' : trip.status === 'COMPLETED' ? 'Hoàn thành' : 'Hủy'}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                                    <p className="flex items-center gap-1">
                                                        <span className="material-icons-round text-xs">schedule</span>
                                                        {new Date(trip.start_time).toLocaleString('vi-VN')}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <span className="material-icons-round text-xs">timer</span>
                                                        {formatDuration(trip.start_time, trip.end_time)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Trip Details */}
                    <div className="lg:col-span-2">
                        {!selectedTrip ? (
                            <Card className="p-12 text-center">
                                <span className="material-icons-round text-8xl text-gray-300 dark:text-gray-600 mb-4">info</span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chọn một chuyến đi</h3>
                                <p className="text-gray-500 dark:text-gray-400">Chọn chuyến đi từ danh sách bên trái để xem chi tiết</p>
                            </Card>
                        ) : !tripDetails ? (
                            <Card className="p-12 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Đang tải chi tiết...</p>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                <Card>
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chuyến #{tripDetails.trip_id}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(tripDetails.start_time).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusBadge(tripDetails.status)} className="text-sm px-4 py-2">
                                            {tripDetails.status === 'ONGOING' ? 'Đang diễn ra' :
                                                tripDetails.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-icons-round text-blue-600 dark:text-blue-400">schedule</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">Thời gian</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {formatDuration(tripDetails.start_time, tripDetails.end_time)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-icons-round text-red-600 dark:text-red-400">warning</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">Cảnh báo</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {tripDetails.detection_logs?.length || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-icons-round text-green-600 dark:text-green-400">check_circle</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">Trạng thái</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {tripDetails.status === 'COMPLETED' ? 'An toàn' : 'Đang đi'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-icons-round text-purple-600 dark:text-purple-400">location_on</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">Vị trí</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {tripDetails.detection_logs?.length > 0 ? 'Có' : 'Không'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nhật ký phát hiện</h3>
                                    {!tripDetails.detection_logs || tripDetails.detection_logs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <span className="material-icons-round text-6xl text-green-300 dark:text-green-600 mb-4">check_circle</span>
                                            <p className="text-gray-500 dark:text-gray-400">Không có cảnh báo nào - Lái xe an toàn!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {tripDetails.detection_logs.map((log, idx) => (
                                                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${log.event_type === 'drowsy' || log.event_type === 'head drop' ? 'bg-red-100 dark:bg-red-900/30' :
                                                            log.event_type === 'yawn' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                                                'bg-orange-100 dark:bg-orange-900/30'
                                                        }`}>
                                                        <span className={`material-icons-round ${log.event_type === 'drowsy' || log.event_type === 'head drop' ? 'text-red-600 dark:text-red-400' :
                                                                log.event_type === 'yawn' ? 'text-yellow-600 dark:text-yellow-400' :
                                                                    'text-orange-600 dark:text-orange-400'
                                                            }`}>
                                                            {log.event_type === 'phone' ? 'phone_iphone' :
                                                                log.event_type === 'smoking' ? 'smoking_rooms' :
                                                                    log.event_type === 'yawn' ? 'face' : 'warning'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{log.event_type}</h4>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Độ tin cậy: {(log.confidence * 100).toFixed(0)}%
                                                        </p>
                                                        {log.location && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                                                                <span className="material-icons-round text-xs">location_on</span>
                                                                {log.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
