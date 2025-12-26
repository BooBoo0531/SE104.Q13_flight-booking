import React, { useState, useEffect } from "react";
import { CalendarIcon, EditIcon, TrashIcon, PlusCircleIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

// --- Sub-component: FlightList (Cập nhật để nhận props phân quyền) ---
const FlightList = ({ flights, onEdit, onDelete, onBookTicket, canManage, canBook }) => {
    const [searchDate, setSearchDate] = useState('');
    const [fromCitySearch, setFromCitySearch] = useState('all');
    const [toCitySearch, setToCitySearch] = useState('all');
    const [filteredFlights, setFilteredFlights] = useState(flights);

    useEffect(() => { if (!searchDate && fromCitySearch === 'all' && toCitySearch === 'all') { setFilteredFlights(flights); } }, [searchDate, fromCitySearch, toCitySearch, flights]);
    useEffect(() => { handleSearch(); }, [flights]);

    const handleSearch = () => { 
        let results = flights; 
        if (searchDate) { results = results.filter(flight => flight.date === searchDate); } 
        if (fromCitySearch && fromCitySearch !== 'all') { results = results.filter(flight => flight.fromCity === fromCitySearch); } 
        if (toCitySearch && toCitySearch !== 'all') { results = results.filter(flight => flight.toCity === toCitySearch); } 
        setFilteredFlights(results); 
    };
    
    const allCities = [...new Set(flights.flatMap(f => [f.fromCity, f.toCity]))];

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="relative">
                    <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select value={fromCitySearch} onChange={(e) => setFromCitySearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả nơi đi</option>{allCities.map(city => <option key={`from-${city}`} value={city}>{city}</option>)}
                </select>
                <select value={toCitySearch} onChange={(e) => setToCitySearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả nơi đến</option>{allCities.map(city => <option key={`to-${city}`} value={city}>{city}</option>)}
                </select>
                <button onClick={handleSearch} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow">Tìm kiếm</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            {['Mã chuyến bay', 'Sân bay cất cánh', 'Nơi cất cánh', 'Sân bay hạ cánh', 'Nơi hạ cánh', 'Thời gian', 'Ghế trống', 'Ghế đã đặt'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}
                            {/* Chỉ hiện cột Thao tác nếu có ít nhất 1 quyền (Book hoặc Manage) */}
                            {(canManage || canBook) && <th className="p-3 font-semibold text-gray-600 text-sm">Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFlights.map(f => (
                            <tr key={f.id} className="border-b hover:bg-blue-50 transition">
                                <td className="p-3 font-mono text-blue-700">{f.id}</td>
                                <td className="p-3">{f.fromAirport}</td><td className="p-3">{f.fromCity}</td><td className="p-3">{f.toAirport}</td><td className="p-3">{f.toCity}</td>
                                <td className="p-3">{f.time}</td>
                                <td className="p-3 text-green-600 font-medium">{f.seatsEmpty}</td>
                                <td className="p-3 text-red-600 font-medium">{f.seatsTaken}</td>
                                
                                {/* Cột Thao tác: Render có điều kiện */}
                                {(canManage || canBook) && (
                                    <td className="p-3">
                                        <div className="flex items-center space-x-1">
                                            {/* Nút Đặt vé */}
                                            {canBook && (
                                                <button onClick={() => onBookTicket(f)} className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-600">Đặt vé</button>
                                            )}
                                            
                                            {/* Nút Sửa/Xóa */}
                                            {canManage && (
                                                <>
                                                    <button onClick={() => onEdit(f)} className="p-1 text-gray-500 hover:text-green-600"><EditIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => onDelete(f.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Sub-component: FlightForm (GIỮ NGUYÊN 100%) ---
const FlightForm = ({ initialData, onSubmit, onCancel, airports, rules }) => {
    const isEditMode = !!initialData;
    const [flightData, setFlightData] = useState(isEditMode ? initialData : { fromAirport: '', fromCity: '', toAirport: '', toCity: '', planeId: '', date: '', hour: '', minute: '', duration: '', price: '', businessSeats: 30, economySeats: 30, seatsTaken: 0, });
    const [intermediateAirports, setIntermediateAirports] = useState(isEditMode ? initialData.intermediateAirports : []);
    
    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        let fromCity = flightData.fromCity;
        let toCity = flightData.toCity;
        if(name === 'fromAirport') { fromCity = airports.find(a => a.name === value)?.city || ''; }
        if(name === 'toAirport') { toCity = airports.find(a => a.name === value)?.city || ''; }
        setFlightData(prev => ({ ...prev, [name]: value, fromCity, toCity })); 
    };

    const handleAddAirport = () => { 
        if(intermediateAirports.length >= rules.maxStopovers) { alert(`Chỉ được phép tối đa ${rules.maxStopovers} sân bay trung gian.`); return; }
        const newAirport = { id: Date.now(), name: '', duration: rules.minStopTime, notes: '' }; 
        setIntermediateAirports([...intermediateAirports, newAirport]); 
    };
    
    const handleAirportChange = (id, field, value) => { setIntermediateAirports(intermediateAirports.map(airport => airport.id === id ? { ...airport, [field]: value } : airport)); };
    const handleRemoveAirport = (id) => { setIntermediateAirports(intermediateAirports.filter(airport => airport.id !== id)); };
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if(parseInt(flightData.duration, 10) < rules.minFlightTime){ alert(`Thời gian bay tối thiểu là ${rules.minFlightTime} phút.`); return; }
        onSubmit({ ...flightData, intermediateAirports }); 
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 p-4 border rounded-lg bg-white">
                <h3 className="font-semibold text-lg text-gray-700">Thông tin chuyến bay</h3>
                <div className="grid grid-cols-2 gap-4">
                    <select name="fromAirport" value={flightData.fromAirport} onChange={handleInputChange} className="w-full p-2 border rounded"><option value="">-- Chọn sân bay đi --</option>{airports.map(a => <option key={a.id} value={a.name}>{a.name} ({a.city})</option>)}</select>
                    <select name="toAirport" value={flightData.toAirport} onChange={handleInputChange} className="w-full p-2 border rounded"><option value="">-- Chọn sân bay đến --</option>{airports.map(a => <option key={a.id} value={a.name}>{a.name} ({a.city})</option>)}</select>
                    <input name="planeId" value={flightData.planeId} onChange={handleInputChange} placeholder="Mã máy bay (VD: PE0003)" className="w-full p-2 border rounded" />
                    <input name="date" type="date" value={flightData.date} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    <div className="flex gap-2 col-span-2">
                        <input name="hour" type="number" value={flightData.hour} onChange={handleInputChange} placeholder="Giờ" className="w-1/3 p-2 border rounded" />
                        <input name="minute" type="number" value={flightData.minute} onChange={handleInputChange} placeholder="Phút" className="w-1/3 p-2 border rounded" />
                        <input name="duration" type="number" value={flightData.duration} onChange={handleInputChange} placeholder="Thời gian bay (phút)" className="w-1/3 p-2 border rounded" />
                    </div>
                    <input name="price" type="number" value={flightData.price} onChange={handleInputChange} placeholder="Giá vé" className="w-full col-span-2 p-2 border rounded" />
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow">{isEditMode ? 'Lưu thay đổi' : 'Tạo chuyến bay'}</button>
                    <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition">Hủy</button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-2 bg-white"><h3 className="font-semibold text-gray-700">Số lượng ghế (lấy từ máy bay)</h3>
                    <div className="flex items-center"><label className="w-24">Thương gia</label><input name="businessSeats" type="number" value={flightData.businessSeats} readOnly className="flex-1 p-2 border rounded bg-gray-100" /></div>
                    <div className="flex items-center"><label className="w-24">Phổ thông</label><input name="economySeats" type="number" value={flightData.economySeats} readOnly className="flex-1 p-2 border rounded bg-gray-100" /></div>
                </div>
                <div className="p-4 border rounded-lg space-y-2 bg-white">
                    <div className="flex justify-between items-center"><h3 className="font-semibold text-gray-700">Sân bay trung gian</h3><button type="button" onClick={handleAddAirport} className="p-1 rounded-full hover:bg-blue-100 text-blue-600"><PlusCircleIcon className="w-6 h-6"/></button></div>
                    <div className="space-y-2">{intermediateAirports.map((airport, index) => (<div key={airport.id} className="flex items-center gap-2"><span className="font-bold text-gray-500">{index + 1}</span><select value={airport.name} onChange={(e) => handleAirportChange(airport.id, 'name', e.target.value)} className="flex-1 p-2 border rounded"><option value="">-- Chọn sân bay --</option>{airports.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}</select><input value={airport.duration} onChange={(e) => handleAirportChange(airport.id, 'duration', e.target.value)} type="number" placeholder="TG dừng" className="w-20 p-2 border rounded" /><button type="button" onClick={() => handleRemoveAirport(airport.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button></div>))}</div>
                </div>
            </div>
        </form>
    );
};

// --- Main Export: FlightsTab ---
const FlightsTab = ({ flights, airports, rules, onEdit, onDelete, onCreate, onBookTicket }) => {
    const [subTab, setSubTab] = useState('list');
    const [editingFlight, setEditingFlight] = useState(null);
    const [flightToDelete, setFlightToDelete] = useState(null);

    // 👇 LOGIC PHÂN QUYỀN (MỚI THÊM)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const canManage = ['Quản trị', 'Điều hành bay'].includes(user.role); // Sửa/Xóa/Thêm
    const canBook = ['Quản trị', 'Nhân viên'].includes(user.role); // Đặt vé
    
    const handleEditClick = (flight) => { setEditingFlight(flight); setSubTab('edit'); };
    const handleSave = (updatedFlight) => { onEdit(updatedFlight); setSubTab('list'); setEditingFlight(null); };
    const handleCreate = (newFlight) => { onCreate(newFlight); setSubTab('list'); };
    const handleDeleteClick = (flightId) => { setFlightToDelete(flightId); };
    const confirmDelete = () => { onDelete(flightToDelete); setFlightToDelete(null); };
    const cancelDelete = () => { setFlightToDelete(null); };
    const handleCancel = () => { setSubTab('list'); setEditingFlight(null); };
    
    const SubTabButton = ({ value, children }) => (<button onClick={() => setSubTab(value)} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>);

    const renderContent = () => {
        switch(subTab) {
            case 'list': 
                return (
                    <FlightList 
                        flights={flights} 
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick} 
                        onBookTicket={onBookTicket}
                        // 👇 Truyền quyền xuống FlightList
                        canManage={canManage}
                        canBook={canBook}
                    />
                );
            case 'create': 
                // Bảo vệ thêm 1 lớp: Nếu không có quyền quản lý mà cố vào tab create thì không render form
                return canManage ? <FlightForm onSubmit={handleCreate} onCancel={handleCancel} airports={airports} rules={rules} /> : <div className="p-6 text-red-500">Bạn không có quyền tạo chuyến bay.</div>;
            case 'edit': 
                return canManage ? <FlightForm initialData={editingFlight} onSubmit={handleSave} onCancel={handleCancel} airports={airports} rules={rules} /> : <div className="p-6 text-red-500">Bạn không có quyền chỉnh sửa.</div>;
            default: return null;
        }
    }

    return (
        <div>
            <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <SubTabButton value="list">Danh sách chuyến bay</SubTabButton>
                    
                    {/* 👇 CHỈ HIỆN NÚT "Tạo chuyến bay mới" NẾU CÓ QUYỀN QUẢN LÝ */}
                    {canManage && (
                        <SubTabButton value="create">Tạo chuyến bay mới</SubTabButton>
                    )}

                    {subTab === 'edit' && (<span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">Chi tiết chuyến bay</span>)}
                </div>
            </div>
            <div>{renderContent()}</div>
            {flightToDelete && (<ConfirmationModal message="Bạn có chắc chắn muốn xóa chuyến bay này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>)}
        </div>
    );
}

export default FlightsTab;