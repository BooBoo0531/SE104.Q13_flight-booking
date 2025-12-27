import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { getFlights, createFlight, updateFlight, deleteFlight, getAirports, getAirplanes } from "../services/api";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";

import FlightsTab from "../features/flights/FlightsTab";
import TicketsTab from "../features/tickets/TicketsTab";
import ReportsTab from "../features/reports/ReportsTab";
import AirplanesTab from "../features/airplanes/AirplanesTab";
import UsersTab from "../features/users/UsersTab";
import SettingsTab from "../features/settings/SettingsTab";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // --- STATE GIAO DIỆN ---
  const [allowedTabs, setAllowedTabs] = useState([]); 
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE DỮ LIỆU ---
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

  useEffect(() => {
    const initDashboard = async () => {
        // 1. Kiểm tra User trong LocalStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (!storedUser || !storedToken) {
            window.location.href = '/'; 
            return;
        }

        let currentUser;
        try {
            currentUser = JSON.parse(storedUser);
        } catch (error) {
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
  }, []);

  // Load flights và airports từ API
  useEffect(() => {
    const loadData = async () => {
      if (allowedTabs.length === 0) return; // Chờ init dashboard xong
      
      try {
        setLoading(true);
        
        // Load flights, airports và airplanes song song từ API
        const [flightsData, airportsData, airplanesData] = await Promise.all([
          getFlights(),
          getAirports(),
          getAirplanes()
        ]);
        
        // Format flights data từ backend sang frontend format
        const formattedFlights = flightsData.map(flight => ({
          id: flight.flightCode,
          backendId: flight.id, // Lưu ID backend để update/delete
          fromAirport: flight.fromAirport.name,
          fromCity: flight.fromAirport.city,
          toAirport: flight.toAirport.name,
          toCity: flight.toAirport.city,
          date: new Date(flight.startTime).toISOString().split('T')[0],
          time: `${new Date(flight.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}-${new Date(flight.endTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`,
          seatsEmpty: flight.availableSeats,
          seatsTaken: flight.totalSeats - flight.availableSeats,
          planeId: flight.plane.code,
          price: flight.price,
          duration: flight.duration,
          status: flight.status,
          // Thêm các field cần thiết cho form
          hour: new Date(flight.startTime).getHours(),
          minute: new Date(flight.startTime).getMinutes(),
          businessSeats: flight.plane.businessSeats,
          economySeats: flight.plane.economySeats,
          intermediateAirports: [] // TODO: Load từ API nếu có
        }));
        
        // Format airports data
        const formattedAirports = airportsData.map(airport => ({
          id: airport.id,
          name: airport.name,
          code: airport.code,
          city: airport.city,
          country: airport.country
        }));
        
        // Format airplanes data
        const formattedAirplanes = airplanesData.map(plane => ({
          id: plane.code,
          backendId: plane.id,
          name: plane.name,
          code: plane.code,
          totalSeats: plane.totalSeats,
          businessSeats: plane.businessSeats,
          economySeats: plane.economySeats
        }));
        
        setFlights(formattedFlights);
        setAirports(formattedAirports);
        setAirplanes(formattedAirplanes);
        setError(null);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [allowedTabs]); 


  const calculateFlightTime = (hourStr, minuteStr, durationStr) => {
      const hour = parseInt(hourStr, 10), minute = parseInt(minuteStr, 10), duration = parseInt(durationStr, 10);
      if (isNaN(hour) || isNaN(minute) || isNaN(duration)) return 'N/A';
      const departureTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const departureDate = new Date(); departureDate.setHours(hour, minute, 0, 0);
      const arrivalDate = new Date(departureDate.getTime() + duration * 60000);
      const arrivalTime = `${String(arrivalDate.getHours()).padStart(2, '0')}:${String(arrivalDate.getMinutes()).padStart(2, '0')}`;
      return `${departureTime}-${arrivalTime}`;
  };

  const handleUpdateFlight = async (updatedFlight) => {
      try {

        const plane = airplanes.find(p => p.id === updatedFlight.planeId);
        const fromAirport = airports.find(a => a.name === updatedFlight.fromAirport);
        const toAirport = airports.find(a => a.name === updatedFlight.toAirport);
        
        if (!plane || !fromAirport || !toAirport) {
          alert('Vui lòng chọn đầy đủ sân bay và máy bay!');
          return;
        }
        
        const startTime = new Date(`${updatedFlight.date}T${String(updatedFlight.hour).padStart(2, '0')}:${String(updatedFlight.minute).padStart(2, '0')}:00`);
        const endTime = new Date(startTime.getTime() + parseInt(updatedFlight.duration) * 60000);
        
        const backendData = {
          flightCode: updatedFlight.id, 
          fromAirportId: fromAirport.id,
          toAirportId: toAirport.id,
          planeId: plane.backendId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          price: parseInt(updatedFlight.price, 10),
          totalSeats: plane.totalSeats
        };
        
        // Gọi API update
        const updated = await updateFlight(updatedFlight.backendId, backendData);
        
        // Reload danh sách flights
        const flightsData = await getFlights();
        const formattedFlights = flightsData.map(flight => ({
          id: flight.flightCode,
          backendId: flight.id,
          fromAirport: flight.fromAirport.name,
          fromCity: flight.fromAirport.city,
          toAirport: flight.toAirport.name,
          toCity: flight.toAirport.city,
          date: new Date(flight.startTime).toISOString().split('T')[0],
          time: `${new Date(flight.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}-${new Date(flight.endTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`,
          seatsEmpty: flight.availableSeats,
          seatsTaken: flight.totalSeats - flight.availableSeats,
          planeId: flight.plane.code,
          price: flight.price,
          duration: flight.duration,
          status: flight.status,
          hour: new Date(flight.startTime).getHours(),
          minute: new Date(flight.startTime).getMinutes(),
          businessSeats: flight.plane.businessSeats,
          economySeats: flight.plane.economySeats,
          intermediateAirports: []
        }));
        setFlights(formattedFlights);
        alert('Cập nhật chuyến bay thành công!');
      } catch (err) {
        console.error('Lỗi cập nhật chuyến bay:', err);
        alert(err.response?.data?.message || 'Không thể cập nhật chuyến bay');
      }
  };

  const handleCreateFlight = async (newFlight) => {
      try {
        // Chuyển đổi dữ liệu frontend sang backend format
        const plane = airplanes.find(p => p.id === newFlight.planeId);
        const fromAirport = airports.find(a => a.name === newFlight.fromAirport);
        const toAirport = airports.find(a => a.name === newFlight.toAirport);
        
        if (!plane || !fromAirport || !toAirport) {
          alert('Vui lòng chọn đầy đủ sân bay và máy bay!');
          return;
        }
        
        // Tạo datetime local (không dùng Z để tránh lệch múi giờ)
        const startTime = new Date(`${newFlight.date}T${String(newFlight.hour).padStart(2, '0')}:${String(newFlight.minute).padStart(2, '0')}:00`);
        const endTime = new Date(startTime.getTime() + parseInt(newFlight.duration) * 60000);
        
        // Generate flightCode tự động: VN + random 4 số
        const flightCode = `VN${Math.floor(1000 + Math.random() * 9000)}`;
        
        const backendData = {
          flightCode: flightCode,
          fromAirportId: fromAirport.id,
          toAirportId: toAirport.id,
          planeId: plane.backendId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          price: parseInt(newFlight.price, 10),
          totalSeats: plane.totalSeats
        };
        
        // Gọi API create
        await createFlight(backendData);
        
        // Reload danh sách flights
        const flightsData = await getFlights();
        const formattedFlights = flightsData.map(flight => ({
          id: flight.flightCode,
          backendId: flight.id,
          fromAirport: flight.fromAirport.name,
          fromCity: flight.fromAirport.city,
          toAirport: flight.toAirport.name,
          toCity: flight.toAirport.city,
          date: new Date(flight.startTime).toISOString().split('T')[0],
          time: `${new Date(flight.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}-${new Date(flight.endTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`,
          seatsEmpty: flight.availableSeats,
          seatsTaken: flight.totalSeats - flight.availableSeats,
          planeId: flight.plane.code,
          price: flight.price,
          duration: flight.duration,
          status: flight.status,
          hour: new Date(flight.startTime).getHours(),
          minute: new Date(flight.startTime).getMinutes(),
          businessSeats: flight.plane.businessSeats,
          economySeats: flight.plane.economySeats,
          intermediateAirports: []
        }));
        setFlights(formattedFlights);
        alert('Tạo chuyến bay thành công!');
      } catch (err) {
        console.error('Lỗi tạo chuyến bay:', err);
        alert(err.response?.data?.message || 'Không thể tạo chuyến bay');
      }
  };

  const handleDeleteFlight = async (flightId) => {
      try {
        const flight = flights.find(f => f.id === flightId);
        if (!flight) return;
        
        // Gọi API delete với backend ID
        await deleteFlight(flight.backendId);
        
        // Reload danh sách flights
        const flightsData = await getFlights();
        const formattedFlights = flightsData.map(flight => ({
          id: flight.flightCode,
          backendId: flight.id,
          fromAirport: flight.fromAirport.name,
          fromCity: flight.fromAirport.city,
          toAirport: flight.toAirport.name,
          toCity: flight.toAirport.city,
          date: new Date(flight.startTime).toISOString().split('T')[0],
          time: `${new Date(flight.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}-${new Date(flight.endTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`,
          seatsEmpty: flight.availableSeats,
          seatsTaken: flight.totalSeats - flight.availableSeats,
          planeId: flight.plane.code,
          price: flight.price,
          duration: flight.duration,
          status: flight.status,
          hour: new Date(flight.startTime).getHours(),
          minute: new Date(flight.startTime).getMinutes(),
          businessSeats: flight.plane.businessSeats,
          economySeats: flight.plane.economySeats,
          intermediateAirports: []
        }));
        setFlights(formattedFlights);
        alert('Xóa chuyến bay thành công!');
      } catch (err) {
        console.error('Lỗi xóa chuyến bay:', err);
        alert(err.response?.data?.message || 'Không thể xóa chuyến bay. Có thể đã có vé được đặt.');
      }
  };
  
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
        return <FlightsTab flights={flights} airports={airports} airplanes={airplanes} rules={rules} onEdit={handleUpdateFlight} onDelete={handleDeleteFlight} onCreate={handleCreateFlight} onBookTicket={handleBookTicket} />;
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        TABS={allowedTabs}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          activeTab={activeTab}
          onLogout={handleLogout}
        />

        {/* Content with fade-in animation */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}