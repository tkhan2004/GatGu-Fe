import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="fixed top-0 left-0 z-50 h-screen w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 lg:translate-x-0 -translate-x-full shadow-lg lg:shadow-none flex flex-col justify-between">
            <div>
                <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <img
                            alt="Gật Gù Logo"
                            className="h-10 w-auto object-contain"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBka17BetbZ3lPirc_SiDMAfc5XnWKMZ1H_YxthGy6-CnIjTqk0GumpGLrvtF-kMeka5yuhTMnnLdu_R-iAg_SqyWsxBTnk9fWEBYPFYpVgXzl9jnQSMAjXrKvXeqpL6ewaj04UjPa8a9p8YmeUI21IpvPQCsZCZzYU9cKOfKmQGMYMnDaWcur_sYAb_50FDBbEDk7BccXEuy6JCbjwhARiHzF3O7eZXoA-3zjMGQzXTeHVoj2XWOW2LH2j8g8Wwy2MRKzmv_lAC5jO"
                        />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Gật Gù</span>
                    </div>
                </div>
                <nav className="p-4 space-y-2 mt-4">
                    <Link className="flex items-center gap-4 px-4 py-3 bg-primary/10 text-primary rounded-xl transition-colors" to="/driver-dashboard">
                        <span className="material-icons-round">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors" to="/history">
                        <span className="material-icons-round">history</span>
                        <span className="font-medium">History</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors" to="/monitoring">
                        <span className="material-icons-round">videocam</span>
                        <span className="font-medium">Monitoring</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors" to="/vehicle-setup">
                        <span className="material-icons-round">settings</span>
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                >
                    <span className="material-icons-round">logout</span>
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
