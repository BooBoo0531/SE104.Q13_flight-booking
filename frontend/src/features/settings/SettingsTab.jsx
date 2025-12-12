import React, { useState, useEffect } from "react";
import { EditIcon, TrashIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

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

    useEffect(() => { setLocalAirports(airports); setLocalTicketClasses(ticketClasses); setLocalRules(rules); }, [airports, ticketClasses, rules]);

    const handleAirportSubmit = (e) => { e.preventDefault(); if(editingAirport) { onUpdateAirports(localAirports.map(a => a.id === editingAirport.id ? {...a, ...airportData} : a)); } else { onUpdateAirports([...localAirports, {id: Date.now(), ...airportData}]); } setEditingAirport(null); setAirportData({ name: '', city: '', country: '' }); };
    const handleEditAirport = (airport) => { setEditingAirport(airport); setAirportData(airport); }
    const handleTicketClassSubmit = (e) => { e.preventDefault(); if(editingTicketClass) { onUpdateTicketClasses(localTicketClasses.map(tc => tc.id === editingTicketClass.id ? {...tc, ...ticketClassData} : tc)); } else { onUpdateTicketClasses([...localTicketClasses, {id: Date.now(), ...ticketClassData}]); } setEditingTicketClass(null); setTicketClassData({ name: '', percentage: '' }); }
    const handleEditTicketClass = (ticketClass) => { setEditingTicketClass(ticketClass); setTicketClassData(ticketClass); }
    const handleRuleChange = (e) => { const {name, value} = e.target; setLocalRules(prev => ({...prev, [name]: value})); }
    const handleSaveRules = () => { onUpdateRules(localRules); setSaveRulesButtonText("Đã lưu!"); setTimeout(() => setSaveRulesButtonText("Lưu"), 2000); }
    const handleDeleteClick = (type, id) => { setItemToDelete({ type, id }); };
    const confirmDelete = () => { if (!itemToDelete) return; if (itemToDelete.type === 'airport') { onUpdateAirports(localAirports.filter(a => a.id !== itemToDelete.id)); } else if (itemToDelete.type === 'ticketClass') { onUpdateTicketClasses(localTicketClasses.filter(tc => tc.id !== itemToDelete.id)); } setItemToDelete(null); };
    const cancelDelete = () => setItemToDelete(null);

    return(
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Sân bay</h3>
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr>{['Tên Sân bay', 'Thành phố', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}</tr></thead><tbody>{localAirports.map(a => (<tr key={a.id} className="border-b"><td className="p-2">{a.name}</td><td className="p-2">{a.city}</td><td className="p-2"><div className="flex items-center space-x-1"><button onClick={() => handleEditAirport(a)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button><button onClick={() => handleDeleteClick('airport', a.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button></div></td></tr>))}</tbody></table></div>
                        <form onSubmit={handleAirportSubmit} className="grid grid-cols-3 gap-2"><input value={airportData.name} onChange={(e) => setAirportData({...airportData, name: e.target.value})} placeholder="Tên sân bay" className="p-2 border rounded-md" required/><input value={airportData.city} onChange={(e) => setAirportData({...airportData, city: e.target.value})} placeholder="Thành phố" className="p-2 border rounded-md" required/><input value={airportData.country} onChange={(e) => setAirportData({...airportData, country: e.target.value})} placeholder="Quốc gia" className="p-2 border rounded-md" required/><div className="flex gap-2 col-span-3"><button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingAirport ? 'Cập nhật' : 'Thêm'}</button>{editingAirport && <button type="button" onClick={() => { setEditingAirport(null); setAirportData({ name: '', city: '', country: ''})}} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition">Hủy</button>}</div></form>
                    </div>
                </div>
                <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Hạng vé</h3>
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr>{['Tên hạng vé', 'Phần trăm', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}</tr></thead><tbody>{localTicketClasses.map(tc => (<tr key={tc.id} className="border-b"><td className="p-2">{tc.name}</td><td className="p-2">{tc.percentage}%</td><td className="p-2"><div className="flex items-center space-x-1"><button onClick={() => handleEditTicketClass(tc)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button><button onClick={() => handleDeleteClick('ticketClass', tc.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button></div></td></tr>))}</tbody></table></div>
                        <form onSubmit={handleTicketClassSubmit} className="space-y-2"><div className="grid grid-cols-2 gap-2"><input value={ticketClassData.name} onChange={e => setTicketClassData({...ticketClassData, name: e.target.value})} placeholder="Tên hạng vé" className="p-2 border rounded-md" required/><input value={ticketClassData.percentage} onChange={e => setTicketClassData({...ticketClassData, percentage: e.target.value})} placeholder="Phần trăm đơn giá" type="number" className="p-2 border rounded-md" required/></div><div className="flex gap-2"><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingTicketClass ? 'Cập nhật hạng vé' : 'Tạo hạng vé'}</button>{editingTicketClass && <button type="button" onClick={() => { setEditingTicketClass(null); setTicketClassData({name: '', percentage: ''})}} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300">Hủy</button>}</div></form>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Quy định chung</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[{name: 'minFlightTime', label: 'Thời gian bay tối thiểu', unit: 'Phút'},{name: 'maxStopovers', label: 'Số sân bay trung gian tối đa', unit: 'Sân'},{name: 'minStopTime', label: 'Thời gian dừng tối thiểu', unit: 'Phút'},{name: 'maxStopTime', label: 'Thời gian dừng tối đa', unit: 'Phút'},{name: 'latestBookingTime', label: 'Thời gian đặt vé chậm nhất', unit: 'Ngày'},{name: 'latestCancelTime', label: 'Thời gian hủy đặt vé chậm nhất', unit: 'Ngày'},].map(rule => (<div key={rule.name}><label className="text-sm font-medium text-gray-600">{rule.label}</label><div className="flex items-center mt-1"><input name={rule.name} value={localRules[rule.name]} onChange={handleRuleChange} type="number" className="w-full p-2 border rounded-l-md" /><span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md h-full">{rule.unit}</span></div></div>))}</div>
                 <div className="mt-6 flex justify-end"><button onClick={handleSaveRules} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition w-28">{saveRulesButtonText}</button></div>
            </div>
             {itemToDelete && <ConfirmationModal message={`Bạn có chắc muốn xóa mục này?`} onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    )
}

export default SettingsTab;