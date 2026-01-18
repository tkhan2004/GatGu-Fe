import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function CameraSetupPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [settings, setSettings] = useState({
        yawnThreshold: 3,
        phoneUsageDuration: 5, // seconds
        distractionDuration: 3, // seconds
        headDropDuration: 3, // seconds
        eyeClosureDuration: 3, // seconds
        enableVoiceAlert: true,
        enableSoundAlert: true,
        enableEmergencyContact: true
    });

    useEffect(() => {
        // Load saved settings
        const savedSettings = localStorage.getItem('detectionSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }

        // Initialize camera
        initCamera();

        return () => {
            console.log('🔴 CameraSetupPage cleanup - stopping camera');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log('🔴 Stopped camera track:', track.label);
                });
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setCameraReady(true);
            }
        } catch (error) {
            console.error('Camera error:', error);
            setCameraError('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.');
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveAndContinue = () => {
        // Save settings to localStorage
        localStorage.setItem('detectionSettings', JSON.stringify(settings));

        // Navigate to monitoring
        navigate('/monitoring');
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">videocam</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Thiết lập Camera</h2>
                    </div>
                    <button
                        onClick={() => navigate('/driver-dashboard')}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chuẩn bị hành trình</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kiểm tra camera và tùy chỉnh cài đặt cảnh báo</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Camera Preview */}
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Xem trước Camera</h3>

                        {cameraError ? (
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                <div className="text-center p-6">
                                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                                    <p className="text-red-600 dark:text-red-400">{cameraError}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    playsInline
                                    muted
                                />
                                {cameraReady && (
                                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-600 px-3 py-1.5 rounded-full">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                        </span>
                                        <span className="text-white text-xs font-bold">SẴN SÀNG</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Hướng dẫn</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        Đảm bảo khuôn mặt của bạn nằm trong khung hình và có đủ ánh sáng
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Settings */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ngưỡng Cảnh báo</h3>

                            <div className="space-y-4">
                                {/* Yawn Threshold */}
                                <div>
                                    <label className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Số lần ngáp</span>
                                        <span className="text-sm font-bold text-primary">{settings.yawnThreshold} lần</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={settings.yawnThreshold}
                                        onChange={(e) => handleSettingChange('yawnThreshold', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Cảnh báo khi ngáp quá {settings.yawnThreshold} lần
                                    </p>
                                </div>

                                {/* Phone Usage Duration */}
                                <div>
                                    <label className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sử dụng điện thoại</span>
                                        <span className="text-sm font-bold text-primary">{settings.phoneUsageDuration}s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="15"
                                        value={settings.phoneUsageDuration}
                                        onChange={(e) => handleSettingChange('phoneUsageDuration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Cảnh báo khi dùng điện thoại quá {settings.phoneUsageDuration} giây
                                    </p>
                                </div>

                                {/* Distraction Duration */}
                                <div>
                                    <label className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mất tập trung</span>
                                        <span className="text-sm font-bold text-primary">{settings.distractionDuration}s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="10"
                                        value={settings.distractionDuration}
                                        onChange={(e) => handleSettingChange('distractionDuration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Cảnh báo khi quay đầu đi quá {settings.distractionDuration} giây
                                    </p>
                                </div>

                                {/* Head Drop Duration */}
                                <div>
                                    <label className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gật đầu</span>
                                        <span className="text-sm font-bold text-primary">{settings.headDropDuration}s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={settings.headDropDuration}
                                        onChange={(e) => handleSettingChange('headDropDuration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Cảnh báo khi gật đầu quá {settings.headDropDuration} giây
                                    </p>
                                </div>

                                {/* Eye Closure Duration */}
                                <div>
                                    <label className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nhắm mắt</span>
                                        <span className="text-sm font-bold text-red-600">{settings.eyeClosureDuration}s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={settings.eyeClosureDuration}
                                        onChange={(e) => handleSettingChange('eyeClosureDuration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                                    />
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
                                        ⚠️ Khẩn cấp: Gửi thông báo cho người thân khi nhắm mắt quá {settings.eyeClosureDuration} giây
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tùy chọn Cảnh báo</h3>

                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-600">record_voice_over</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Giọng nói cảnh báo</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Phát thông báo bằng giọng nói tiếng Việt</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableVoiceAlert}
                                        onChange={(e) => handleSettingChange('enableVoiceAlert', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-orange-600">volume_up</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Âm thanh cảnh báo</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Phát âm thanh khi phát hiện nguy hiểm</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableSoundAlert}
                                        onChange={(e) => handleSettingChange('enableSoundAlert', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-600">emergency</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Thông báo khẩn cấp</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Gửi tin nhắn cho người thân khi nguy hiểm</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableEmergencyContact}
                                        onChange={(e) => handleSettingChange('enableEmergencyContact', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                                    />
                                </label>
                            </div>
                        </Card>

                        <Button
                            onClick={handleSaveAndContinue}
                            disabled={!cameraReady}
                            className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Bắt đầu giám sát</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
