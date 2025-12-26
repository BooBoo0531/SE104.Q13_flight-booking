import React, { useState, useEffect } from "react";
import axios from "axios";
// Đảm bảo đường dẫn import đúng với dự án của bạn
import { EditIcon, TrashIcon, Eye, EyeOff } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const API_URL = "http://localhost:3000/users";

// --- 1. USER FORM (Giữ nguyên giao diện của bạn) ---
const UserForm = ({ initialData, roles, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    // Nếu edit thì không bắt buộc nhập password, nếu create thì bắt buộc
    const [userData, setUserData] = useState(isEditMode ? { ...initialData, password: '' } : { name: '', email: '', phone: '', password: '', role: 'Nhân viên' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    // Cập nhật state khi props thay đổi (để form reset khi chuyển từ Edit -> Create)
    useEffect(() => {
        if (initialData) {
            setUserData({ ...initialData, password: '' });
        } else {
            setUserData({ name: '', email: '', phone: '', password: '', role: 'Nhân viên' });
        }
    }, [initialData]);

    const handleInputChange = (e) => { const {name, value} = e.target; setUserData(prev => ({...prev, [name]: value})); }
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        // Nếu đang edit mà password rỗng thì xóa trường password đi để backend không update nó
        const payload = { ...userData };
        if (isEditMode && !payload.password) delete payload.password;
        
        onSubmit(payload); 
        if (!isEditMode) { setUserData({ name: '', email: '', phone: '', password: '', role: 'Nhân viên' }); } 
    }
    
    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditMode ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div><label className="text-sm font-medium text-gray-600">Họ và tên:</label><input name="name" value={userData.name} onChange={handleInputChange} required placeholder="Nhập họ và tên" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div><label className="text-sm font-medium text-gray-600">Email:</label><input name="email" value={userData.email} onChange={handleInputChange} required placeholder="Nhập email" type="email" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div><label className="text-sm font-medium text-gray-600">Số điện thoại:</label><input name="phone" value={userData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại" type="tel" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div className="relative"><label className="text-sm font-medium text-gray-600">Mật khẩu:</label><input name="password" value={userData.password} onChange={handleInputChange} required={!isEditMode} placeholder={isEditMode ? "Để trống nếu không đổi" : "Nhập mật khẩu"} type={passwordVisible ? "text" : "password"} className="w-full p-2 mt-1 border rounded-md" /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">{passwordVisible ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button></div>
                <div><label className="text-sm font-medium text-gray-600">Nhóm phân quyền:</label><select name="role" value={userData.role} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md bg-white">{roles.map(role => <option key={role}>{role}</option>)}</select></div>
                <div className="flex gap-2 pt-2"><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition">{isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}</button>{isEditMode && <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">Hủy</button>}</div>
            </form>
        </div>
    )
}

// --- 2. MAIN COMPONENT (Logic API + Giao diện cũ) ---
const UsersTab = () => {
    // Thay vì nhận props, ta dùng state nội bộ
    const [users, setUsers] = useState([]);
    const [localPermissions, setLocalPermissions] = useState({});
    
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [saveButtonText, setSaveButtonText] = useState('Lưu');

    // Cấu hình mặc định để bảng không bị trống nếu DB chưa có dữ liệu quyền
    const DEFAULT_ROLES = ['Quản trị', 'Ban giám đốc', 'Điều hành bay', 'Nhân viên'];
    const DEFAULT_MODULES = { 'ChuyenBay': false, 'VeChuyenBay': false, 'BaoCao': false, 'MayBay': false, 'TaiKhoan': false, 'CaiDat': false };

    // --- API: Fetch Data ---
    const fetchData = async () => {
        try {
            const [usersRes, permsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(`${API_URL}/permissions`)
            ]);

            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

            // Xử lý Permissions: Nếu rỗng thì tạo mặc định để hiển thị được bảng
            let permsData = permsRes.data || {};
            if (Object.keys(permsData).length === 0) {
                DEFAULT_ROLES.forEach(role => { permsData[role] = { ...DEFAULT_MODULES }; });
            }
            setLocalPermissions(permsData);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- Handlers Logic ---
    const handlePermissionChange = (role, permission, value) => { 
        setLocalPermissions(prev => ({ 
            ...prev, 
            [role]: { ...prev[role], [permission]: value } 
        })); 
    };

    const handleSavePermissions = async () => { 
        try {
            await axios.post(`${API_URL}/permissions`, localPermissions);
            setSaveButtonText("Đã lưu!"); 
            setTimeout(() => setSaveButtonText("Lưu"), 2000); 
        } catch (error) {
            alert("Lỗi lưu quyền: " + error.message);
        }
    };

    const handleCreateUser = async (newUser) => { 
        try {
            await axios.post(API_URL, newUser);
            alert("Tạo tài khoản thành công!");
            fetchData(); // Load lại danh sách
        } catch (error) {
            alert("Lỗi tạo user: " + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            const { createdAt, id, ...payload } = updatedUser; 

            await axios.patch(`${API_URL}/${id}`, payload);
            
            alert("Cập nhật thông tin thành công!");
            setEditingUser(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteClick = (userId) => { setUserToDelete(userId); };
    
    const confirmDelete = async () => { 
        try {
            await axios.delete(`${API_URL}/${userToDelete}`);
            fetchData();
        } catch (error) {
            alert("Lỗi xóa: " + error.message);
        } finally {
            setUserToDelete(null); 
        }
    };
    
    const cancelDelete = () => { setUserToDelete(null); };
    const handleEditClick = (user) => { setEditingUser(user); }
    const handleCancelEdit = () => { setEditingUser(null); }

    // Header bảng quyền (Mapping key sang tiếng Việt hiển thị)
    const PERMISSION_HEADERS = {
        'ChuyenBay': 'Chuyến bay', 
        'VeChuyenBay': 'Vé chuyến bay', 
        'BaoCao': 'Báo cáo', 
        'MayBay': 'Máy bay', 
        'TaiKhoan': 'Tài khoản và quyền', 
        'CaiDat': 'Cài đặt'
    };
    const permissionKeys = ['ChuyenBay', 'VeChuyenBay', 'BaoCao', 'MayBay', 'TaiKhoan', 'CaiDat'];

    return (
        <div className="p-6 animate-fade-in h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                
                {/* CỘT TRÁI: DANH SÁCH & PHÂN QUYỀN */}
                <div className="lg:col-span-2 space-y-8 flex flex-col h-full overflow-hidden">
                    
                    {/* 1. Bảng phân quyền */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Quyền hạn của các nhóm tài khoản</h3>
                            <button onClick={handleSavePermissions} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition w-24 shadow">{saveButtonText}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-3 font-semibold text-gray-600">Nhóm quyền</th>
                                        {permissionKeys.map(key => <th key={key} className="p-3 font-semibold text-gray-600 text-center">{PERMISSION_HEADERS[key]}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(localPermissions).map(([role, perms]) => (
                                        <tr key={role} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-semibold text-gray-700">{role}</td>
                                            {permissionKeys.map(permKey => (
                                                <td key={permKey} className="p-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={perms[permKey] || false} 
                                                        onChange={(e) => handlePermissionChange(role, permKey, e.target.checked)} 
                                                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. Danh sách tài khoản */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Quản lý tài khoản</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0 z-10 border-b shadow-sm">
                                    <tr>
                                        {['Tên tài khoản', 'Email', 'Nhóm quyền', 'Thao tác'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3 text-gray-500">{user.email}</td>
                                            <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{user.role}</span></td>
                                            <td className="p-3">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEditClick(user)} className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"><EditIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDeleteClick(user.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-400">Chưa có dữ liệu</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM */}
                <UserForm 
                    key={editingUser ? editingUser.id : 'create'} 
                    initialData={editingUser} 
                    roles={Object.keys(localPermissions).length > 0 ? Object.keys(localPermissions) : DEFAULT_ROLES} 
                    onSubmit={editingUser ? handleUpdateUser : handleCreateUser} 
                    onCancel={editingUser ? handleCancelEdit : null} 
                />
            </div>
            {userToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa tài khoản này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};

export default UsersTab;