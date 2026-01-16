import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegistrationStep1() {
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { showSuccess, showError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await register({
            email: formData.email,
            full_name: formData.fullname,
            phone_number: formData.phone,
            password: formData.password,
        });

        if (result.success) {
            showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            showError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-50 transition-colors duration-200 antialiased overflow-hidden">
            <div className="flex h-screen w-full flex-row">
                <div className="hidden lg:flex w-[40%] xl:w-[35%] flex-col relative bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#1a71ff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    <div className="relative z-10 flex flex-col h-full p-12 justify-between">
                        <div>
                            <Link to="/" className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-4xl">directions_car</span>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gật Gù</h1>
                            </Link>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Anti-Drowsiness Monitor</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center py-8">
                            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 relative group">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPPwUXtdJIuH8Mq62K1lx_JxCURM85zFRTr0WvqrXnk_5tbGcfthuJDyGY6U1Kg2PvRNYZObDDsUm1xuV2of4G0Nl245zOaV7PZFccKm82IXsPu4caZo6UKcxlWOAGt8J4IcDGbeZ2f_wpluNWvCzQVA7sim0rU-Ox_pya9xg4n-OR9oCADIyMUm_VvLNxCjOFewgjAHG1V38P7Pons_hRMNF5GJoBjsBEZDw4JYagjwKCQrgasVHT1oXAfLNT5YuxQ6j2U9fqRPhJ')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply"></div>
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-white/30">
                                        <span className="material-symbols-outlined text-[16px]">security</span>
                                        Real-time Protection
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">Stay Awake,<br />Arrive Safe.</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Join thousands of drivers who trust Gật Gù to monitor their alertness and ensure every journey ends safely at home.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col h-full overflow-y-auto relative bg-background-light dark:bg-background-dark">
                    <div className="lg:hidden p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-2xl">directions_car</span>
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Gật Gù</span>
                        </Link>
                        <Link to="/login" className="text-sm text-primary font-medium">Log in</Link>
                    </div>
                    <div className="flex-1 flex flex-col items-center py-10 px-6 sm:px-12 lg:px-24 xl:px-32">
                        <div className="w-full max-w-lg space-y-8 my-auto">
                            <div className="flex flex-col gap-2 mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-primary tracking-wide uppercase">Step 1 of 3</span>
                                    <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">Personal Info</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-primary w-1/3 rounded-full shadow-[0_0_10px_rgba(26,113,255,0.5)]"></div>
                                    <div className="h-full w-2/3 bg-transparent"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create your account</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">Please provide your details to begin monitoring your safety.</p>
                            </div>

                            <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
                                <Input
                                    icon="person"
                                    id="fullname"
                                    label="Full Name"
                                    placeholder="e.g. Nguyen Van A"
                                    type="text"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                    required
                                />

                                <Input
                                    icon="email"
                                    id="email"
                                    label="Email"
                                    placeholder="your@email.com"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />

                                <Input
                                    icon="call"
                                    id="phone"
                                    label="Phone Number"
                                    placeholder="+84 ..."
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />

                                <Input
                                    icon="lock"
                                    id="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />

                                <div className="pt-4 space-y-4">
                                    <Button className="w-full group" size="lg" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                                                Đang đăng ký...
                                            </>
                                        ) : (
                                            <>
                                                <span className="absolute right-4 inset-y-0 flex items-center pl-3">
                                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                </span>
                                                Continue to Vehicle Setup
                                            </>
                                        )}
                                    </Button>
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Already have an account?{' '}
                                            <Link className="font-semibold text-primary hover:text-primary-dark transition-colors" to="/login">Log in</Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="w-full max-w-lg mt-12 flex justify-center gap-6 text-xs text-slate-400">
                            <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
                            <span>·</span>
                            <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
