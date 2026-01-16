export default function Input({ label, icon, error, className = '', ...props }) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="relative group/input">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                )}
                <input
                    className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-shadow shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-slate-600 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
        </div>
    );
}
