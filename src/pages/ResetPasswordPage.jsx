import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import apiService from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        code: '',
        new_password: '',
        confirm_password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.new_password !== formData.confirm_password) {
            showError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.new_password.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setLoading(true);
            await apiService.resetPassword(formData.email, formData.new_password, formData.code);
            showSuccess('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Error resetting password:', error);
            showError('Mã xác nhận không đúng hoặc đã hết hạn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">directions_car</span>
                        </div>
                        <span className="text-2xl font-bold">Gật Gù</span>
                    </Link>
                </div>

                <Card>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-purple-600 dark:text-purple-400">
                                key
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Nhập mã xác nhận và mật khẩu mới
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your.email@example.com"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Mã xác nhận
                            </label>
                            <Input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="123456"
                                required
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Nhập mã 6 số đã gửi đến email
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <Input
                                type="password"
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <Link
                            to="/forgot-password"
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                            Chưa nhận được mã? Gửi lại
                        </Link>
                        <Link
                            to="/login"
                            className="block text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
