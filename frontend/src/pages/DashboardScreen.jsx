import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Import Layout
import Header from "../layouts/Header";

// Import Features
import FlightsTab from "../features/flights/FlightsTab";
import TicketsTab from "../features/tickets/TicketsTab";
import ReportsTab from "../features/reports/ReportsTab";
import AirplanesTab from "../features/airplanes/AirplanesTab";
import UsersTab from "../features/users/UsersTab";
import SettingsTab from "../features/settings/SettingsTab";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const TABS = ['Chuyến bay', 'Vé máy bay', 'Báo cáo', 'Máy bay', 'Tài khoản và quyền', 'Cài đặt'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // --- STATE DỮ LIỆU ---
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
      minFlightTime: 30, maxStopovers: 2, minStopTime: 10, maxStopTime: 20, latestBookingTime: 1, latestCancelTime: 1,
  });

  // --- HANDLERS ---
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

  const handleDeleteFlight = (flightId) => { setFlights(flights.filter(f => f.id !== flightId)); };
  
  const handleBookTicket = (flight) => { setFlightToBook(flight); setActiveTab('Vé máy bay'); };

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
  
  const handleUpdateTicket = (updatedTicket) => { setTickets(tickets.map(t => t.ticketId === updatedTicket.ticketId ? updatedTicket : t)); };

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

  const handleCreateAirplane = (newAirplaneData) => { setAirplanes([...airplanes, { ...newAirplaneData, id: `PE${Math.floor(1000 + Math.random() * 9000)}` }]); }
  
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
      if (isAirplaneInUse) { alert("Không thể xóa máy bay này vì đang có chuyến bay sử dụng."); return; }
      setAirplanes(airplanes.filter(p => p.id !== airplaneId));
  }
  
  const handleCreateUser = (newUserData) => { setUsers([...users, { ...newUserData, id: Date.now(), date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-') }]); alert(`Tạo tài khoản ${newUserData.name} thành công!`); }
  const handleUpdateUser = (updatedUser) => { setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u)); alert(`Cập nhật tài khoản ${updatedUser.name} thành công!`) }
  const handleDeleteUser = (userId) => { setUsers(users.filter(user => user.id !== userId)); };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Chuyến bay':
        return <FlightsTab flights={flights} airports={airports} rules={rules} onEdit={handleUpdateFlight} onDelete={handleDeleteFlight} onCreate={handleCreateFlight} onBookTicket={handleBookTicket} />;
      case 'Vé máy bay':
        return <TicketsTab allFlights={flights} allAirplanes={airplanes} allTickets={tickets} flightToBook={flightToBook} onCreateTicket={handleCreateTicket} onUpdateTicket={handleUpdateTicket} onDeleteTicket={handleDeleteTicket} tickets={tickets} />;
      case 'Báo cáo':
        return <ReportsTab />;
      case 'Máy bay':
        return <AirplanesTab airplanes={airplanes} onCreate={handleCreateAirplane} onEdit={handleUpdateAirplane} onDelete={handleDeleteAirplane} />;
      case 'Tài khoản và quyền':
        return <UsersTab users={users} permissions={permissions} onSavePermissions={setPermissions} onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />;
      case 'Cài đặt':
        return <SettingsTab airports={airports} onUpdateAirports={setAirports} ticketClasses={ticketClasses} onUpdateTicketClasses={setTicketClasses} rules={rules} onUpdateRules={setRules} />;
      default:
        return <div className="text-center p-10"><h1 className="text-4xl font-bold text-gray-800">404</h1><p>Tab not found</p></div>;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { logout(); navigate("/login", { replace: true }); }} TABS={TABS} />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        {renderTabContent()}
      </main>
    </div>
  );
}