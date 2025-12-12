import React, { useState, useEffect } from "react";
import { EditIcon, TrashIcon, Eye, EyeOff } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const UserForm = ({ initialData, roles, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    const [userData, setUserData] = useState(isEditMode ? { ...initialData, password: '' } : { name: '', email: '', phone: '', password: '', role: 'Nhân viên' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleInputChange = (e) => { const {name, value} = e.target; setUserData(prev => ({...prev, [name]: value})); }
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(userData); if (!isEditMode) { setUserData({ name: '', email: '', phone: '', password: '', role: 'Nhân viên' }); } }
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditMode ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div><label className="text-sm font-medium text-gray-600">Họ và tên:</label><input name="name" value={userData.name} onChange={handleInputChange} required placeholder="Nhập họ và tên" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div><label className="text-sm font-medium text-gray-600">Email:</label><input name="email" value={userData.email} onChange={handleInputChange} required placeholder="Nhập email" type="email" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div><label className="text-sm font-medium text-gray-600">Số điện thoại:</label><input name="phone" value={userData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại" type="tel" className="w-full p-2 mt-1 border rounded-md" /></div>
                <div className="relative"><label className="text-sm font-medium text-gray-600">Mật khẩu:</label><input name="password" value={userData.password} onChange={handleInputChange} required={!isEditMode} placeholder={isEditMode ? "Để trống nếu không đổi" : "Nhập mật khẩu"} type={passwordVisible ? "text" : "password"} className="w-full p-2 mt-1 border rounded-md" /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">{passwordVisible ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button></div>
                <div><label className="text-sm font-medium text-gray-600">Nhóm phân quyền:</label><select name="role" value={userData.role} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md">{roles.map(role => <option key={role}>{role}</option>)}</select></div>
                <div className="flex gap-2 pt-2"><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition">{isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}</button>{isEditMode && <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">Hủy</button>}</div>
            </form>
        </div>
    )
}

const UsersTab = ({ users, permissions, onCreateUser, onDeleteUser, onUpdateUser, onSavePermissions }) => {
    const [localPermissions, setLocalPermissions] = useState(permissions);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [saveButtonText, setSaveButtonText] = useState('Lưu');

    useEffect(() => { setLocalPermissions(permissions); }, [permissions]);
    const handlePermissionChange = (role, permission, value) => { setLocalPermissions(prev => ({ ...prev, [role]: { ...prev[role], [permission]: value } })); };
    const handleSavePermissions = () => { onSavePermissions(localPermissions); setSaveButtonText("Đã lưu!"); setTimeout(() => setSaveButtonText("Lưu"), 2000); }
    const handleCreateUser = (newUser) => { onCreateUser(newUser); }
    const handleUpdateUser = (updatedUser) => { onUpdateUser(updatedUser); setEditingUser(null); }
    const handleDeleteClick = (userId) => { setUserToDelete(userId); };
    const confirmDelete = () => { onDeleteUser(userToDelete); setUserToDelete(null); };
    const cancelDelete = () => { setUserToDelete(null); };
    const handleEditClick = (user) => { setEditingUser(user); }
    const handleCancelEdit = () => { setEditingUser(null); }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold text-gray-800">Quyền hạn của các nhóm tài khoản</h3><button onClick={handleSavePermissions} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition w-24">{saveButtonText}</button></div>
                        <div className="bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr>{['Nhóm quyền', 'Chuyến bay', 'Vé chuyến bay', 'Báo cáo', 'Máy bay', 'Tài khoản và quyền', 'Cài đặt'].map(h => <th key={h} className="p-3 font-semibold text-gray-600">{h}</th>)}</tr></thead><tbody>{Object.entries(localPermissions).map(([role, perms]) => (<tr key={role} className="border-b"><td className="p-3 font-semibold text-gray-700">{role}</td>{Object.entries(perms).map(([permKey, hasPermission]) => (<td key={permKey} className="p-3 text-center"><input type="checkbox" checked={hasPermission} onChange={(e) => handlePermissionChange(role, permKey, e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" /></td>))}</tr>))}</tbody></table></div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quản lý tài khoản</h3>
                        <div className="bg-white rounded-lg shadow overflow-hidden max-h-72 overflow-y-auto border"><table className="w-full text-left"><thead className="bg-gray-50 sticky top-0"><tr>{['Tên tài khoản', 'Ngày tạo', 'Nhóm quyền', 'Thao tác'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}</tr></thead><tbody>{users.map((user) => (<tr key={user.id} className="border-b"><td className="p-3">{user.name}</td><td className="p-3">{user.date}</td><td className="p-3">{user.role}</td><td className="p-3"><div className="flex items-center space-x-2"><button onClick={() => handleEditClick(user)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button><button onClick={() => handleDeleteClick(user.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button></div></td></tr>))}</tbody></table></div>
                    </div>
                </div>
                <UserForm key={editingUser ? editingUser.id : 'create'} initialData={editingUser} roles={Object.keys(localPermissions)} onSubmit={editingUser ? handleUpdateUser : handleCreateUser} onCancel={editingUser ? handleCancelEdit : null} />
            </div>
            {userToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa tài khoản này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};

export default UsersTab;