import React, { useState, useEffect } from "react";
import { EditIcon, TrashIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
    createAirport,
    updateAirport,
    deleteAirport,
    createTicketClass,
    updateTicketClass,
    deleteTicketClass,
    updateSettings,
} from "../../services/api";

const SettingsTab = ({ airports, ticketClasses, rules, onUpdateAirports, onUpdateTicketClasses, onUpdateRules }) => {
    const [localAirports, setLocalAirports] = useState(airports);
    const [localTicketClasses, setLocalTicketClasses] = useState(ticketClasses);
    const [localRules, setLocalRules] = useState(rules);
    const [editingAirport, setEditingAirport] = useState(null);
    const [airportData, setAirportData] = useState({ name: '', city: '', country: '' });
    const [editingTicketClass, setEditingTicketClass] = useState(null);
    const [ticketClassData, setTicketClassData] = useState({ name: '', percentage: '' });
    const [saveRulesButtonText, setSaveRulesButtonText] = useState('Lưu');
    const [itemToDelete, setItemToDelete] = useState(null); 

    // 👇 LOGIC PHÂN QUYỀN
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Quản trị';
    const isDirector = user.role === 'Ban giám đốc';
    // Admin có toàn quyền. Giám đốc được sửa Rules.
    const canEditRules = isAdmin || isDirector;

    useEffect(() => { setLocalAirports(airports); setLocalTicketClasses(ticketClasses); setLocalRules(rules); }, [airports, ticketClasses, rules]);

    const handleAirportSubmit = async (e) => {
        e.preventDefault();
        try {
            let next = [];
            if (editingAirport) {
                const updated = await updateAirport(editingAirport.id, {
                    name: airportData.name,
                    city: airportData.city,
                    country: airportData.country,
                });
                next = localAirports.map(a => a.id === editingAirport.id ? updated : a);
            } else {
                const created = await createAirport({
                    name: airportData.name,
                    city: airportData.city,
                    country: airportData.country,
                });
                next = [...localAirports, created];
            }
            onUpdateAirports(next);
            setEditingAirport(null);
            setAirportData({ name: '', city: '', country: '' });
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Không thể lưu sân bay');
        }
    };

    const handleEditAirport = (airport) => {
        setEditingAirport(airport);
        setAirportData({ name: airport.name, city: airport.city, country: airport.country });
    }

    const handleTicketClassSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: ticketClassData.name,
                percentage: Number(ticketClassData.percentage),
            };
            let next = [];
            if (editingTicketClass) {
                const updated = await updateTicketClass(editingTicketClass.id, payload);
                next = localTicketClasses.map(tc => tc.id === editingTicketClass.id ? updated : tc);
            } else {
                const created = await createTicketClass(payload);
                next = [...localTicketClasses, created];
            }
            onUpdateTicketClasses(next);
            setEditingTicketClass(null);
            setTicketClassData({ name: '', percentage: '' });
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Không thể lưu hạng vé');
        }
    }

    const handleEditTicketClass = (ticketClass) => {
        setEditingTicketClass(ticketClass);
        setTicketClassData({ name: ticketClass.name, percentage: ticketClass.percentage });
    }
    const handleRuleChange = (e) => { const {name, value} = e.target; setLocalRules(prev => ({...prev, [name]: value})); }
    const handleSaveRules = async () => {
        try {
            const payload = {
                minFlightTime: Number(localRules.minFlightTime),
                maxStopovers: Number(localRules.maxStopovers),
                minStopTime: Number(localRules.minStopTime),
                maxStopTime: Number(localRules.maxStopTime),
                latestBookingTime: Number(localRules.latestBookingTime),
                latestCancelTime: Number(localRules.latestCancelTime),
            };
            const updated = await updateSettings(payload);
            onUpdateRules(updated);
            setSaveRulesButtonText("Đã lưu!");
            setTimeout(() => setSaveRulesButtonText("Lưu"), 2000);
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Không thể lưu quy định');
        }
    }
    const handleDeleteClick = (type, id) => { setItemToDelete({ type, id }); };
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (itemToDelete.type === 'airport') {
                await deleteAirport(itemToDelete.id);
                onUpdateAirports(localAirports.filter(a => a.id !== itemToDelete.id));
            } else if (itemToDelete.type === 'ticketClass') {
                await deleteTicketClass(itemToDelete.id);
                onUpdateTicketClasses(localTicketClasses.filter(tc => tc.id !== itemToDelete.id));
            }
            setItemToDelete(null);
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Không thể xóa');
            setItemToDelete(null);
        }
    };
    const cancelDelete = () => setItemToDelete(null);

    return(
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Sân bay</h3>
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr>{['Tên Sân bay', 'Thành phố', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}</tr></thead><tbody>{localAirports.map(a => (<tr key={a.id} className="border-b"><td className="p-2">{a.name}</td><td className="p-2">{a.city}</td><td className="p-2"><div className="flex items-center space-x-1">
                            {/* 👇 Chỉ Admin mới được Sửa/Xóa Sân bay */}
                            {isAdmin && (
                                <>
                                    <button onClick={() => handleEditAirport(a)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button>
                                    <button onClick={() => handleDeleteClick('airport', a.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                </>
                            )}
                            </div></td></tr>))}</tbody></table></div>
                        
                        {/* 👇 Chỉ Admin mới thấy Form thêm sân bay */}
                        {isAdmin && (
                            <form onSubmit={handleAirportSubmit} className="grid grid-cols-3 gap-2"><input value={airportData.name} onChange={(e) => setAirportData({...airportData, name: e.target.value})} placeholder="Tên sân bay" className="p-2 border rounded-md" required/><input value={airportData.city} onChange={(e) => setAirportData({...airportData, city: e.target.value})} placeholder="Thành phố" className="p-2 border rounded-md" required/><input value={airportData.country} onChange={(e) => setAirportData({...airportData, country: e.target.value})} placeholder="Quốc gia" className="p-2 border rounded-md" required/><div className="flex gap-2 col-span-3"><button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingAirport ? 'Cập nhật' : 'Thêm'}</button>{editingAirport && <button type="button" onClick={() => { setEditingAirport(null); setAirportData({ name: '', city: '', country: ''})}} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition">Hủy</button>}</div></form>
                        )}
                    </div>
                </div>
                <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Hạng vé</h3>
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr>{['Tên hạng vé', 'Phần trăm', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}</tr></thead><tbody>{localTicketClasses.map(tc => (<tr key={tc.id} className="border-b"><td className="p-2">{tc.name}</td><td className="p-2">{tc.percentage}%</td><td className="p-2"><div className="flex items-center space-x-1">
                            {/* 👇 Chỉ Admin mới được Sửa/Xóa Hạng vé */}
                            {isAdmin && (
                                <>
                                    <button onClick={() => handleEditTicketClass(tc)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button>
                                    <button onClick={() => handleDeleteClick('ticketClass', tc.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                </>
                            )}
                            </div></td></tr>))}</tbody></table></div>
                        
                        {/* 👇 Chỉ Admin mới thấy Form thêm hạng vé */}
                        {isAdmin && (
                            <form onSubmit={handleTicketClassSubmit} className="space-y-2"><div className="grid grid-cols-2 gap-2"><input value={ticketClassData.name} onChange={e => setTicketClassData({...ticketClassData, name: e.target.value})} placeholder="Tên hạng vé" className="p-2 border rounded-md" required/><input value={ticketClassData.percentage} onChange={e => setTicketClassData({...ticketClassData, percentage: e.target.value})} placeholder="Phần trăm đơn giá" type="number" className="p-2 border rounded-md" required/></div><div className="flex gap-2"><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingTicketClass ? 'Cập nhật hạng vé' : 'Tạo hạng vé'}</button>{editingTicketClass && <button type="button" onClick={() => { setEditingTicketClass(null); setTicketClassData({name: '', percentage: ''})}} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300">Hủy</button>}</div></form>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Quy định chung</h3>
                 {/* 👇 Nếu không phải Admin/Giám đốc thì Disable input */}
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[{name: 'minFlightTime', label: 'Thời gian bay tối thiểu', unit: 'Phút'},{name: 'maxStopovers', label: 'Số sân bay trung gian tối đa', unit: 'Sân'},{name: 'minStopTime', label: 'Thời gian dừng tối thiểu', unit: 'Phút'},{name: 'maxStopTime', label: 'Thời gian dừng tối đa', unit: 'Phút'},{name: 'latestBookingTime', label: 'Thời gian đặt vé chậm nhất', unit: 'Ngày'},{name: 'latestCancelTime', label: 'Thời gian hủy đặt vé chậm nhất', unit: 'Ngày'},].map(rule => (<div key={rule.name}><label className="text-sm font-medium text-gray-600">{rule.label}</label><div className="flex items-center mt-1"><input name={rule.name} value={localRules[rule.name]} onChange={handleRuleChange} disabled={!canEditRules} type="number" className="w-full p-2 border rounded-l-md disabled:bg-gray-100" /><span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md h-full">{rule.unit}</span></div></div>))}</div>
                 
                 {/* 👇 Ẩn nút Lưu nếu không có quyền */}
                 {canEditRules && (
                    <div className="mt-6 flex justify-end"><button onClick={handleSaveRules} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition w-28">{saveRulesButtonText}</button></div>
                 )}
            </div>
             {itemToDelete && <ConfirmationModal message={`Bạn có chắc muốn xóa mục này?`} onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    )
}

export default SettingsTab;