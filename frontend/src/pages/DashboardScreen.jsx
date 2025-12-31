import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  getAirports,
  getAirplanes,
  getSettings,
  getTicketClasses,
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/api";

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
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE DỮ LIỆU ---
  const [flights, setFlights] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [users, setUsers] = useState([]);
  const [airports, setAirports] = useState([]);

  const [ticketClasses, setTicketClasses] = useState([]);

  const [rules, setRules] = useState({
    minFlightTime: 30,
    maxStopovers: 2,
    minStopTime: 10,
    maxStopTime: 20,
    latestBookingTime: 1,
    latestCancelTime: 1,
  });

  const [permissions, setPermissions] = useState({});
  const [flightToBook, setFlightToBook] = useState(null);

  // Helper: chuẩn hóa seatConfigs của 1 plane để luôn khớp ticketClasses hiện tại
  const mapSeatConfigs = (plane = {}, ticketClassesData = []) => {
    const classes = Array.isArray(ticketClassesData) ? ticketClassesData : [];
    const hasSeatConfigs = Array.isArray(plane.seatConfigs) && plane.seatConfigs.length > 0;

    // Helper để lấy chữ cái đầu từ tên hạng vé
    const getPrefixFromName = (name) => {
      const normalized = (name || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
      return normalized.charAt(0) || 'X';
    };

    if (hasSeatConfigs) {
      return plane.seatConfigs.map((cfg) => {
        const matchedClass = classes.find((tc) => {
          const tcName = (tc.name || "").toLowerCase();
          const cfgName = (cfg.name || "").toLowerCase();
          return tcName === cfgName ||
            (cfg.prefix && tc.name && cfg.prefix.toLowerCase() === tc.name.charAt(0).toLowerCase());
        });

        if (matchedClass) {
          // Normalize prefix dựa trên tên class
          return { ...cfg, ticketClassId: matchedClass.id, name: matchedClass.name, prefix: getPrefixFromName(matchedClass.name) };
        }
        // Nếu không match được, vẫn normalize prefix dựa trên tên hiện có
        return { ...cfg, prefix: getPrefixFromName(cfg.name) };
      });
    }

    // Legacy fallback: suy ra từ economy/business
    const phoThongClass = classes.find((tc) => /pho thong|economy/i.test(tc.name || ""));
    const thuongGiaClass = classes.find((tc) => /thuong gia|business|vip/i.test(tc.name || ""));

    const fallback = [];
    if (phoThongClass) {
      fallback.push({
        ticketClassId: phoThongClass.id,
        name: phoThongClass.name,
        prefix: getPrefixFromName(phoThongClass.name),
        seatCount: plane.economySeats || 0,
      });
    }
    if (thuongGiaClass) {
      fallback.push({
        ticketClassId: thuongGiaClass.id,
        name: thuongGiaClass.name,
        prefix: getPrefixFromName(thuongGiaClass.name),
        seatCount: plane.businessSeats || 0,
      });
    }

    if (fallback.length > 0) return fallback;

    // Fallback cứng nếu chưa tải được ticketClasses
    return [
      { ticketClassId: 3, name: "Phổ thông", prefix: getPrefixFromName("Phổ thông"), seatCount: plane.economySeats || 0 },
      { ticketClassId: 4, name: "Thương gia", prefix: getPrefixFromName("Thương gia"), seatCount: plane.businessSeats || 0 },
    ];
  };

  // Helper: format flights với seatConfigs đã map
  const formatFlightsWithSeatConfigs = (flightsData = [], ticketClassesData = []) =>
    flightsData.map((flight) => {
      const seatConfigs = mapSeatConfigs(flight.plane, ticketClassesData);

      return {
        id: flight.flightCode,
        backendId: flight.id, // Lưu ID backend để update/delete
        fromAirport: flight.fromAirport.name,
        fromCity: flight.fromAirport.city,
        toAirport: flight.toAirport.name,
        toCity: flight.toAirport.city,
        date: new Date(flight.startTime).toISOString().split("T")[0],
        time: `${new Date(flight.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}-${new Date(flight.endTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        seatsEmpty: flight.availableSeats,
        seatsTaken: flight.totalSeats - flight.availableSeats,
        planeId: flight.plane.code,
        seatConfigs,
        price: flight.price,
        duration: flight.duration,
        status: flight.status,
        // Thêm các field cần thiết cho form
        hour: new Date(flight.startTime).getHours(),
        minute: new Date(flight.startTime).getMinutes(),
        businessSeats: flight.plane.businessSeats,
        economySeats: flight.plane.economySeats,
        intermediateAirports:
          flight.intermediates?.map((inter) => ({
            id: inter.id,
            name: inter.airport.name,
            duration: inter.duration,
            notes: inter.note || "",
          })) || [],
      };
    });

  useEffect(() => {
    const initDashboard = async () => {
      // 1. Kiểm tra User trong LocalStorage
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        window.location.href = "/";
        return;
      }

      let currentUser;
      try {
        currentUser = JSON.parse(storedUser);
      } catch (error) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      try {
        // 2. Gọi API lấy bảng phân quyền
        const res = await axios.get("http://localhost:3000/users/permissions");
        const allPermissions = res.data;
        setPermissions(allPermissions);

        // DEBUG: Log để kiểm tra
        console.log("🔍 Current User:", currentUser);
        console.log("🔍 User Role:", currentUser.role);
        console.log("🔍 All Permissions:", allPermissions);
        console.log("🔍 Available Roles:", Object.keys(allPermissions));

        // 3. Lọc Tab dựa trên Role của User hiện tại
        const userPerms = allPermissions[currentUser.role];

        if (userPerms) {
          const tabsToShow = [];
          if (userPerms.ChuyenBay) tabsToShow.push("Chuyến bay");
          if (userPerms.VeChuyenBay) tabsToShow.push("Vé máy bay");
          if (userPerms.BaoCao) tabsToShow.push("Báo cáo");
          if (userPerms.MayBay) tabsToShow.push("Máy bay");
          if (userPerms.TaiKhoan) tabsToShow.push("Tài khoản và quyền");
          if (userPerms.CaiDat) tabsToShow.push("Cài đặt");

          setAllowedTabs(tabsToShow);

          if (tabsToShow.length > 0) {
            setActiveTab(tabsToShow[0]);
          }
        } else {
          console.error("❌ Không tìm thấy quyền cho role:", currentUser.role);
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

        // Load flights, airports, airplanes, settings, ticket-classes, users song song từ API
        const [flightsData, airportsData, airplanesData, settingsData, ticketClassesData] =
          await Promise.all([getFlights(), getAirports(), getAirplanes(), getSettings(), getTicketClasses()]);

        // Tickets và Users có phân quyền -> nếu không đủ quyền / hết token thì để rỗng
        let ticketsData = [];
        try {
          ticketsData = await getTickets();
        } catch (e) {
          ticketsData = [];
        }

        let usersData = [];
        try {
          const res = await axios.get("http://localhost:3000/users");
          usersData = Array.isArray(res.data) ? res.data : [];
        } catch (e) {
          usersData = [];
        }

        // Format flights data từ backend sang frontend format (đã map seatConfigs)
        const formattedFlights = formatFlightsWithSeatConfigs(flightsData, ticketClassesData);

        // Format airports data
        const formattedAirports = airportsData.map((airport) => ({
          id: airport.id,
          name: airport.name,
          code: airport.code,
          city: airport.city,
          country: airport.country,
        }));

        // Format airplanes data
        const formattedAirplanes = airplanesData.map((plane) => {
          const hasSeatConfigs = Array.isArray(plane.seatConfigs) && plane.seatConfigs.length > 0;
          let seatConfigs = [];
          
          if (hasSeatConfigs) {
            // Remap seatConfigs để match với ticketClasses hiện tại
            seatConfigs = plane.seatConfigs.map(cfg => {
              const matchedClass = ticketClassesData.find(tc => {
                const tcName = (tc.name || '').toLowerCase();
                const cfgName = (cfg.name || '').toLowerCase();
                return tcName === cfgName || 
                       (cfg.prefix && tc.name && (cfg.prefix.toLowerCase() === tc.name.charAt(0).toLowerCase()));
              });
              if (matchedClass) {
                return { ...cfg, ticketClassId: matchedClass.id };
              }
              return cfg;
            });
          } else {
            // Fallback legacy
            const phoThongClass = ticketClassesData.find(tc => /pho thong|economy/i.test(tc.name || ''));
            const thuongGiaClass = ticketClassesData.find(tc => /thuong gia|business|vip/i.test(tc.name || ''));
            seatConfigs = [
              { ticketClassId: phoThongClass?.id || 0, name: phoThongClass?.name || 'Phổ thông', prefix: 'E', seatCount: plane.economySeats },
              { ticketClassId: thuongGiaClass?.id || 1, name: thuongGiaClass?.name || 'Thương gia', prefix: 'B', seatCount: plane.businessSeats },
            ];
          }
          
          return {
            id: plane.code,
            backendId: plane.id,
            name: plane.name,
            code: plane.code,
            totalSeats: plane.totalSeats,
            businessSeats: plane.businessSeats,
            economySeats: plane.economySeats,
            seatConfigs,
          };
        });

        setFlights(formattedFlights);
        setAirports(formattedAirports);
        setAirplanes(formattedAirplanes);
        setRules(settingsData);
        setTicketClasses(
          Array.isArray(ticketClassesData) && ticketClassesData.length
            ? ticketClassesData
            : [
                { id: 1, name: "Phổ thông", percentage: 100 },
                { id: 2, name: "Thương gia", percentage: 105 },
              ]
        );
        setTickets(ticketsData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [allowedTabs]);

  const formatFlightsData = (flightsData) => formatFlightsWithSeatConfigs(flightsData, ticketClasses);

  const refreshFlights = async () => {
    const flightsData = await getFlights();
    setFlights(formatFlightsData(flightsData));
  };

  const calculateFlightTime = (hourStr, minuteStr, durationStr) => {
    const hour = parseInt(hourStr, 10),
      minute = parseInt(minuteStr, 10),
      duration = parseInt(durationStr, 10);
    if (isNaN(hour) || isNaN(minute) || isNaN(duration)) return "N/A";
    const departureTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const departureDate = new Date();
    departureDate.setHours(hour, minute, 0, 0);
    const arrivalDate = new Date(departureDate.getTime() + duration * 60000);
    const arrivalTime = `${String(arrivalDate.getHours()).padStart(2, "0")}:${String(
      arrivalDate.getMinutes()
    ).padStart(2, "0")}`;
    return `${departureTime}-${arrivalTime}`;
  };

  const handleUpdateFlight = async (updatedFlight, showAlert = true) => {
    try {
      console.log("🔄 BẮT ĐẦU CÂP NHẬT CHUYẾN BAY:", updatedFlight.id);
      console.log("📝 Dữ liệu chuyến bay:", updatedFlight);
      console.log("🛫 Sân bay trung gian từ form:", updatedFlight.intermediateAirports);

      const plane = airplanes.find((p) => p.id === updatedFlight.planeId);
      const fromAirport = airports.find((a) => a.name === updatedFlight.fromAirport);
      const toAirport = airports.find((a) => a.name === updatedFlight.toAirport);

      if (!plane || !fromAirport || !toAirport) {
        console.error("❌ THIẾU DỮ LIỆU:", { plane, fromAirport, toAirport });
        alert("Vui lòng chọn đầy đủ sân bay và máy bay!");
        return;
      }

      const startTime = new Date(
        `${updatedFlight.date}T${String(updatedFlight.hour).padStart(2, "0")}:${String(
          updatedFlight.minute
        ).padStart(2, "0")}:00`
      );
      const endTime = new Date(startTime.getTime() + parseInt(updatedFlight.duration) * 60000);

      // Chuyển đổi sân bay trung gian
      const intermediateAirports = updatedFlight.intermediateAirports
        ?.filter((ia) => ia.name)
        .map((ia) => {
          const airport = airports.find((a) => a.name === ia.name);
          console.log(`🔍 Tìm sân bay "${ia.name}":`, airport);
          return {
            airportId: airport?.id,
            duration: parseInt(ia.duration, 10),
            note: ia.notes || "",
          };
        })
        .filter((ia) => ia.airportId);

      console.log("📤 Dữ liệu sân bay trung gian gửi lên backend:", intermediateAirports);

      const backendData = {
        flightCode: updatedFlight.id,
        fromAirportId: fromAirport.id,
        toAirportId: toAirport.id,
        planeId: plane.backendId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: parseInt(updatedFlight.price, 10),
        totalSeats: plane.totalSeats,
        intermediateAirports: intermediateAirports,
      };

      console.log("📤 GỬI DỮ LIỆU LÊN BACKEND:", backendData);

      // Gọi API update
      const updated = await updateFlight(updatedFlight.backendId, backendData);

      console.log("✅ BACKEND TRẢ VỀ:", updated);
      console.log("🛫 Intermediates từ backend:", updated.intermediates);

      // Reload danh sách flights
      const flightsData = await getFlights();
      const formattedFlights = formatFlightsWithSeatConfigs(flightsData, ticketClasses);

      console.log("🔄 RELOAD DANH SÁCH CHUYẾN BAY - Tổng:", flightsData.length);
      const updatedFlightData = formattedFlights.find((f) => f.backendId === updatedFlight.backendId);
      console.log("✅ CHUYẾN BAY SAU KHI CẬP NHẬT:", updatedFlightData);
      console.log("🛫 Sân bay trung gian sau khi reload:", updatedFlightData?.intermediateAirports);

      setFlights(formattedFlights);
      if (showAlert) {
        alert("Cập nhật chuyến bay thành công!");
      }
      console.log("✅ HOÀN TẤT CẬP NHẬT");
    } catch (err) {
      console.error("❌ LỖI CẬP NHẬT CHUYẾN BAY:", err);
      console.error("Chi tiết lỗi:", err.response?.data);
      alert(err.response?.data?.message || "Không thể cập nhật chuyến bay");
    }
  };

  const handleCreateFlight = async (newFlight) => {
    try {
      const plane = airplanes.find((p) => p.id === newFlight.planeId);
      const fromAirport = airports.find((a) => a.name === newFlight.fromAirport);
      const toAirport = airports.find((a) => a.name === newFlight.toAirport);

      if (!plane || !fromAirport || !toAirport) {
        alert("Vui lòng chọn đầy đủ sân bay và máy bay!");
        return;
      }

      const startTime = new Date(
        `${newFlight.date}T${String(newFlight.hour).padStart(2, "0")}:${String(
          newFlight.minute
        ).padStart(2, "0")}:00`
      );
      const endTime = new Date(startTime.getTime() + parseInt(newFlight.duration) * 60000);

      const flightCode = `VN${Math.floor(1000 + Math.random() * 9000)}`;

      // Chuyển đổi sân bay trung gian
      const intermediateAirports = newFlight.intermediateAirports
        ?.filter((ia) => ia.name)
        .map((ia) => {
          const airport = airports.find((a) => a.name === ia.name);
          return {
            airportId: airport?.id,
            duration: parseInt(ia.duration, 10),
            note: ia.notes || "",
          };
        })
        .filter((ia) => ia.airportId);

      const backendData = {
        flightCode: flightCode,
        fromAirportId: fromAirport.id,
        toAirportId: toAirport.id,
        planeId: plane.backendId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: parseInt(newFlight.price, 10),
        totalSeats: plane.totalSeats,
        intermediateAirports: intermediateAirports,
      };

      // Gọi API create
      await createFlight(backendData);

      // Reload danh sách flights
      const flightsData = await getFlights();
      const formattedFlights = formatFlightsWithSeatConfigs(flightsData, ticketClasses);
      setFlights(formattedFlights);
      alert("Tạo chuyến bay thành công!");
    } catch (err) {
      console.error("Lỗi tạo chuyến bay:", err);
      alert(err.response?.data?.message || "Không thể tạo chuyến bay");
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      const flight = flights.find((f) => f.id === flightId);
      if (!flight) return;

      // Gọi API delete với backend ID
      await deleteFlight(flight.backendId);

      // Reload danh sách flights
      const flightsData = await getFlights();
      const formattedFlights = formatFlightsWithSeatConfigs(flightsData, ticketClasses);
      setFlights(formattedFlights);
      alert("Xóa chuyến bay thành công!");
    } catch (err) {
      console.error("Lỗi xóa chuyến bay:", err);
      alert(err.response?.data?.message || "Không thể xóa chuyến bay. Có thể đã có vé được đặt.");
    }
  };

  // ✅ FIX: Tạo vé phải gọi API createTicket + reload tickets + refreshFlights
  const handleCreateTicket = async (newTicket) => {
    try {
      // 1) Gọi API tạo vé (lưu DB)
      const created = await createTicket(newTicket);

      // 2) Reload vé từ DB để seat disable đúng + có ticketId
      const ticketsData = await getTickets();
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);

      // 3) Refresh flights để availableSeats cập nhật theo backend
      await refreshFlights();

      alert(`Tạo vé ${created?.ticketId || newTicket.ticketId || ""} thành công!`);
      setFlightToBook(null);
    } catch (err) {
      console.error("Lỗi tạo vé:", err);
      alert(err?.response?.data?.message || "Không thể tạo vé");
    }
  };

  const handleUpdateTicket = async (updatedTicket) => {
    try {
      const updated = await updateTicket(updatedTicket.ticketId, updatedTicket);

      // Reload vé từ DB để tránh lệch state sau lần edit thứ 2
      const ticketsData = await getTickets();
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);

      alert(`Cập nhật vé ${updated.ticketId} thành công!`);

      // Refresh flights kèm seatConfigs đã map ticketClasses
      await refreshFlights();
    } catch (err) {
      console.error("Lỗi cập nhật vé:", err);
      alert(err?.response?.data?.message || "Không thể cập nhật vé");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
      await refreshFlights();
      alert(`Đã xóa vé ${ticketId}`);
    } catch (err) {
      console.error("Lỗi xóa vé:", err);
      alert(err?.response?.data?.message || "Không thể xóa vé");
    }
  };

  const handleCreateAirplane = (newAirplaneData) => {
    setAirplanes([...airplanes, { ...newAirplaneData, id: `PE${Math.floor(1000 + Math.random() * 9000)}` }]);
  };

  const handleUpdateAirplane = (updatedAirplane) => {
    setAirplanes(airplanes.map((p) => (p.id === updatedAirplane.id ? updatedAirplane : p)));
    const updatedFlights = flights.map((flight) => {
      if (flight.planeId === updatedAirplane.id) {
        const totalBusinessSeats = parseInt(updatedAirplane.businessSeats, 10) || 0;
        const totalEconomySeats = parseInt(updatedAirplane.economySeats, 10) || 0;
        return {
          ...flight,
          businessSeats: totalBusinessSeats,
          economySeats: totalEconomySeats,
          seatsEmpty: totalBusinessSeats + totalEconomySeats - flight.seatsTaken,
        };
      }
      return flight;
    });
    setFlights(updatedFlights);
  };

  const handleDeleteAirplane = (airplaneId) => {
    const isAirplaneInUse = flights.some((flight) => flight.planeId === airplaneId);
    if (isAirplaneInUse) {
      alert("Không thể xóa máy bay này vì đang có chuyến bay sử dụng.");
      return;
    }
    setAirplanes(airplanes.filter((p) => p.id !== airplaneId));
  };

  const handleCreateUser = (newUserData) => {
    setUsers([
      ...users,
      { ...newUserData, id: Date.now(), date: new Date().toLocaleDateString("vi-VN").replace(/\//g, "-") },
    ]);
    alert(`Tạo tài khoản ${newUserData.name} thành công!`);
  };
  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    alert(`Cập nhật tài khoản ${updatedUser.name} thành công!`);
  };
  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // --- RENDER ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "Chuyến bay":
        return (
          <FlightsTab
            flights={flights}
            airports={airports}
            airplanes={airplanes}
            rules={rules}
            onEdit={handleUpdateFlight}
            onDelete={handleDeleteFlight}
            onCreate={handleCreateFlight}
          />
        );
      case "Vé máy bay":
        return (
          <TicketsTab
            allFlights={flights}
            allAirplanes={airplanes}
            allTickets={tickets}
            onCreateTicket={handleCreateTicket}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            tickets={tickets}
          />
        );
      case "Báo cáo":
        return <ReportsTab />;
      case "Máy bay":
        return (
          <AirplanesTab airplanes={airplanes} onUpdateAirplanes={setAirplanes} ticketClasses={ticketClasses} />
        );
      case "Tài khoản và quyền":
        return (
          <UsersTab
            users={users}
            permissions={permissions}
            onUpdateUsers={setUsers}
            onUpdatePermissions={setPermissions}
          />
        );
      case "Cài đặt":
        return (
          <SettingsTab
            airports={airports}
            onUpdateAirports={setAirports}
            ticketClasses={ticketClasses}
            onUpdateTicketClasses={setTicketClasses}
            rules={rules}
            onUpdateRules={setRules}
          />
        );
      default:
        return (
          <div className="text-center p-10">
            <h2 className="text-2xl text-gray-400">Vui lòng chọn chức năng trên menu</h2>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} TABS={allowedTabs} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header activeTab={activeTab} onLogout={handleLogout} />

        {/* Content with fade-in animation */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">{renderTabContent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
