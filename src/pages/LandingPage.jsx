import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
    const { isAuthenticated, initializing } = useAuth();

    // Show loading while checking auth
    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
        return <Navigate to="/driver-dashboard" replace />;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            <Navbar variant="landing" />

            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-sm font-semibold mb-6">
                                <span className="material-icons text-sm mr-1">web</span>
                                Web Application - Sử dụng ngay trên trình duyệt
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                                Hệ thống giám sát <br className="hidden lg:block" />
                                <span className="text-primary relative">
                                    buồn ngủ khi lái xe
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                        <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                                Giải pháp web app giúp phát hiện dấu hiệu buồn ngủ real-time, cảnh báo kịp thời và theo dõi thống kê lái xe của bạn.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center group" to="/login">
                                    Đăng nhập ngay
                                    <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                                <Link className="bg-white dark:bg-secondary-dark text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center" to="/registration">
                                    Tạo tài khoản miễn phí
                                </Link>
                            </div>
                            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                ✓ Không cần cài đặt &nbsp;&nbsp; ✓ Sử dụng ngay trên web &nbsp;&nbsp; ✓ Miễn phí
                            </p>
                        </div>

                        <div className="relative">
                            <div className="bg-white dark:bg-secondary-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <span className="text-white text-sm font-mono ml-4">gatgu-app.web</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-white text-xs font-semibold">LIVE</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                                    <div className="bg-black rounded-xl overflow-hidden aspect-video mb-4 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-48 h-56 border-2 border-primary/70 rounded-xl">
                                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                                                <div className="absolute top-[35%] left-[30%] w-2 h-2 bg-green-400 rounded-full"></div>
                                                <div className="absolute top-[35%] right-[30%] w-2 h-2 bg-green-400 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                                        <div className="absolute top-3 right-3 text-green-400 font-mono text-xs bg-black/60 px-2 py-1 rounded">FPS: 30</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Eye Closure</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">0.15s</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Yawn</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">0/min</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                            <div className="text-lg font-bold text-green-600">Alert</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-secondary-dark p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <span className="material-icons text-green-600 dark:text-green-400">check_circle</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Tỉnh táo</div>
                                        <div className="text-xs text-gray-500">Monitoring active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-secondary-dark" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Cách sử dụng</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Đơn giản. Nhanh chóng. Hiệu quả.
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                            Chỉ cần 3 bước để bắt đầu sử dụng hệ thống giám sát
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                step: 1,
                                icon: 'login',
                                title: 'Đăng nhập vào hệ thống',
                                description: 'Tạo tài khoản hoặc đăng nhập vào web app. Không cần cài đặt, sử dụng ngay trên trình duyệt.'
                            },
                            {
                                step: 2,
                                icon: 'videocam',
                                title: 'Bật camera và bắt đầu',
                                description: 'Cho phép truy cập camera, hệ thống AI sẽ tự động nhận diện khuôn mặt và bắt đầu giám sát.'
                            },
                            {
                                step: 3,
                                icon: 'analytics',
                                title: 'Theo dõi và nhận cảnh báo',
                                description: 'Nhận cảnh báo real-time khi có dấu hiệu buồn ngủ, xem thống kê và lịch sử lái xe của bạn.'
                            }
                        ].map((item) => (
                            <div key={item.step} className="relative bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white shadow-lg text-xl font-bold">{item.step}</div>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="flex justify-center mb-6">
                                        <span className="material-icons text-6xl text-blue-400">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background-light dark:bg-background-dark" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Tính năng của Web App
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            Hệ thống giám sát toàn diện với công nghệ AI tiên tiến
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'visibility', title: 'Giám sát Real-time', description: 'Phát hiện dấu hiệu buồn ngủ ngay lập tức qua camera web.' },
                            { icon: 'query_stats', title: 'Thống kê chi tiết', description: 'Xem lịch sử lái xe và phân tích mức độ tỉnh táo qua biểu đồ.' },
                            { icon: 'notifications_active', title: 'Cảnh báo tức thì', description: 'Âm thanh và thông báo cảnh báo khi phát hiện nguy hiểm.' },
                            { icon: 'cloud', title: 'Lưu trữ đám mây', description: 'Dữ liệu được đồng bộ và lưu trữ an toàn trên cloud.' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 text-primary dark:text-blue-300">
                                    <span className="material-icons">{feature.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                        Sẵn sàng bắt đầu?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Đăng ký ngay để trải nghiệm hệ thống giám sát buồn ngủ miễn phí
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all" to="/registration">
                            Tạo tài khoản miễn phí
                        </Link>
                        <Link className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all" to="/login">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
