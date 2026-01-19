import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import apiService from '../services/api';

export default function EmergencyContactsPage() {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        is_active: true
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await apiService.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            showError('Không thể tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingContact) {
                await apiService.updateContact(editingContact.contact_id, formData);
                showSuccess('Đã cập nhật liên hệ!');
            } else {
                await apiService.createContact(formData);
                showSuccess('Đã thêm liên hệ khẩn cấp!');
            }

            setFormData({ name: '', phone_number: '', is_active: true });
            setIsFormOpen(false);
            setEditingContact(null);
            fetchContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
            showError(editingContact ? 'Không thể cập nhật liên hệ' : 'Không thể thêm liên hệ');
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            phone_number: contact.phone_number,
            is_active: contact.is_active
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (contactId) => {
        if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;

        try {
            await apiService.deleteContact(contactId);
            showSuccess('Đã xóa liên hệ!');
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            showError('Không thể xóa liên hệ');
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', phone_number: '', is_active: true });
        setIsFormOpen(false);
        setEditingContact(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <Sidebar />

            <main className="lg:ml-64 min-h-screen p-4 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Liên hệ khẩn cấp</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Quản lý số điện thoại người thân để nhận thông báo khi có sự cố
                    </p>
                </header>

                <div className="max-w-4xl">
                    {/* Add Contact Button */}
                    {!isFormOpen && (
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="mb-6 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                        >
                            <span className="material-icons-round">add</span>
                            Thêm liên hệ mới
                        </Button>
                    )}

                    {/* Add/Edit Form */}
                    {isFormOpen && (
                        <Card className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                {editingContact ? 'Chỉnh sửa liên hệ' : 'Thêm liên hệ khẩn cấp'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Tên người liên hệ
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="VD: Mẹ, Vợ, Bạn thân..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="0909090909"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="is_active" className="text-sm text-slate-700 dark:text-slate-300">
                                        Kích hoạt thông báo cho liên hệ này
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        {editingContact ? 'Cập nhật' : 'Thêm liên hệ'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {/* Contacts List */}
                    {contacts.length === 0 ? (
                        <Card className="text-center py-12">
                            <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-600 mb-4">contacts</span>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                Chưa có liên hệ khẩn cấp
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Thêm số điện thoại người thân để họ nhận thông báo khi bạn gặp nguy hiểm
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {contacts.map((contact) => (
                                <Card key={contact.contact_id} className="hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="material-icons-round text-primary text-2xl">person</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {contact.name}
                                                    {contact.is_active && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                            Đang kích hoạt
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-sm mt-1">
                                                    <span className="material-icons-round text-sm">phone</span>
                                                    {contact.phone_number}
                                                </p>
                                                <ConnectionStatus contact={contact} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <span className="material-icons-round text-xl">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.contact_id)}
                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                                title="Xóa"
                                            >
                                                <span className="material-icons-round text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Info Card */}
                    <Card className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-start gap-3">
                            <span className="material-icons-round text-blue-600 dark:text-blue-400 text-2xl">info</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Thông tin quan trọng
                                </h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Khi hệ thống phát hiện bạn buồn ngủ, tin nhắn cảnh báo sẽ được gửi qua Telegram tới người thân.
                                    Để nhận tin nhắn, hãy bảo người thân làm như sau:
                                    <ul className="list-disc ml-5 mt-2 space-y-1">
                                        <li>Cài đặt ứng dụng Telegram</li>
                                        <li>Tìm bot <strong>{'@PhatHienBuonNgu_bot'}</strong></li>
                                        <li>Nhắn tin theo cú pháp: <strong>/start &lt;Mã Kết Nối&gt;</strong></li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

// Helper component for Connection Status
const ConnectionStatus = ({ contact }) => {
    if (contact.telegram_chat_id) {
        return (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="material-icons-round text-sm">link</span>
                <span>Đã liên kết Telegram</span>
            </div>
        );
    }
    return (
        <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium mb-1">Chưa liên kết Telegram</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
                Mã kết nối: <span className="font-mono font-bold bg-white dark:bg-slate-800 px-1 rounded border dark:border-slate-700 select-all cursor-pointer">{contact.connection_code || "Đang tạo..."}</span>
            </p>
        </div>
    );
};
