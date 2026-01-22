import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return isActive
            ? "flex items-center gap-4 px-4 py-3 bg-primary/10 text-primary rounded-xl transition-colors font-bold"
            : "flex items-center gap-4 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors font-medium";
    };

    return (
        <aside className="fixed top-0 left-0 z-50 h-screen w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 lg:translate-x-0 -translate-x-full shadow-lg lg:shadow-none flex flex-col justify-between">
            <div>
                <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <img
                            alt="Gật Gù Logo"
                            className="h-18 w-auto object-contain"
                            src="/Logo (2).png"
                        />
                        {/* <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Gật Gù</span> */}
                    </div>
                </div>
                <nav className="p-4 space-y-2 mt-4">
                    <Link className={getLinkClass('/driver-dashboard')} to="/driver-dashboard">
                        <span className="material-icons-round">dashboard</span>
                        <span>Tổng quan</span>
                    </Link>
                    <Link className={getLinkClass('/monitoring')} to="/monitoring">
                        <span className="material-icons-round">videocam</span>
                        <span>Giám sát</span>
                    </Link>
                    <Link className={getLinkClass('/history')} to="/history">
                        <span className="material-icons-round">history</span>
                        <span>Lịch sử</span>
                    </Link>
                    <Link className={getLinkClass('/camera-setup')} to="/camera-setup">
                        <span className="material-icons-round">settings</span>
                        <span>Cài đặt Camera</span>
                    </Link>
                    <Link className={getLinkClass('/emergency-contacts')} to="/emergency-contacts">
                        <span className="material-icons-round">contact_emergency</span>
                        <span>Liên hệ khẩn cấp</span>
                    </Link>
                </nav>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                >
                    <span className="material-icons-round">logout</span>
                    <span className="font-medium">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
