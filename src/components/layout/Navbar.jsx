import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ variant = 'default' }) {
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return isActive
            ? "text-primary dark:text-white border-b-2 border-primary font-semibold transition-colors px-1 pt-1"
            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium px-1 pt-1";
    };

    if (variant === 'landing') {
        return (
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-background-dark/80 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img
                                alt="Gật Gù Logo"
                                className="h-16 w-auto"
                                src="Logo (2).png"
                            />
                            {/* <span className="ml-2 text-xl font-bold text-primary dark:text-white">Gật Gù</span> */}
                        </Link>
                        <div className="hidden md:flex space-x-8">
                            <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium" href="#features">
                                Tính năng
                            </a>
                            <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium" href="#how-it-works">
                                Hoạt động
                            </a>
                            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium" to="/driver-dashboard">
                                Dashboard
                            </Link>
                            <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium" to="/login">
                                Đăng nhập
                            </Link>
                        </div>
                        <div className="hidden md:flex">
                            <Link className="bg-primary hover:bg-opacity-90 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl" to="/registration">
                                Đăng ký ngay
                            </Link>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none" type="button">
                                <span className="material-icons">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    if (variant === 'registration') {
        return (
            <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white group cursor-pointer">
                        <div className="w-8 h-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined text-[20px]">directions_car</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">Gật Gù</h2>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">Already have an account?</span>
                        <Link to="/login" className="flex items-center justify-center h-9 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-background-dark/80 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <img
                            alt="Gật Gù Logo"
                            className="h-10 w-auto"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw98GqTGeT_3A0xKVE844nQs3NV8XrRVgvTYAs9pW4DYV02zdP3W-DpM6vlR0rFw8NIw4hnG3Jl7Jb_3SNcGZyIqFXeW7Zf4EwmEMHKjKa7fJkBGfXLVSAs828uh01h36albsonoXo7LIGd7KmLlGgkmc2pJiJt-Qzgv2q2zmxQaYLR7Ck7C7Ot2mdRUwbENHIeaEpC4sEV2ZucDIJZG4OmX94DKGwlc0j2SglzOdgKzUi9LzVIHBNS14ki3Q7PtOKFt6yPfOmtZOm"
                        />
                        <span className="ml-2 text-xl font-bold text-primary dark:text-white">Gật Gù</span>
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <Link className={getLinkClass('/driver-dashboard')} to="/driver-dashboard">
                            Tổng quan
                        </Link>
                        <Link className={getLinkClass('/monitoring')} to="/monitoring">
                            Giám sát
                        </Link>
                        <Link className={getLinkClass('/history')} to="/history">
                            Lịch sử
                        </Link>
                        <Link className={getLinkClass('/camera-setup')} to="/camera-setup">
                            Cài đặt
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300">System Ready</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-xl">account_circle</span>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none" type="button">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
