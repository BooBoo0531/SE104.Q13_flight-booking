import React, { useState, useEffect } from "react";
import axios from "axios";
import { EditIcon, TrashIcon, SearchIcon, PlusCircleIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const API_URL = "http://localhost:3000/airplanes";

const AirplaneForm = ({ initialData, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    const [planeData, setPlaneData] = useState(isEditMode ? initialData : { name: 'Máy bay M', code: '', economySeats: 12, businessSeats: 6 });

    const handleInputChange = (e) => { const { name, value } = e.target; setPlaneData(prev => ({...prev, [name]: value})); }
    const totalSeats = (parseInt(planeData.economySeats, 10) || 0) + (parseInt(planeData.businessSeats, 10) || 0);
    
    const handleSubmit = () => { 
        onSubmit({ ...planeData, totalSeats }); 
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-700">{isEditMode ? 'Cập nhật máy bay' : 'Thông tin máy bay mới'}</h3>
                
                <input name="code" value={planeData.code} onChange={handleInputChange} placeholder="Số hiệu (VD: VN-A123)" className="w-full p-2 border rounded" disabled={isEditMode} />
                
                <input name="name" value={planeData.name} onChange={handleInputChange} placeholder="Tên máy bay" className="w-full p-2 border rounded" />
                
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h4 className="font-semibold text-gray-600 mb-2">Chi tiết hạng vé</h4>
                    <div className="flex items-center"><label className="w-24">Phổ thông</label><input name="economySeats" type="number" value={planeData.economySeats} onChange={handleInputChange} className="flex-1 p-2 border rounded" /></div>
                    <div className="flex items-center"><label className="w-24">Thương gia</label><input name="businessSeats" type="number" value={planeData.businessSeats} onChange={handleInputChange} className="flex-1 p-2 border rounded" /></div>
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex justify-between items-center"><span className="font-semibold text-gray-600">Tổng số ghế:</span><span className="font-bold text-xl text-blue-600">{totalSeats}</span></div>
                <div className="flex gap-4"><button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu</button><button onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy</button></div>
            </div>
            
            <div className="lg:col-span-2 p-4 border rounded-lg bg-white">
                <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: parseInt(planeData.businessSeats)||0 }, (_, i) => (<div key={`b-${i}`} className="w-10 h-10 bg-teal-200 rounded flex items-center justify-center text-teal-800 text-xs font-semibold">{`B${i + 1}`}</div>))}
                    {Array.from({ length: parseInt(planeData.economySeats)||0 }, (_, i) => (<div key={`e-${i}`} className="w-10 h-10 bg-cyan-200 rounded flex items-center justify-center text-cyan-800 text-xs">{`E${i + 1}`}</div>))}
                </div>
            </div>
        </div>
    );
};

const AirplanesList = ({ airplanes, onEdit, onCreate, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const safeList = Array.isArray(airplanes) ? airplanes : [];

    const filteredAirplanes = safeList.filter(plane => {
        const name = plane.name ? plane.name.toLowerCase() : '';
        const code = plane.code ? plane.code.toLowerCase() : '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || code.includes(search);
    });

    return (
        <div className="p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <input type="text" placeholder="Tìm mã hoặc tên máy bay..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={onCreate} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all shadow flex items-center space-x-2"><PlusCircleIcon className="w-5 h-5"/><span>Tạo mới</span></button>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4 font-semibold text-gray-600">Số hiệu (Code)</th><th className="p-4 font-semibold text-gray-600">Tên máy bay</th><th className="p-4 font-semibold text-gray-600">Số lượng ghế</th><th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th></tr></thead>
                    <tbody>
                        {filteredAirplanes.length > 0 ? filteredAirplanes.map(plane => (
                            <tr key={plane.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-blue-600 font-bold">{plane.code}</td>
                                <td className="p-4 text-gray-800">{plane.name}</td>
                                <td className="p-4 text-gray-800"><span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">{plane.totalSeats}</span></td>
                                <td className="p-4"><div className="flex justify-center items-center space-x-2"><button onClick={() => onEdit(plane)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition"><EditIcon className="w-4 h-4"/></button><button onClick={() => onDelete(plane.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-4 h-4"/></button></div></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AirplanesTab = () => { 
    const [airplanes, setAirplanes] = useState([]);
    const [subTab, setSubTab] = useState('list');
    const [editingAirplane, setEditingAirplane] = useState(null);
    const [airplaneToDelete, setAirplaneToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAirplanes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setAirplanes(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirplanes();
    }, []);

    const handleSave = async (planeData) => {
        try {
            const payload = {
                name: planeData.name,
                code: planeData.code,
                economySeats: Number(planeData.economySeats),
                businessSeats: Number(planeData.businessSeats)
            };

            if (editingAirplane) {
                await axios.patch(`${API_URL}/${editingAirplane.id}`, payload);
                alert("Cập nhật máy bay thành công!");
            } else {
                await axios.post(API_URL, payload);
                alert("Thêm máy bay thành công!");
            }
            fetchAirplanes(); 
            setSubTab('list');
            setEditingAirplane(null);
        } catch (error) {
            alert("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteClick = (planeId) => { setAirplaneToDelete(planeId); }
    
    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${airplaneToDelete}`);
            fetchAirplanes(); 
        } catch (error) {
            alert("Máy bay này không thể xóa vì đang có chuyến bay sử dụng.");
        } finally {
            setAirplaneToDelete(null);
        }
    }

    const cancelDelete = () => setAirplaneToDelete(null);
    const handleCreateClick = () => { setEditingAirplane(null); setSubTab('create'); }
    const handleEditClick = (plane) => { setEditingAirplane(plane); setSubTab('edit'); }
    const handleCancel = () => { setEditingAirplane(null); setSubTab('list'); }
    
    const SubTabButton = ({ value, children }) => ( <button onClick={() => { setSubTab(value); setEditingAirplane(null); }} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value && !editingAirplane ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button> );

    const renderContent = () => {
        if (loading && subTab === 'list') return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
        switch(subTab) {
            case 'list': return <AirplanesList airplanes={airplanes} onCreate={handleCreateClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>;
            case 'create': case 'edit': return <AirplaneForm initialData={editingAirplane} onSubmit={handleSave} onCancel={handleCancel} />;
            default: return null;
        }
    }

    return (
        <div>
            <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between bg-white"><div className="flex items-center space-x-2"><SubTabButton value="list">Danh sách máy bay</SubTabButton><SubTabButton value="create">Tạo máy bay mới</SubTabButton>{subTab === 'edit' && (<span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">Chi tiết máy bay</span>)}</div></div>
            <div className="bg-gray-50 min-h-[500px]">{renderContent()}</div>
            {airplaneToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa máy bay này? Dữ liệu không thể phục hồi." onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};

export default AirplanesTab;