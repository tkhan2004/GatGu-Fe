export default function Card({ children, className = '', ...props }) {
    return (
        <div
            className={`bg-white dark:bg-secondary-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
