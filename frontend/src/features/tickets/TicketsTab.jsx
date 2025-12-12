import React, { useState, useEffect } from "react";
import { EditIcon, TrashIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

// --- Sub-component: TicketForm ---
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
            if (seatType !== seatClass) { setSelectedSeat(null); }
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
        if (!selectedSeat) { alert("Vui lòng chọn một ghế."); return; }
        const finalTicketData = { ...ticketInfo, seat: selectedSeat, seatClass, ticketId: isEditMode ? initialData.ticketId : `TK${Math.floor(1000 + Math.random() * 9000)}` };
        onSubmit(finalTicketData);
    };
    
    const Seat = ({ id, type, isTaken }) => {
        const isSelected = selectedSeat === id;
        const isDisabledByClass = (type === 'business' && seatClass !== 'Thương gia') || (type === 'economy' && seatClass !== 'Phổ thông');
        let seatClassStyle = "";
        if (isDisabledByClass) { seatClassStyle = "bg-gray-200 text-gray-400 cursor-not-allowed"; } 
        else if (isTaken) { seatClassStyle = "bg-gray-500 cursor-not-allowed text-white"; } 
        else if (isSelected) { seatClassStyle = "bg-red-500 text-white"; } 
        else if (type === 'business') { seatClassStyle = "bg-teal-200 hover:bg-teal-300 text-teal-800"; } 
        else { seatClassStyle = "bg-cyan-200 hover:bg-cyan-300 text-cyan-800"; }
        const canClick = !isTaken && !isDisabledByClass;
        return <button type="button" onClick={() => canClick && setSelectedSeat(id)} className={`w-10 h-10 rounded text-xs font-semibold flex items-center justify-center transition-colors ${seatClassStyle}`}>{id}</button>
    };
    
    const bookedSeats = allTickets.filter(ticket => ticket.flightId === selectedFlight?.id).map(ticket => ticket.seat);

    return (
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
                <h3 className="font-semibold text-lg text-gray-700">Thông tin vé</h3>
                <select value={selectedFlight?.id || ''} onChange={(e) => handleFlightSelect(e.target.value)} disabled={!!flightForBooking || isEditMode} className="w-full p-2 border rounded bg-white disabled:bg-gray-100"><option value="">-- Chọn chuyến bay --</option>{allFlights.map(f => <option key={f.id} value={f.id}>{f.id}: {f.fromCity} - {f.toCity}</option>)}</select>
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

// --- Sub-component: LookupTicket ---
const LookupTicket = ({ tickets, onEdit, onDelete }) => {
  const [mode, setMode] = useState('flightId');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(tickets);
  useEffect(() => { handleSearch(); }, [tickets, mode]);
  const normalize = (s) => (s ?? '').toString().trim().toLowerCase();
  const handleSearch = () => {
    const q = normalize(query);
    if (!q) { setResults(tickets); return; }
    const filtered = tickets.filter((t) => normalize(t[mode]).includes(q));
    setResults(filtered);
  };
  const clearSearch = () => { setQuery(''); setResults(tickets); };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="flightId">Tìm kiếm theo mã chuyến bay</option>
          <option value="ticketId">Tìm kiếm theo mã vé</option>
        </select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder={mode === 'flightId' ? 'VD: FL0069' : 'VD: TK1234'} className="flex-1 p-2 border rounded" />
        <button onClick={handleSearch} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow">Tìm kiếm</button>
        <button onClick={clearSearch} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">Xóa</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100"><tr>{['Mã vé', 'Mã chuyến bay', 'Họ và tên', 'CMND/CCCD', 'Số điện thoại', 'Email', 'Ghế', 'Hạng vé', 'Giá tiền', 'Thao tác'].map((h) => (<th key={h} className="p-3 font-semibold text-gray-600 text-sm">{h}</th>))}</tr></thead>
          <tbody>
            {results.length === 0 ? ( <tr><td className="p-4 text-gray-500 italic" colSpan={10}>Không có kết quả phù hợp.</td></tr> ) : (
              results.map((t) => (
                <tr key={t.ticketId} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-mono text-green-700">{t.ticketId}</td><td className="p-3 font-mono text-blue-700">{t.flightId}</td><td className="p-3">{t.name}</td><td className="p-3">{t.idCard}</td><td className="p-3">{t.phone}</td><td className="p-3">{t.email}</td><td className="p-3 font-bold">{t.seat}</td><td className="p-3">{t.seatClass}</td><td className="p-3">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => onEdit(t)} className="p-1 text-gray-500 hover:text-green-600"><EditIcon className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(t.ticketId)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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

// --- Main Export: TicketsTab ---
const TicketsTab = ({ flightToBook, allFlights, allAirplanes, onCreateTicket, onUpdateTicket, onDeleteTicket, tickets }) => {
    const [subTab, setSubTab] = useState('create');
    const [editingTicket, setEditingTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    
    useEffect(() => { if (flightToBook) { setSubTab('create'); setEditingTicket(null); } }, [flightToBook]);

    const handleEditClick = (ticket) => { setEditingTicket(ticket); setSubTab('edit'); };
    const handleDeleteClick = (ticketId) => { setTicketToDelete(ticketId); };
    const confirmDelete = () => { onDeleteTicket(ticketToDelete); setTicketToDelete(null); };
    const cancelDelete = () => setTicketToDelete(null);
    const handleCancelEdit = () => { setEditingTicket(null); setSubTab('lookup'); };
    const handleFormSubmit = (ticketData) => {
        if (editingTicket) { onUpdateTicket(ticketData); } else { onCreateTicket(ticketData); }
        setEditingTicket(null); setSubTab('lookup');
    };

    const SubTabButton = ({ value, children }) => (<button onClick={() => setSubTab(value)} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>);

    const renderContent = () => {
        switch(subTab) {
            case 'create': return <TicketForm allFlights={allFlights} allAirplanes={allAirplanes} allTickets={tickets} flightForBooking={flightToBook} onSubmit={handleFormSubmit} />;
            case 'lookup': return <LookupTicket tickets={tickets} onEdit={handleEditClick} onDelete={handleDeleteClick}/>;
            case 'edit': return <TicketForm initialData={editingTicket} allFlights={allFlights} allAirplanes={allAirplanes} allTickets={tickets} onSubmit={handleFormSubmit} onCancel={handleCancelEdit} />;
            default: return null;
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

export default TicketsTab;