// src/pages/MainScreen.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// --- ICONS ---
const CloudIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const PlaneTakeoff = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 22h20"/><path d="M6.36 17.41 2.88 19.9a2.53 2.53 0 0 1-3.62-3.62l2.49-3.48L8 16l-1.64 1.41Z"/><path d="m21.5 2.5-5.3 10.2-2.3-2.3 4.2-8.1a2 2 0 0 0-2.8-2.8l-8.1 4.2-2.3-2.3L12.7 2.2a2.4 2.4 0 0 1 3.2.3L21.2 7a2.4 2.4 0 0 1 .3 3.2Z"/>
    </svg>
);
const SearchIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const EditIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const CalendarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const PlusCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>);
const BuildingIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>;
const TicketIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;
const DollarSignIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const Eye = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOff = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>;
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  // Khóa cuộn khi mở modal
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, []);

  // Đóng khi nhấn Esc
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Xác nhận</h3>
        <p className="text-gray-600 mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

// 2. Main Application Screen (after login)

// 2a. Content for "Danh sách chuyến bay"
const FlightList = ({ flights, onEdit, onDelete, onBookTicket }) => {
    // ... same as before
    const [searchDate, setSearchDate] = useState('');
    const [fromCitySearch, setFromCitySearch] = useState('all');
    const [toCitySearch, setToCitySearch] = useState('all');
    const [filteredFlights, setFilteredFlights] = useState(flights);
    useEffect(() => { if (!searchDate && fromCitySearch === 'all' && toCitySearch === 'all') { setFilteredFlights(flights); } }, [searchDate, fromCitySearch, toCitySearch, flights]);
    useEffect(() => { handleSearch(); }, [flights]);
    const handleSearch = () => { let results = flights; if (searchDate) { results = results.filter(flight => flight.date === searchDate); } if (fromCitySearch && fromCitySearch !== 'all') { results = results.filter(flight => flight.fromCity === fromCitySearch); } if (toCitySearch && toCitySearch !== 'all') { results = results.filter(flight => flight.toCity === toCitySearch); } setFilteredFlights(results); };
    const allCities = [...new Set(flights.flatMap(f => [f.fromCity, f.toCity]))];
    return (<div className="p-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-gray-50"><div className="relative"><input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /><CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div><select value={fromCitySearch} onChange={(e) => setFromCitySearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all">Tất cả nơi đi</option>{allCities.map(city => <option key={`from-${city}`} value={city}>{city}</option>)}</select><select value={toCitySearch} onChange={(e) => setToCitySearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all">Tất cả nơi đến</option>{allCities.map(city => <option key={`to-${city}`} value={city}>{city}</option>)}</select><button onClick={handleSearch} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow">Tìm kiếm</button></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-100"><tr>{['Mã chuyến bay', 'Sân bay cất cánh', 'Nơi cất cánh', 'Sân bay hạ cánh', 'Nơi hạ cánh', 'Thời gian', 'Ghế trống', 'Ghế đã đặt', 'Thao tác'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}</tr></thead><tbody>{filteredFlights.map(f => (<tr key={f.id} className="border-b hover:bg-blue-50 transition"><td className="p-3 font-mono text-blue-700">{f.id}</td><td className="p-3">{f.fromAirport}</td><td className="p-3">{f.fromCity}</td><td className="p-3">{f.toAirport}</td><td className="p-3">{f.toCity}</td><td className="p-3">{f.time}</td><td className="p-3 text-green-600 font-medium">{f.seatsEmpty}</td><td className="p-3 text-red-600 font-medium">{f.seatsTaken}</td><td className="p-3"><div className="flex items-center space-x-1"><button onClick={() => onBookTicket(f)} className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-600">Đặt vé</button><button onClick={() => onEdit(f)} className="p-1 text-gray-500 hover:text-green-600"><EditIcon className="w-4 h-4"/></button><button onClick={() => onDelete(f.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button></div></td></tr>))}</tbody></table></div></div>);
};

// 2b. Reusable Form for Create/Edit Flight
const FlightForm = ({ initialData, onSubmit, onCancel, airports, rules }) => {
    const isEditMode = !!initialData;
    const [flightData, setFlightData] = useState(isEditMode ? initialData : { fromAirport: '', fromCity: '', toAirport: '', toCity: '', planeId: '', date: '', hour: '', minute: '', duration: '', price: '', businessSeats: 30, economySeats: 30, seatsTaken: 0, });
    const [intermediateAirports, setIntermediateAirports] = useState(isEditMode ? initialData.intermediateAirports : []);
    
    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        let fromCity = flightData.fromCity;
        let toCity = flightData.toCity;
        if(name === 'fromAirport') {
            fromCity = airports.find(a => a.name === value)?.city || '';
        }
         if(name === 'toAirport') {
            toCity = airports.find(a => a.name === value)?.city || '';
        }
        setFlightData(prev => ({ ...prev, [name]: value, fromCity, toCity })); 
    };
    const handleAddAirport = () => { 
        if(intermediateAirports.length >= rules.maxStopovers) {
            alert(`Chỉ được phép tối đa ${rules.maxStopovers} sân bay trung gian.`);
            return;
        }
        const newAirport = { id: Date.now(), name: '', duration: rules.minStopTime, notes: '' }; 
        setIntermediateAirports([...intermediateAirports, newAirport]); 
    };
    const handleAirportChange = (id, field, value) => { setIntermediateAirports(intermediateAirports.map(airport => airport.id === id ? { ...airport, [field]: value } : airport)); };
    const handleRemoveAirport = (id) => { setIntermediateAirports(intermediateAirports.filter(airport => airport.id !== id)); };
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if(parseInt(flightData.duration, 10) < rules.minFlightTime){
            alert(`Thời gian bay tối thiểu là ${rules.minFlightTime} phút.`);
            return;
        }
        onSubmit({ ...flightData, intermediateAirports }); 
    };

    return (<form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-4 p-4 border rounded-lg bg-white"><h3 className="font-semibold text-lg text-gray-700">Thông tin chuyến bay</h3><div className="grid grid-cols-2 gap-4"><select name="fromAirport" value={flightData.fromAirport} onChange={handleInputChange} className="w-full p-2 border rounded">
                    <option value="">-- Chọn sân bay đi --</option>
                    {airports.map(a => <option key={a.id} value={a.name}>{a.name} ({a.city})</option>)}
                </select><select name="toAirport" value={flightData.toAirport} onChange={handleInputChange} className="w-full p-2 border rounded">
                    <option value="">-- Chọn sân bay đến --</option>
                    {airports.map(a => <option key={a.id} value={a.name}>{a.name} ({a.city})</option>)}
                </select><input name="planeId" value={flightData.planeId} onChange={handleInputChange} placeholder="Mã máy bay (VD: PE0003)" className="w-full p-2 border rounded" /><input name="date" type="date" value={flightData.date} onChange={handleInputChange} className="w-full p-2 border rounded" /><div className="flex gap-2 col-span-2"><input name="hour" type="number" value={flightData.hour} onChange={handleInputChange} placeholder="Giờ" className="w-1/3 p-2 border rounded" /><input name="minute" type="number" value={flightData.minute} onChange={handleInputChange} placeholder="Phút" className="w-1/3 p-2 border rounded" /><input name="duration" type="number" value={flightData.duration} onChange={handleInputChange} placeholder="Thời gian bay (phút)" className="w-1/3 p-2 border rounded" /></div><input name="price" type="number" value={flightData.price} onChange={handleInputChange} placeholder="Giá vé" className="w-full col-span-2 p-2 border rounded" /></div><div className="flex items-center gap-4 mt-4"><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow">{isEditMode ? 'Lưu thay đổi' : 'Tạo chuyến bay'}</button><button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition">Hủy</button></div></div><div className="space-y-4"><div className="p-4 border rounded-lg space-y-2 bg-white"><h3 className="font-semibold text-gray-700">Số lượng ghế (lấy từ máy bay)</h3><div className="flex items-center"><label className="w-24">Thương gia</label><input name="businessSeats" type="number" value={flightData.businessSeats} readOnly className="flex-1 p-2 border rounded bg-gray-100" /></div><div className="flex items-center"><label className="w-24">Phổ thông</label><input name="economySeats" type="number" value={flightData.economySeats} readOnly className="flex-1 p-2 border rounded bg-gray-100" /></div></div><div className="p-4 border rounded-lg space-y-2 bg-white"><div className="flex justify-between items-center"><h3 className="font-semibold text-gray-700">Sân bay trung gian</h3><button type="button" onClick={handleAddAirport} className="p-1 rounded-full hover:bg-blue-100 text-blue-600"><PlusCircleIcon className="w-6 h-6"/></button></div><div className="space-y-2">{intermediateAirports.map((airport, index) => (<div key={airport.id} className="flex items-center gap-2"><span className="font-bold text-gray-500">{index + 1}</span><select value={airport.name} onChange={(e) => handleAirportChange(airport.id, 'name', e.target.value)} className="flex-1 p-2 border rounded">
                                <option value="">-- Chọn sân bay --</option>
                                {airports.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select><input value={airport.duration} onChange={(e) => handleAirportChange(airport.id, 'duration', e.target.value)} type="number" min={rules.minStopTime} max={rules.maxStopTime} placeholder="TG dừng" className="w-20 p-2 border rounded" /><input value={airport.notes} onChange={(e) => handleAirportChange(airport.id, 'notes', e.target.value)} placeholder="Ghi chú" className="flex-1 p-2 border rounded" /><button type="button" onClick={() => handleRemoveAirport(airport.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button></div>))}</div></div></div></form>)
};


// 2c. Main content for the "Chuyến bay" tab
const FlightsTabContent = ({ flights, airports, rules, onEdit, onDelete, onCreate, onBookTicket }) => {
    const [subTab, setSubTab] = useState('list');
    const [editingFlight, setEditingFlight] = useState(null);
    const [flightToDelete, setFlightToDelete] = useState(null);
    const handleEditClick = (flight) => { setEditingFlight(flight); setSubTab('edit'); };
    const handleSave = (updatedFlight) => { onEdit(updatedFlight); setSubTab('list'); setEditingFlight(null); };
    const handleCreate = (newFlight) => { onCreate(newFlight); setSubTab('list'); };
    const handleDeleteClick = (flightId) => { setFlightToDelete(flightId); };
    const confirmDelete = () => { onDelete(flightToDelete); setFlightToDelete(null); };
    const cancelDelete = () => { setFlightToDelete(null); };
    const handleCancel = () => { setSubTab('list'); setEditingFlight(null); };
    const handleBookTicketClick = (flight) => { onBookTicket(flight); }
    const SubTabButton = ({ value, children }) => (<button onClick={() => setSubTab(value)} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>);
    const renderContent = () => {
        switch(subTab) {
            case 'list': return <FlightList flights={flights} onEdit={handleEditClick} onDelete={handleDeleteClick} onBookTicket={handleBookTicketClick} />;
            case 'create': return <FlightForm onSubmit={handleCreate} onCancel={handleCancel} airports={airports} rules={rules} />;
            case 'edit': return <FlightForm initialData={editingFlight} onSubmit={handleSave} onCancel={handleCancel} airports={airports} rules={rules} />;
            default: return null;
        }
    }
    return (<div><div className="px-6 pt-4 pb-2 border-b flex items-center justify-between"><div className="flex items-center space-x-2"><SubTabButton value="list">Danh sách chuyến bay</SubTabButton><SubTabButton value="create">Tạo chuyến bay mới</SubTabButton>{subTab === 'edit' && (<span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">Chi tiết chuyến bay</span>)}</div></div><div>{renderContent()}</div>{flightToDelete && (<ConfirmationModal message="Bạn có chắc chắn muốn xóa chuyến bay này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>)}</div>);
}

// 2d. Reusable Form for Create/Edit Ticket
const TicketForm = ({ initialData, flightForBooking, allFlights, allAirplanes, allTickets, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [airplane, setAirplane] = useState(null);
    const [ticketInfo, setTicketInfo] = useState({ flightId: '', price: '', name: '', idCard: '', phone: '', email: '' });
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatClass, setSeatClass] = useState('Thương gia');
    
    useEffect(() => {
        let flight = null;
        if (isEditMode) {
            flight = allFlights.find(f => f.id === initialData.flightId);
            setTicketInfo(initialData);
            setSelectedSeat(initialData.seat);
            setSeatClass(initialData.seatClass);
        } else if (flightForBooking) {
            flight = flightForBooking;
            setTicketInfo({ flightId: flight.id, price: flight.price, name: '', idCard: '', phone: '', email: '' });
        }
        setSelectedFlight(flight);
    }, [initialData, flightForBooking, allFlights, isEditMode]);

    useEffect(() => {
        if (selectedFlight) {
            const plane = allAirplanes.find(p => p.id === selectedFlight.planeId);
            setAirplane(plane);
        } else {
            setAirplane(null);
        }
    }, [selectedFlight, allAirplanes]);
    
    useEffect(() => {
        if (selectedSeat) {
            const seatType = selectedSeat.startsWith('B') ? 'Thương gia' : 'Phổ thông';
            if (seatType !== seatClass) {
                setSelectedSeat(null);
            }
        }
    }, [seatClass, selectedSeat]);

    const handleFlightSelect = (flightId) => {
        const flight = allFlights.find(f => f.id === flightId);
        if (flight) {
            setSelectedFlight(flight);
            setTicketInfo({ flightId: flight.id, price: flight.price, name: '', idCard: '', phone: '', email: '' });
            setSelectedSeat(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSeat) {
            alert("Vui lòng chọn một ghế.");
            return;
        }
        const finalTicketData = { ...ticketInfo, seat: selectedSeat, seatClass, ticketId: isEditMode ? initialData.ticketId : `TK${Math.floor(1000 + Math.random() * 9000)}` };
        onSubmit(finalTicketData);
    };
    
    const Seat = ({ id, type, isTaken }) => {
        const isSelected = selectedSeat === id;
        const isDisabledByClass = (type === 'business' && seatClass !== 'Thương gia') || (type === 'economy' && seatClass !== 'Phổ thông');

        let seatClassStyle = "";
        if (isDisabledByClass) {
            seatClassStyle = "bg-gray-200 text-gray-400 cursor-not-allowed";
        } else if (isTaken) {
            seatClassStyle = "bg-gray-500 cursor-not-allowed text-white";
        } else if (isSelected) {
            seatClassStyle = "bg-red-500 text-white";
        } else if (type === 'business') {
            seatClassStyle = "bg-teal-200 hover:bg-teal-300 text-teal-800";
        } else { // economy
            seatClassStyle = "bg-cyan-200 hover:bg-cyan-300 text-cyan-800";
        }

        const canClick = !isTaken && !isDisabledByClass;
        
        return <button type="button" onClick={() => canClick && setSelectedSeat(id)} className={`w-10 h-10 rounded text-xs font-semibold flex items-center justify-center transition-colors ${seatClassStyle}`}>{id}</button>
    };
    
    const bookedSeats = allTickets.filter(ticket => ticket.flightId === selectedFlight?.id).map(ticket => ticket.seat);

    return (
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
                <h3 className="font-semibold text-lg text-gray-700">Thông tin vé</h3>
                <select value={selectedFlight?.id || ''} onChange={(e) => handleFlightSelect(e.target.value)} disabled={!!flightForBooking || isEditMode} className="w-full p-2 border rounded bg-white disabled:bg-gray-100">
                    <option value="">-- Chọn chuyến bay --</option>
                    {allFlights.map(f => <option key={f.id} value={f.id}>{f.id}: {f.fromCity} - {f.toCity}</option>)}
                </select>
                <input value={selectedFlight ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedFlight.price) : ''} readOnly placeholder="Giá vé" className="w-full p-2 border rounded bg-gray-100" />
                <input value={ticketInfo.name} onChange={(e) => setTicketInfo({...ticketInfo, name: e.target.value})} placeholder="Họ và tên" className="w-full p-2 border rounded" />
                <input value={ticketInfo.idCard} onChange={(e) => setTicketInfo({...ticketInfo, idCard: e.target.value})} placeholder="CMND/CCCD" className="w-full p-2 border rounded" />
                <input value={ticketInfo.phone} onChange={(e) => setTicketInfo({...ticketInfo, phone: e.target.value})} placeholder="Số điện thoại" className="w-full p-2 border rounded" />
                <input value={ticketInfo.email} onChange={(e) => setTicketInfo({...ticketInfo, email: e.target.value})} type="email" placeholder="Email" className="w-full p-2 border rounded" />
                <div className="flex gap-2">
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition">{isEditMode ? 'Lưu vé' : 'Tạo vé'}</button>
                    {isEditMode && <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition">Hủy</button>}
                </div>
            </div>
            <div className={`lg:col-span-2 p-4 border rounded-lg bg-white ${!selectedFlight ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="flex justify-center gap-2 mb-4">
                    <button type="button" onClick={() => setSeatClass('Phổ thông')} className={`px-4 py-2 rounded ${seatClass === 'Phổ thông' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} disabled={!selectedFlight}>Phổ thông</button>
                    <button type="button" onClick={() => setSeatClass('Thương gia')} className={`px-4 py-2 rounded ${seatClass === 'Thương gia' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`} disabled={!selectedFlight}>Thương gia</button>
                </div>
                <div className={`grid grid-cols-6 gap-2 ${!selectedFlight ? 'pointer-events-none' : ''}`}>
                    {airplane && Array.from({ length: airplane.businessSeats }, (_, i) => `B${i+1}`).map(seatId => <Seat key={seatId} id={seatId} type="business" isTaken={bookedSeats.includes(seatId)} />)}
                    {airplane && Array.from({ length: airplane.economySeats }, (_, i) => `E${i+1}`).map(seatId => <Seat key={seatId} id={seatId} type="economy" isTaken={bookedSeats.includes(seatId)} />)}
                </div>
            </div>
        </form>
    );
};

// 2e. Content for "Tra cứu vé"
// 2e. Content for "Tra cứu vé"
const LookupTicket = ({ tickets, onEdit, onDelete }) => {
  const [mode, setMode] = useState('flightId'); // 'flightId' | 'ticketId'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(tickets);

  // khi danh sách vé thay đổi -> làm mới kết quả
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets, mode]);

  const normalize = (s) => (s ?? '').toString().trim().toLowerCase();

  const handleSearch = () => {
    const q = normalize(query);
    if (!q) {
      setResults(tickets);
      return;
    }
    const filtered = tickets.filter((t) => normalize(t[mode]).includes(q));
    setResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(tickets);
  };

  return (
    <div className="p-6">
      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="flightId">Tìm kiếm theo mã chuyến bay</option>
          <option value="ticketId">Tìm kiếm theo mã vé</option>
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'flightId' ? 'VD: FL0069' : 'VD: TK1234'}
          className="flex-1 p-2 border rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow"
        >
          Tìm kiếm
        </button>

        <button
          onClick={clearSearch}
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
        >
          Xóa
        </button>
      </div>

      {/* Bảng kết quả */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {[
                'Mã vé',
                'Mã chuyến bay',
                'Họ và tên',
                'CMND/CCCD',
                'Số điện thoại',
                'Email',
                'Ghế',
                'Hạng vé',
                'Giá tiền',
                'Thao tác',
              ].map((h) => (
                <th key={h} className="p-3 font-semibold text-gray-600 text-sm">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500 italic" colSpan={10}>
                  Không có kết quả phù hợp.
                </td>
              </tr>
            ) : (
              results.map((t) => (
                <tr key={t.ticketId} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-mono text-green-700">{t.ticketId}</td>
                  <td className="p-3 font-mono text-blue-700">{t.flightId}</td>
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.idCard}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3 font-bold">{t.seat}</td>
                  <td className="p-3">{t.seatClass}</td>
                  <td className="p-3">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="Sửa"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t.ticketId)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Xóa"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2f. Main content for the "Vé máy bay" tab
const TicketsTabContent = ({ flightToBook, allFlights, allAirplanes, onCreateTicket, onUpdateTicket, onDeleteTicket, tickets }) => {
    const [subTab, setSubTab] = useState('create');
    const [editingTicket, setEditingTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    
    useEffect(() => {
        if (flightToBook) {
            setSubTab('create');
            setEditingTicket(null);
        }
    }, [flightToBook]);

    const handleEditClick = (ticket) => {
        setEditingTicket(ticket);
        setSubTab('edit');
    };
    
    const handleDeleteClick = (ticketId) => {
        setTicketToDelete(ticketId);
    };

    const confirmDelete = () => {
        onDeleteTicket(ticketToDelete);
        setTicketToDelete(null);
    };

    const cancelDelete = () => setTicketToDelete(null);

    const handleCancelEdit = () => {
        setEditingTicket(null);
        setSubTab('lookup');
    };
    
    const handleFormSubmit = (ticketData) => {
        if (editingTicket) {
            onUpdateTicket(ticketData);
        } else {
            onCreateTicket(ticketData);
        }
        setEditingTicket(null);
        setSubTab('lookup');
    };

    const SubTabButton = ({ value, children }) => (
        <button onClick={() => setSubTab(value)} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>
    );

     const renderContent = () => {
        switch(subTab) {
            case 'create':
                return <TicketForm allFlights={allFlights} allAirplanes={allAirplanes} allTickets={tickets} flightForBooking={flightToBook} onSubmit={handleFormSubmit} />;
            case 'lookup':
                return <LookupTicket tickets={tickets} onEdit={handleEditClick} onDelete={handleDeleteClick}/>;
            case 'edit':
                 return <TicketForm initialData={editingTicket} allFlights={allFlights} allAirplanes={allAirplanes} allTickets={tickets} onSubmit={handleFormSubmit} onCancel={handleCancelEdit} />;
            default:
                return null;
        }
    }

    return (
         <div>
            <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <SubTabButton value="create">Tạo vé máy bay</SubTabButton>
                    <SubTabButton value="lookup">Tra cứu</SubTabButton>
                     {subTab === 'edit' && (<span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">Chỉnh sửa vé</span>)}
                </div>
            </div>
            <div>{renderContent()}</div>
            {ticketToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa vé này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
}

// 2g. Donut Chart component
const DonutChart = ({ data }) => {
    const size = 180;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;
    return ( <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e6e6e6" strokeWidth={strokeWidth}></circle> {data.map((item, index) => { const percent = item.value / 100 * circumference; const offset = circumference - percent; const rotation = accumulatedPercent * 3.6; accumulatedPercent += item.value; return ( <circle key={index} cx={size/2} cy={size/2} r={radius} fill="none" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={`${percent} ${offset}`} strokeDashoffset={0} transform={`rotate(${rotation - 90} ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 0.3s ease' }} /> ) })} </svg> )
}

// 2h. Monthly Report
const MonthlyReport = () => (
    <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full"><BuildingIcon className="w-6 h-6 text-blue-600"/></div>
                <div>
                    <p className="text-sm text-gray-500">Tổng chuyến bay</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full"><TicketIcon className="w-6 h-6 text-green-600"/></div>
                <div>
                    <p className="text-sm text-gray-500">Tổng vé</p>
                    <p className="text-2xl font-bold text-gray-800">4</p>
                </div>
            </div>
             <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full"><DollarSignIcon className="w-6 h-6 text-yellow-600"/></div>
                <div>
                    <p className="text-sm text-gray-500">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-800">17,370,499 ₫</p>
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh sách báo cáo tháng</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50">
                        <tr className="border-b">
                            {['STT', 'Chuyến bay', 'Số vé', 'Doanh thu', 'Tỷ lệ (%)'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}
                        </tr>
                    </thead>
                     <tbody>
                         <tr className="border-b"><td className="p-3">1</td><td className="p-3">Sân bay Quốc tế Tân Sơn Nhất - Sân bay Quốc tế Nội Bài</td><td className="p-3">1</td><td className="p-3">10,499 ₫</td><td className="p-3">0.06</td></tr>
                         <tr className="border-b"><td className="p-3">2</td><td className="p-3">Sân bay Cam Ranh - Sân bay Cần Thơ</td><td className="p-3">3</td><td className="p-3">17,360,000 ₫</td><td className="p-3">99.94</td></tr>
                         <tr><td className="p-3">3</td><td className="p-3">Sân bay Cam Ranh - Sân bay Cát Bi</td><td className="p-3">0</td><td className="p-3">0 ₫</td><td className="p-3">0.00</td></tr>
                     </tbody>
                </table>
            </div>
        </div>
    </div>
);

// 2i. Yearly Report
const YearlyReport = () => {
    const chartData = [ { label: '7', value: 48.77, color: '#3b82f6' }, { label: '8', value: 51.23, color: '#f59e0b' }, ];
    return ( <div className="p-6 space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4"> <div className="p-3 bg-blue-100 rounded-full"><BuildingIcon className="w-6 h-6 text-blue-600"/></div> <div> <p className="text-sm text-gray-500">Tổng chuyến bay</p> <p className="text-2xl font-bold text-gray-800">6</p> </div> </div> <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4"> <div className="p-3 bg-yellow-100 rounded-full"><DollarSignIcon className="w-6 h-6 text-yellow-600"/></div> <div> <p className="text-sm text-gray-500">Tổng doanh thu</p> <p className="text-2xl font-bold text-gray-800">35,615,499 ₫</p> </div> </div> </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> <div className="lg:col-span-2"> <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh sách báo cáo năm</h3> <div className="bg-white rounded-lg shadow overflow-hidden"> <table className="w-full text-left"> <thead className="bg-gray-50"><tr className="border-b">{['STT', 'Tháng', 'Số chuyến bay', 'Doanh thu', 'Tỷ lệ (%)'].map(h => <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>)}</tr></thead> <tbody> <tr className="border-b"><td className="p-3">1</td><td className="p-3">7</td><td className="p-3">3</td><td className="p-3">17,370,499 ₫</td><td className="p-3">48.77</td></tr> <tr><td className="p-3">2</td><td className="p-3">8</td><td className="p-3">3</td><td className="p-3">18,245,000 ₫</td><td className="p-3">51.23</td></tr> </tbody> </table> </div> </div> <div className="p-4 bg-white rounded-lg shadow"> <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Biểu đồ tròn doanh thu năm</h3> <div className="flex justify-center items-center h-48"> <DonutChart data={chartData} /> </div> <div className="flex justify-center gap-4 mt-4"> {chartData.map(item => ( <div key={item.label} className="flex items-center gap-2 text-sm"> <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span> <span>Tháng {item.label}</span> </div> ))} </div> </div> </div> </div> );
}

// 2j. Main content for "Báo cáo" tab
const ReportsTabContent = () => {
    const [reportType, setReportType] = useState('month');
    return ( <div> <div className="p-4 bg-white border-b flex justify-between items-center"> <div className="flex items-center gap-4"> <select onChange={(e) => setReportType(e.target.value)} value={reportType} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="month">Báo cáo theo tháng</option> <option value="year">Báo cáo theo năm</option> </select> {reportType === 'month' ? ( <input type="month" defaultValue="2024-07" className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> ) : ( <input type="number" defaultValue="2024" className="p-2 border rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"/> )} </div> <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition">Xuất Excel</button> </div> {reportType === 'month' ? <MonthlyReport /> : <YearlyReport />} </div> );
};

// 2k. Airplane Form
const AirplaneForm = ({ initialData, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    const [planeData, setPlaneData] = useState(
        isEditMode ? initialData : { name: 'Máy bay M', economySeats: 12, businessSeats: 6 }
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlaneData(prev => ({...prev, [name]: value}));
    }

    const totalSeats = (parseInt(planeData.economySeats, 10) || 0) + (parseInt(planeData.businessSeats, 10) || 0);
    
    const handleSubmit = () => {
        onSubmit({ ...planeData, totalSeats });
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-700">Thông tin máy bay</h3>
                <input name="name" value={planeData.name} onChange={handleInputChange} placeholder="Tên máy bay" className="w-full p-2 border rounded" />
                
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h4 className="font-semibold text-gray-600 mb-2">Chi tiết hạng vé</h4>
                    <div className="flex items-center">
                        <label className="w-24">Phổ thông</label>
                        <input name="economySeats" type="number" value={planeData.economySeats} onChange={handleInputChange} className="flex-1 p-2 border rounded" />
                    </div>
                     <div className="flex items-center">
                        <label className="w-24">Thương gia</label>
                        <input name="businessSeats" type="number" value={planeData.businessSeats} onChange={handleInputChange} className="flex-1 p-2 border rounded" />
                    </div>
                </div>

                 <div className="p-2 border rounded-lg bg-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-600">Tổng số ghế:</span>
                    <span className="font-bold text-xl text-blue-600">{totalSeats}</span>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu</button>
                    <button onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy</button>
                </div>
            </div>
            <div className="lg:col-span-2 p-4 border rounded-lg bg-white">
                <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: planeData.businessSeats }, (_, i) => (
                         <div key={`b-${i}`} className="w-10 h-10 bg-teal-200 rounded flex items-center justify-center text-teal-800 text-xs font-semibold">
                           {`B${i + 1}`}
                        </div>
                    ))}
                    {Array.from({ length: planeData.economySeats }, (_, i) => (
                        <div key={`e-${i}`} className="w-10 h-10 bg-cyan-200 rounded flex items-center justify-center text-cyan-800 text-xs">
                           {`E${i + 1}`}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 2l. Airplanes List
const AirplanesList = ({ airplanes, onEdit, onCreate, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAirplanes = airplanes.filter(plane =>
        plane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plane.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Tìm mã hoặc tên máy bay..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button onClick={onCreate} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all shadow flex items-center space-x-2">
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Tạo mới</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Mã máy bay</th>
                            <th className="p-4 font-semibold text-gray-600">Tên máy bay</th>
                            <th className="p-4 font-semibold text-gray-600">Số lượng ghế</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAirplanes.map(plane => (
                            <tr key={plane.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-blue-600">{plane.id}</td>
                                <td className="p-4 text-gray-800">{plane.name}</td>
                                <td className="p-4 text-gray-800">{plane.totalSeats}</td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => onEdit(plane)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition"><EditIcon className="w-4 h-4"/></button>
                                        <button onClick={() => onDelete(plane.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// 2m. Main content for "Máy bay" tab
const AirplanesTabContent = ({ airplanes, onCreate, onEdit, onDelete }) => {
    const [subTab, setSubTab] = useState('list'); // 'list', 'create', 'edit'
    const [editingAirplane, setEditingAirplane] = useState(null);
    const [airplaneToDelete, setAirplaneToDelete] = useState(null);

    const handleCreateClick = () => {
        setEditingAirplane(null);
        setSubTab('create');
    }

    const handleEditClick = (plane) => {
        setEditingAirplane(plane);
        setSubTab('edit');
    }

    const handleDeleteClick = (planeId) => {
        setAirplaneToDelete(planeId);
    }
    
    const confirmDelete = () => {
        onDelete(airplaneToDelete);
        setAirplaneToDelete(null);
    }
    
    const cancelDelete = () => setAirplaneToDelete(null);

    const handleCancel = () => {
        setEditingAirplane(null);
        setSubTab('list');
    }

    const handleSave = (planeData) => {
        if (editingAirplane) {
            onEdit({ ...editingAirplane, ...planeData });
        } else {
            onCreate(planeData);
        }
        setSubTab('list');
        setEditingAirplane(null);
    }
    
    const SubTabButton = ({ value, children }) => (
        <button onClick={() => { setSubTab(value); setEditingAirplane(null); }} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value && !editingAirplane ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {children}
        </button>
    );

    const renderContent = () => {
        switch(subTab) {
            case 'list':
                return <AirplanesList airplanes={airplanes} onCreate={handleCreateClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>;
            case 'create':
            case 'edit':
                return <AirplaneForm initialData={editingAirplane} onSubmit={handleSave} onCancel={handleCancel} />;
            default: return null;
        }
    }

    return (
        <div>
            <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <SubTabButton value="list">Danh sách máy bay</SubTabButton>
                    <SubTabButton value="create">Tạo máy bay mới</SubTabButton>
                    {subTab === 'edit' && (
                        <span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">
                            Chi tiết máy bay
                        </span>
                    )}
                </div>
            </div>
            <div>{renderContent()}</div>
            {airplaneToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa máy bay này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};


// 2n. User Management Tab
const UserManagementTabContent = ({ users, permissions, onCreateUser, onDeleteUser, onUpdateUser, onSavePermissions }) => {
    const [localPermissions, setLocalPermissions] = useState(permissions);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [saveButtonText, setSaveButtonText] = useState('Lưu');

    useEffect(() => {
        setLocalPermissions(permissions);
    }, [permissions]);

    const handlePermissionChange = (role, permission, value) => {
        setLocalPermissions(prev => ({
            ...prev,
            [role]: { ...prev[role], [permission]: value }
        }));
    };
    
    const handleSavePermissions = () => {
        onSavePermissions(localPermissions);
        setSaveButtonText("Đã lưu!");
        setTimeout(() => setSaveButtonText("Lưu"), 2000);
    }

    const handleCreateUser = (newUser) => {
        onCreateUser(newUser);
    }
    
    const handleUpdateUser = (updatedUser) => {
        onUpdateUser(updatedUser);
        setEditingUser(null); 
    }

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
    };

    const confirmDelete = () => {
        onDeleteUser(userToDelete);
        setUserToDelete(null);
    };

    const cancelDelete = () => {
        setUserToDelete(null);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
    }
    
    const handleCancelEdit = () => {
        setEditingUser(null);
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Permissions Table */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Quyền hạn của các nhóm tài khoản</h3>
                            <button onClick={handleSavePermissions} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition w-24">
                                {saveButtonText}
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Nhóm quyền', 'Chuyến bay', 'Vé chuyến bay', 'Báo cáo', 'Máy bay', 'Tài khoản và quyền', 'Cài đặt'].map(h => 
                                            <th key={h} className="p-3 font-semibold text-gray-600">{h}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(localPermissions).map(([role, perms]) => (
                                        <tr key={role} className="border-b">
                                            <td className="p-3 font-semibold text-gray-700">{role}</td>
                                            {Object.entries(perms).map(([permKey, hasPermission]) => (
                                                <td key={permKey} className="p-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={hasPermission}
                                                        onChange={(e) => handlePermissionChange(role, permKey, e.target.checked)}
                                                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quản lý tài khoản</h3>
                        <div className="bg-white rounded-lg shadow overflow-hidden max-h-72 overflow-y-auto border">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {['Tên tài khoản', 'Ngày tạo', 'Nhóm quyền', 'Thao tác'].map(h => 
                                            <th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.date}</td>
                                            <td className="p-3">{user.role}</td>
                                            <td className="p-3">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEditClick(user)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDeleteClick(user.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Create/Edit User Form */}
                <UserForm 
                    key={editingUser ? editingUser.id : 'create'}
                    initialData={editingUser}
                    roles={Object.keys(localPermissions)}
                    onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                    onCancel={editingUser ? handleCancelEdit : null}
                />
            </div>
            {userToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa tài khoản này?" onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};

// 2o. User Form Component
const UserForm = ({ initialData, roles, onSubmit, onCancel }) => {
    const isEditMode = !!initialData;
    const [userData, setUserData] = useState(
        isEditMode ? { ...initialData, password: '' } : { name: '', email: '', phone: '', password: '', role: 'Nhân viên' }
    );
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserData(prev => ({...prev, [name]: value}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(userData);
        if (!isEditMode) {
             setUserData({ name: '', email: '', phone: '', password: '', role: 'Nhân viên' });
        }
    }
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditMode ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                    <input name="name" value={userData.name} onChange={handleInputChange} required placeholder="Nhập họ và tên của tài khoản" className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Email:</label>
                    <input name="email" value={userData.email} onChange={handleInputChange} required placeholder="Nhập email của tài khoản" type="email" className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                    <input name="phone" value={userData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại của tài khoản" type="tel" className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="relative">
                    <label className="text-sm font-medium text-gray-600">Mật khẩu:</label>
                    <input name="password" value={userData.password} onChange={handleInputChange} required={!isEditMode} placeholder={isEditMode ? "Để trống nếu không đổi" : "Nhập mật khẩu"} type={passwordVisible ? "text" : "password"} className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                       {passwordVisible ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Nhóm phân quyền:</label>
                    <select name="role" value={userData.role} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                       {roles.map(role => <option key={role}>{role}</option>)}
                    </select>
                </div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition">{isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}</button>
                    {isEditMode && <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">Hủy</button>}
                </div>
            </form>
        </div>
    )
}

// 2p. Settings Tab
const SettingsTabContent = ({ airports, ticketClasses, rules, onUpdateAirports, onUpdateTicketClasses, onUpdateRules }) => {
    
    const [localAirports, setLocalAirports] = useState(airports);
    const [localTicketClasses, setLocalTicketClasses] = useState(ticketClasses);
    const [localRules, setLocalRules] = useState(rules);

    const [editingAirport, setEditingAirport] = useState(null);
    const [airportData, setAirportData] = useState({ name: '', city: '', country: '' });
    
    const [editingTicketClass, setEditingTicketClass] = useState(null);
    const [ticketClassData, setTicketClassData] = useState({ name: '', percentage: '' });
    const [saveRulesButtonText, setSaveRulesButtonText] = useState('Lưu');
    const [itemToDelete, setItemToDelete] = useState(null); // { type: 'airport' | 'ticketClass', id: ... }

    useEffect(() => {
        setLocalAirports(airports);
        setLocalTicketClasses(ticketClasses);
        setLocalRules(rules);
    }, [airports, ticketClasses, rules]);

    // Airport Logic
    const handleAirportSubmit = (e) => {
        e.preventDefault();
        if(editingAirport) {
            onUpdateAirports(localAirports.map(a => a.id === editingAirport.id ? {...a, ...airportData} : a));
        } else {
            onUpdateAirports([...localAirports, {id: Date.now(), ...airportData}]);
        }
        setEditingAirport(null);
        setAirportData({ name: '', city: '', country: '' });
    };
    
    const handleEditAirport = (airport) => {
        setEditingAirport(airport);
        setAirportData(airport);
    }
    
    // Ticket Class Logic
    const handleTicketClassSubmit = (e) => {
        e.preventDefault();
        if(editingTicketClass) {
             onUpdateTicketClasses(localTicketClasses.map(tc => tc.id === editingTicketClass.id ? {...tc, ...ticketClassData} : tc));
        } else {
            onUpdateTicketClasses([...localTicketClasses, {id: Date.now(), ...ticketClassData}]);
        }
        setEditingTicketClass(null);
        setTicketClassData({ name: '', percentage: '' });
    }
    
    const handleEditTicketClass = (ticketClass) => {
        setEditingTicketClass(ticketClass);
        setTicketClassData(ticketClass);
    }
    
    // Rules Logic
    const handleRuleChange = (e) => {
        const {name, value} = e.target;
        setLocalRules(prev => ({...prev, [name]: value}));
    }
    
    const handleSaveRules = () => {
        onUpdateRules(localRules);
        setSaveRulesButtonText("Đã lưu!");
        setTimeout(() => setSaveRulesButtonText("Lưu"), 2000);
    }

    const handleDeleteClick = (type, id) => {
        setItemToDelete({ type, id });
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'airport') {
            onUpdateAirports(localAirports.filter(a => a.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'ticketClass') {
            onUpdateTicketClasses(localTicketClasses.filter(tc => tc.id !== itemToDelete.id));
        }
        setItemToDelete(null);
    };

    const cancelDelete = () => setItemToDelete(null);

    return(
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Airport Management */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Sân bay</h3>
                    <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {['Tên Sân bay', 'Thành phố', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {localAirports.map(a => (
                                        <tr key={a.id} className="border-b">
                                            <td className="p-2">{a.name}</td>
                                            <td className="p-2">{a.city}</td>
                                            <td className="p-2">
                                                <div className="flex items-center space-x-1">
                                                    <button onClick={() => handleEditAirport(a)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDeleteClick('airport', a.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <form onSubmit={handleAirportSubmit} className="grid grid-cols-3 gap-2">
                            <input value={airportData.name} onChange={(e) => setAirportData({...airportData, name: e.target.value})} placeholder="Tên sân bay" className="p-2 border rounded-md" required/>
                            <input value={airportData.city} onChange={(e) => setAirportData({...airportData, city: e.target.value})} placeholder="Thành phố" className="p-2 border rounded-md" required/>
                            <input value={airportData.country} onChange={(e) => setAirportData({...airportData, country: e.target.value})} placeholder="Quốc gia" className="p-2 border rounded-md" required/>
                         <div className="flex gap-2 col-span-3">
                            <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingAirport ? 'Cập nhật' : 'Thêm'}</button>
                            {editingAirport && <button type="button" onClick={() => { setEditingAirport(null); setAirportData({ name: '', city: '', country: ''})}} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition">Hủy</button>}
                        </div>
                        </form>
                    </div>
                </div>
                
                {/* Ticket Class Management */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Hạng vé</h3>
                     <div className="bg-white rounded-lg shadow p-4 space-y-4">
                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {['Tên hạng vé', 'Phần trăm', 'Thao tác'].map(h => <th key={h} className="p-2 font-semibold text-gray-600 text-left">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {localTicketClasses.map(tc => (
                                        <tr key={tc.id} className="border-b">
                                            <td className="p-2">{tc.name}</td>
                                            <td className="p-2">{tc.percentage}%</td>
                                            <td className="p-2">
                                                <div className="flex items-center space-x-1">
                                                    <button onClick={() => handleEditTicketClass(tc)} className="p-1 text-gray-400 hover:text-green-500"><EditIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDeleteClick('ticketClass', tc.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <form onSubmit={handleTicketClassSubmit} className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input value={ticketClassData.name} onChange={e => setTicketClassData({...ticketClassData, name: e.target.value})} placeholder="Tên hạng vé" className="p-2 border rounded-md" required/>
                                <input value={ticketClassData.percentage} onChange={e => setTicketClassData({...ticketClassData, percentage: e.target.value})} placeholder="Phần trăm đơn giá" type="number" className="p-2 border rounded-md" required/>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">{editingTicketClass ? 'Cập nhật hạng vé' : 'Tạo hạng vé'}</button>
                                {editingTicketClass && <button type="button" onClick={() => { setEditingTicketClass(null); setTicketClassData({name: '', percentage: ''})}} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300">Hủy</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* General Rules */}
            <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Quy định chung</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {name: 'minFlightTime', label: 'Thời gian bay tối thiểu', unit: 'Phút'},
                        {name: 'maxStopovers', label: 'Số sân bay trung gian tối đa', unit: 'Sân'},
                        {name: 'minStopTime', label: 'Thời gian dừng tối thiểu', unit: 'Phút'},
                        {name: 'maxStopTime', label: 'Thời gian dừng tối đa', unit: 'Phút'},
                        {name: 'latestBookingTime', label: 'Thời gian đặt vé chậm nhất', unit: 'Ngày'},
                        {name: 'latestCancelTime', label: 'Thời gian hủy đặt vé chậm nhất', unit: 'Ngày'},
                    ].map(rule => (
                         <div key={rule.name}>
                            <label className="text-sm font-medium text-gray-600">{rule.label}</label>
                            <div className="flex items-center mt-1">
                                <input name={rule.name} value={localRules[rule.name]} onChange={handleRuleChange} type="number" className="w-full p-2 border rounded-l-md" />
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md h-full">{rule.unit}</span>
                            </div>
                        </div>
                    ))}
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button onClick={handleSaveRules} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition w-28">
                        {saveRulesButtonText}
                    </button>
                 </div>
            </div>
             {itemToDelete && <ConfirmationModal message={`Bạn có chắc muốn xóa mục này?`} onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    )
}

export default function MainScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const TABS = ['Chuyến bay', 'Vé máy bay', 'Báo cáo', 'Máy bay', 'Tài khoản và quyền', 'Cài đặt'];
     const [activeTab, setActiveTab] = useState(TABS[0]);
 
     // Lifted state
     const [flights, setFlights] = useState([
         { id: 'FL0069', fromAirport: 'Sân bay Cam Ranh', fromCity: 'Khánh Hòa', toAirport: 'Sân bay Cần Thơ', toCity: 'Cần Thơ', time: '12:00-13:40', seatsEmpty: 60, seatsTaken: 0, planeId: 'PE0003', date: '2024-08-02', hour: '12', minute: '00', duration: '100', price: '1500000', businessSeats: 10, economySeats: 50, intermediateAirports: [] },
         { id: 'FL0070', fromAirport: 'Sân bay Cam Ranh', fromCity: 'Khánh Hòa', toAirport: 'Sân bay Cần Thơ', toCity: 'Cần Thơ', time: '12:00-13:40', seatsEmpty: 12, seatsTaken: 0, planeId: 'PE0004', date: '2024-08-03', hour: '14', minute: '30', duration: '100', price: '1600000', businessSeats: 0, economySeats: 12, intermediateAirports: [] },
     ]);
     const [tickets, setTickets] = useState([]);
     const [airplanes, setAirplanes] = useState([
         { id: 'PE0001', name: 'Phi cơ 1', economySeats: 12, businessSeats: 6, totalSeats: 18 },
         { id: 'PE0002', name: 'Phi cơ 2', economySeats: 30, businessSeats: 6, totalSeats: 36 },
         { id: 'PE0003', name: 'Phi cơ 3', economySeats: 50, businessSeats: 10, totalSeats: 60 },
         { id: 'PE0004', name: 'Máy bay M', economySeats: 12, businessSeats: 0, totalSeats: 12 },
     ]);
      const [users, setUsers] = useState([
         { id: 1, name: 'Huỳnh Mai Cao Nhân', date: '01-01-2023', role: 'Siêu quản trị', email: 'nhan@email.com', phone: '123456' },
         { id: 2, name: 'Huỳnh Mai Cao Nhân', date: '01-01-2023', role: 'Quản trị', email: 'nhan2@email.com', phone: '123456'  },
         { id: 3, name: 'Huỳnh Mai Cao Nhân', date: '01-01-2023', role: 'Ban giám đốc', email: 'nhan3@email.com', phone: '123456'  },
         { id: 4, name: 'Huỳnh Mai Cao Nhân', date: '01-01-2023', role: 'Nhân viên', email: 'nhan4@email.com', phone: '123456'  },
     ]);
     const [permissions, setPermissions] = useState({
         'Siêu quản trị': { ChuyenBay: true, VeChuyenBay: true, BaoCao: true, MayBay: true, TaiKhoan: true, CaiDat: true },
         'Quản trị': { ChuyenBay: false, VeChuyenBay: false, BaoCao: false, MayBay: false, TaiKhoan: true, CaiDat: false },
         'Ban giám đốc': { ChuyenBay: true, VeChuyenBay: false, BaoCao: true, MayBay: false, TaiKhoan: false, CaiDat: true },
         'Nhân viên': { ChuyenBay: true, VeChuyenBay: true, BaoCao: false, MayBay: false, TaiKhoan: false, CaiDat: false },
     });
     const [flightToBook, setFlightToBook] = useState(null);
     const [airports, setAirports] = useState([
         {id: 1, name: 'Sân bay Quốc tế TSN', city: 'Hồ Chí Minh', country: 'Việt Nam'},
         {id: 2, name: 'Sân bay Quốc tế Nội Bài', city: 'Hà Nội', country: 'Việt Nam'},
         {id: 3, name: 'Sân bay Quốc tế Đà Nẵng', city: 'Đà Nẵng', country: 'Việt Nam'},
         {id: 4, name: 'Sân bay Cam Ranh', city: 'Khánh Hòa', country: 'Việt Nam'},
         {id: 5, name: 'Sân bay Phú Quốc', city: 'Phú Quốc', country: 'Việt Nam'},
     ]);
     const [ticketClasses, setTicketClasses] = useState([
         {id: 1, name: 'Phổ thông', percentage: 100},
         {id: 2, name: 'Thương gia', percentage: 105},
     ]);
     const [rules, setRules] = useState({
         minFlightTime: 30,
         maxStopovers: 2,
         minStopTime: 10,
         maxStopTime: 20,
         latestBookingTime: 1,
         latestCancelTime: 1,
     });
 
 
     // Handlers for state modification
     const calculateFlightTime = (hourStr, minuteStr, durationStr) => {
         const hour = parseInt(hourStr, 10), minute = parseInt(minuteStr, 10), duration = parseInt(durationStr, 10);
         if (isNaN(hour) || isNaN(minute) || isNaN(duration)) return 'N/A';
         const departureTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
         const departureDate = new Date(); departureDate.setHours(hour, minute, 0, 0);
         const arrivalDate = new Date(departureDate.getTime() + duration * 60000);
         const arrivalTime = `${String(arrivalDate.getHours()).padStart(2, '0')}:${String(arrivalDate.getMinutes()).padStart(2, '0')}`;
         return `${departureTime}-${arrivalTime}`;
     };
 
     const handleUpdateFlight = (updatedFlight) => {
         const timeString = calculateFlightTime(updatedFlight.hour, updatedFlight.minute, updatedFlight.duration);
         const plane = airplanes.find(p => p.id === updatedFlight.planeId);
         const totalSeats = plane ? plane.totalSeats : (parseInt(updatedFlight.businessSeats, 10) || 0) + (parseInt(updatedFlight.economySeats, 10) || 0);
         const seatsTaken = updatedFlight.seatsTaken || 0;
         const seatsEmpty = totalSeats - seatsTaken;
 
         const finalUpdatedFlight = { ...updatedFlight, time: timeString, seatsEmpty, seatsTaken, businessSeats: plane?.businessSeats, economySeats: plane?.economySeats };
         setFlights(flights.map(f => f.id === finalUpdatedFlight.id ? finalUpdatedFlight : f));
     };
 
     const handleCreateFlight = (newFlight) => {
         const timeString = calculateFlightTime(newFlight.hour, newFlight.minute, newFlight.duration);
         const plane = airplanes.find(p => p.id === newFlight.planeId);
         const totalSeats = plane ? plane.totalSeats : (parseInt(newFlight.businessSeats, 10) || 0) + (parseInt(newFlight.economySeats, 10) || 0);
         const flightWithId = { ...newFlight, time: timeString, id: `FL${Math.floor(1000 + Math.random() * 9000)}`, seatsEmpty: totalSeats, seatsTaken: 0, businessSeats: plane?.businessSeats, economySeats: plane?.economySeats };
         setFlights([...flights, flightWithId]);
     };
 
     const handleDeleteFlight = (flightId) => {
         setFlights(flights.filter(f => f.id !== flightId));
     };
     
     const handleBookTicket = (flight) => {
         setFlightToBook(flight);
         setActiveTab('Vé máy bay');
     };
 
     const handleCreateTicket = (newTicket) => {
         setTickets([...tickets, newTicket]);
         const flightToUpdate = flights.find(f => f.id === newTicket.flightId);
         if (flightToUpdate) {
             const updatedFlight = { ...flightToUpdate, seatsTaken: flightToUpdate.seatsTaken + 1, seatsEmpty: flightToUpdate.seatsEmpty - 1, };
             handleUpdateFlight(updatedFlight);
         }
         alert(`Tạo vé ${newTicket.ticketId} thành công!`);
         setFlightToBook(null);
     };
     
     const handleUpdateTicket = (updatedTicket) => {
         setTickets(tickets.map(t => t.ticketId === updatedTicket.ticketId ? updatedTicket : t));
     };
 
     const handleDeleteTicket = (ticketId) => {
         const ticketToDelete = tickets.find(t => t.ticketId === ticketId);
         if(!ticketToDelete) return;
         
         setTickets(tickets.filter(t => t.ticketId !== ticketId));
         const flightToUpdate = flights.find(f => f.id === ticketToDelete.flightId);
         if (flightToUpdate) {
             const updatedFlight = { ...flightToUpdate, seatsTaken: flightToUpdate.seatsTaken - 1, seatsEmpty: flightToUpdate.seatsEmpty + 1, };
             handleUpdateFlight(updatedFlight);
         }
     };
 
     const handleCreateAirplane = (newAirplaneData) => {
         const newAirplane = { ...newAirplaneData, id: `PE${Math.floor(1000 + Math.random() * 9000)}` };
         setAirplanes([...airplanes, newAirplane]);
     }
     
     const handleUpdateAirplane = (updatedAirplane) => {
         setAirplanes(airplanes.map(p => p.id === updatedAirplane.id ? updatedAirplane : p));
         const updatedFlights = flights.map(flight => {
             if (flight.planeId === updatedAirplane.id) {
                 const totalBusinessSeats = parseInt(updatedAirplane.businessSeats, 10) || 0;
                 const totalEconomySeats = parseInt(updatedAirplane.economySeats, 10) || 0;
                 return { ...flight, businessSeats: totalBusinessSeats, economySeats: totalEconomySeats, seatsEmpty: (totalBusinessSeats + totalEconomySeats) - flight.seatsTaken, }
             }
             return flight;
         });
         setFlights(updatedFlights);
     }
     
     const handleDeleteAirplane = (airplaneId) => {
         const isAirplaneInUse = flights.some(flight => flight.planeId === airplaneId);
         if (isAirplaneInUse) {
             alert("Không thể xóa máy bay này vì đang có chuyến bay sử dụng.");
             return;
         }
         setAirplanes(airplanes.filter(p => p.id !== airplaneId));
     }
     
     const handleCreateUser = (newUserData) => {
         const newUser = {
             ...newUserData,
             id: Date.now(),
             date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
         };
         setUsers([...users, newUser]);
         alert(`Tạo tài khoản ${newUser.name} thành công!`);
     }
 
     const handleUpdateUser = (updatedUser) => {
         setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
         alert(`Cập nhật tài khoản ${updatedUser.name} thành công!`)
     }
 
     const handleDeleteUser = (userId) => {
         setUsers(users.filter(user => user.id !== userId));
     };
 
     const Tab = ({ name }) => (
         <button onClick={() => setActiveTab(name)} className={`px-4 h-10 flex items-center text-sm font-medium transition-colors border-b-2 ${activeTab === name ? 'text-blue-600 border-blue-600 bg-white' : 'text-gray-500 border-transparent hover:bg-gray-200 hover:text-gray-800'}`}>{name}</button>
     );
     
     const renderTabContent = () => {
         switch(activeTab) {
             case 'Chuyến bay':
                 return <FlightsTabContent 
                     flights={flights} 
                     airports={airports}
                     rules={rules}
                     onEdit={handleUpdateFlight} 
                     onDelete={handleDeleteFlight} 
                     onCreate={handleCreateFlight}
                     onBookTicket={handleBookTicket}
                 />;
             case 'Vé máy bay':
                  return <TicketsTabContent 
                     allFlights={flights}
                     allAirplanes={airplanes}
                     allTickets={tickets}
                     flightToBook={flightToBook}
                     onCreateTicket={handleCreateTicket}
                     onUpdateTicket={handleUpdateTicket}
                     onDeleteTicket={handleDeleteTicket}
                     tickets={tickets}
                  />;
             case 'Báo cáo':
                 return <ReportsTabContent />;
             case 'Máy bay':
                 return <AirplanesTabContent 
                     airplanes={airplanes}
                     onCreate={handleCreateAirplane}
                     onEdit={handleUpdateAirplane}
                     onDelete={handleDeleteAirplane}
                 />;
             case 'Tài khoản và quyền':
                 return <UserManagementTabContent 
                     users={users} 
                     permissions={permissions}
                     onSavePermissions={setPermissions}
                     onCreateUser={handleCreateUser} 
                     onUpdateUser={handleUpdateUser} 
                     onDeleteUser={handleDeleteUser} 
                 />;
              case 'Cài đặt':
                 return <SettingsTabContent 
                     airports={airports}
                     onUpdateAirports={setAirports}
                     ticketClasses={ticketClasses}
                     onUpdateTicketClasses={setTicketClasses}
                     rules={rules}
                     onUpdateRules={setRules}
                 />;
             default:
                 return (<div className="text-center p-10"><h1 className="text-4xl font-bold text-gray-800">Nội dung Tab</h1><p className="text-2xl text-blue-500 mt-2">{activeTab}</p></div>);
         }
     };
 
     return (
   <div id="app-root" className="w-screen h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
     <header className="flex items-center bg-gray-100 border-b pl-4 pr-2">
       <div className="flex items-center space-x-2 mr-6">
         <CloudIcon className="w-6 h-6 text-blue-500" />
         <span className="font-bold text-gray-700">FlightManager</span>
       </div>
 
       <nav className="flex-1 flex items-center">
         {TABS.map(tab => <Tab key={tab} name={tab} />)}
       </nav>
        {/* 🔹 Nút đăng xuất nằm góc phải */}
        <div className="flex items-center">
            <button
            onClick={() => {
                logout();
                navigate("/login", { replace: true });
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:text-red-800 transition"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
            >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Đăng xuất</span>
            </button>
        </div>
     </header>
 
     <main className="flex-1 bg-gray-50 overflow-y-auto">
       {renderTabContent()}
     </main>
   </div>
 );
}