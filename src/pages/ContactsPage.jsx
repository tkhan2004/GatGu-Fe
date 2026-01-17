import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import apiService from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ContactsPage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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

        // Validate phone number
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            showError('Số điện thoại không hợp lệ (10-11 chữ số)');
            return;
        }

        try {
            if (editingContact) {
                await apiService.updateContact(editingContact.contact_id, formData);
                showSuccess('Đã cập nhật liên hệ');
            } else {
                await apiService.createContact(formData);
                showSuccess('Đã thêm liên hệ mới');
            }

            setShowForm(false);
            setEditingContact(null);
            setFormData({ name: '', phone_number: '', is_active: true });
            fetchContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
            showError('Không thể lưu liên hệ');
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            phone_number: contact.phone_number,
            is_active: contact.is_active
        });
        setShowForm(true);
    };

    const handleDelete = async (contactId) => {
        if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;

        try {
            await apiService.deleteContact(contactId);
            showSuccess('Đã xóa liên hệ');
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            showError('Không thể xóa liên hệ');
        }
    };

    const toggleActive = async (contact) => {
        try {
            await apiService.updateContact(contact.contact_id, {
                ...contact,
                is_active: !contact.is_active
            });
            showSuccess(contact.is_active ? 'Đã tắt liên hệ' : 'Đã bật liên hệ');
            fetchContacts();
        } catch (error) {
            console.error('Error toggling contact:', error);
            showError('Không thể cập nhật trạng thái');
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingContact(null);
        setFormData({ name: '', phone_number: '', is_active: true });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <Sidebar />

            <main className="lg:ml-64 p-4 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liên hệ khẩn cấp</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Quản lý danh sách người thân nhận cảnh báo
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            <span>Thêm liên hệ</span>
                        </Button>
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <Card className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {editingContact ? 'Chỉnh sửa liên hệ' : 'Thêm liên hệ mới'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Tên người thân
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ví dụ: Mẹ, Vợ, Bạn..."
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
                                        required
                                        className="w-full"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Nhập 10-11 chữ số
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kích hoạt nhận cảnh báo
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        {editingContact ? 'Cập nhật' : 'Thêm liên hệ'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={cancelForm}
                                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {/* Contacts List */}
                    {contacts.length === 0 ? (
                        <Card className="p-12 text-center">
                            <span className="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-600 mb-4">
                                contacts
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Chưa có liên hệ nào
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Thêm người thân để nhận cảnh báo khẩn cấp khi phát hiện nguy hiểm
                            </p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Thêm liên hệ đầu tiên
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {contacts.map((contact) => (
                                <Card key={contact.contact_id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contact.is_active
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-gray-100 dark:bg-gray-800'
                                                }`}>
                                                <span className={`material-symbols-outlined text-2xl ${contact.is_active
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-gray-400'
                                                    }`}>
                                                    person
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                    {contact.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">phone</span>
                                                    {contact.phone_number}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleActive(contact)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${contact.is_active
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {contact.is_active ? 'Đang bật' : 'Đã tắt'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.contact_id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
