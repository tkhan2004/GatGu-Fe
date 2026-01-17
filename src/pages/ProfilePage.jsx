import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiService from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ProfilePage() {
    const { user, updateUserData } = useAuth();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone_number: user.phone_number || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number if provided
        if (formData.phone_number) {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(formData.phone_number)) {
                showError('Số điện thoại không hợp lệ (10-11 chữ số)');
                return;
            }
        }

        try {
            setLoading(true);
            const updatedUser = await apiService.updateUser(formData);
            updateUserData(updatedUser);
            showSuccess('Đã cập nhật thông tin');
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <Sidebar />

            <main className="lg:ml-64 p-4 lg:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Quản lý thông tin tài khoản của bạn
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Info Card */}
                        <Card>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {user?.full_name || 'User'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Tham gia: {new Date(user?.created_at).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Email không thể thay đổi
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Họ và tên
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Nguyễn Văn A"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Số điện thoại
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="0987654321"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Avatar URL
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.avatar_url}
                                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Link ảnh đại diện (tùy chọn)
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </form>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Thông tin tài khoản
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                                            badge
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                User ID
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                #{user?.user_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                                            verified
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Trạng thái
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                                Đã xác thực
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-2 border-red-200 dark:border-red-900">
                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                                Vùng nguy hiểm
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                                            lock_reset
                                        </span>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Đổi mật khẩu
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Thay đổi mật khẩu đăng nhập
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">
                                        chevron_right
                                    </span>
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                                            delete_forever
                                        </span>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Xóa tài khoản
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Xóa vĩnh viễn tài khoản và dữ liệu
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
