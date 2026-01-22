import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, initializing } = useAuth();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already logged in
    if (isAuthenticated && !initializing) {
        return <Navigate to="/driver-dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            showSuccess('Đăng nhập thành công!');
            navigate('/driver-dashboard');
        } else {
            showError(result.error || 'Đăng nhập thất bại');
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display transition-colors duration-200 min-h-screen flex flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <img 
                            src="/Logo (2).png" 
                            alt="Gật Gù Logo" 
                            className="h-16 w-auto object-contain" 
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">Chưa có tài khoản?</span>
                        <Link to="/registration" className="flex items-center justify-center h-9 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Split Layout */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Column: Form Section */}
                <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative z-10">
                    <div className="px-6 py-8 md:px-12 md:py-12 flex flex-col flex-1 max-w-lg mx-auto lg:mx-0 w-full">
                        {/* Header */}
                        <div className="mb-8 animate-fade-in-up">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                                Chào mừng trở lại
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                Đăng nhập để tiếp tục sử dụng hệ thống giám sát buồn ngủ thông minh
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Mật khẩu
                                    </label>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Ghi nhớ đăng nhập</span>
                                    </label>
                                    <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Đang đăng nhập...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Đăng nhập</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </div>
                                    )}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500 dark:text-slate-400">
                                            Hoặc đăng nhập với
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Facebook</span>
                                    </button>
                                </div>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Chưa có tài khoản?{' '}
                                    <Link to="/registration" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Scenic Image */}
                <div className="hidden lg:flex lg:w-7/12 xl:w-2/3 relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                        <div className="max-w-2xl">
                            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-5xl text-primary">shield</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                                Lái xe an toàn hơn với AI
                            </h2>

                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Hệ thống giám sát buồn ngủ thông minh giúp bạn luôn tỉnh táo trên mọi hành trình
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
                                        <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">check_circle</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Real-time</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Giám sát liên tục</p>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                                        <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">psychology</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">AI Thông minh</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Độ chính xác cao</p>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                                        <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">notifications_active</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Cảnh báo</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Kịp thời chính xác</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl"></div>
                </div>
            </main>
        </div>
    );
}
