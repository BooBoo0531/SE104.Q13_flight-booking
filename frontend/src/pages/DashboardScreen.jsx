import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

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
  
  // State quản lý Tab động
  const [allowedTabs, setAllowedTabs] = useState([]); 
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);

  // --- STATE DỮ LIỆU (GIỮ NGUYÊN) ---
  const [flights, setFlights] = useState([]); 
  const [tickets, setTickets] = useState([]); 
  const [airplanes, setAirplanes] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [airports, setAirports] = useState([]); 

  const [ticketClasses, setTicketClasses] = useState([
      {id: 1, name: 'Phổ thông', percentage: 100},
      {id: 2, name: 'Thương gia', percentage: 105},
  ]);
  
  const [rules, setRules] = useState({
      minFlightTime: 30, maxStopovers: 2, minStopTime: 10, maxStopTime: 20, latestBookingTime: 1, latestCancelTime: 1,
  });

  const [permissions, setPermissions] = useState({});
  const [flightToBook, setFlightToBook] = useState(null);

  // 👇 SỬA ĐỔI QUAN TRỌNG: Check đăng nhập an toàn & Load quyền
  useEffect(() => {
    const initDashboard = async () => {
        // 1. Kiểm tra User trong LocalStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        // Nếu thiếu thông tin -> Đá về trang chủ bằng href để load lại từ đầu
        if (!storedUser || !storedToken) {
            window.location.href = '/'; 
            return;
        }

        let currentUser;
        try {
            currentUser = JSON.parse(storedUser);
        } catch (error) {
            // Nếu dữ liệu lỗi -> Xóa sạch và đá về login
            localStorage.clear();
            window.location.href = '/';
            return;
        }

        try {
            // 2. Gọi API lấy bảng phân quyền
            const res = await axios.get('http://localhost:3000/users/permissions');
            const allPermissions = res.data;
            setPermissions(allPermissions);

            // 3. Lọc Tab dựa trên Role của User hiện tại
            const userPerms = allPermissions[currentUser.role];
            
            if (userPerms) {
                const tabsToShow = [];
                if (userPerms.ChuyenBay) tabsToShow.push('Chuyến bay');
                if (userPerms.VeChuyenBay) tabsToShow.push('Vé máy bay');
                if (userPerms.BaoCao) tabsToShow.push('Báo cáo');
                if (userPerms.MayBay) tabsToShow.push('Máy bay');
                if (userPerms.TaiKhoan) tabsToShow.push('Tài khoản và quyền');
                if (userPerms.CaiDat) tabsToShow.push('Cài đặt');

                setAllowedTabs(tabsToShow);

                // Mặc định chọn tab đầu tiên
                if (tabsToShow.length > 0) {
                    setActiveTab(tabsToShow[0]);
                }
            } else {
                alert("Vai trò của bạn chưa được cấp quyền!");
            }
        } catch (error) {
            console.error("Lỗi tải Dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    initDashboard();
  }, []); // Bỏ dependency navigate để tránh loop

  // --- HANDLERS (GIỮ NGUYÊN TOÀN BỘ CODE CỦA BẠN) ---
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

  // --- RENDER ---
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
        return <div className="text-center p-10"><h2 className="text-2xl text-gray-400">Vui lòng chọn chức năng trên menu</h2></div>;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Đang tải dữ liệu...</div>;

  return (
    <div className="w-screen h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        TABS={allowedTabs} 
      />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        {renderTabContent()}
      </main>
    </div>
  );
}