import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import apiService from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPasswordPage() {
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await apiService.forgotPassword(email);
            setSent(true);
            showSuccess('Mã xác nhận đã được gửi đến email của bạn');
        } catch (error) {
            console.error('Error sending reset code:', error);
            showError('Không thể gửi mã xác nhận. Vui lòng kiểm tra email');
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
                    {!sent ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">
                                        lock_reset
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Nhập email của bạn để nhận mã xác nhận
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
                                    mark_email_read
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Kiểm tra email của bạn
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Chúng tôi đã gửi mã xác nhận đến <strong>{email}</strong>
                            </p>
                            <Link
                                to="/reset-password"
                                state={{ email }}
                                className="inline-block w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors text-center"
                            >
                                Tiếp tục đặt lại mật khẩu
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
