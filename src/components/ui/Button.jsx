export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const baseStyles = 'font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 focus:ring-primary',
        secondary: 'bg-white dark:bg-secondary-dark text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
        danger: 'bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger/30 focus:ring-danger',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
