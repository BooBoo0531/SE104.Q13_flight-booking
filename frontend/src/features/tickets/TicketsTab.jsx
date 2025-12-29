import React, { useEffect, useMemo, useState } from "react";
import { EditIcon, TrashIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { getTicketClasses } from "../../services/api";

// -------------------- Helpers --------------------
const normalizeKey = (s) =>
  (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const guessSeatGroupByClassName = (name) => {
  const k = normalizeKey(name);
  // Trả về prefix thống nhất: 'b' cho Thương gia/VIP/First, 'e' cho Phổ thông
  if (
    k.includes("thuong gia") ||
    k.includes("thuong") ||
    k.includes("business") ||
    k.includes("vip") ||
    k.includes("hang nhat") ||
    k.includes("first")
  ) {
    return "b";
  }
  return "e";
};

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

// -------------------- Sub-component: TicketForm --------------------
const TicketForm = ({
  initialData,
  flightForBooking,
  allFlights,
  allAirplanes,
  allTickets,
  ticketClasses,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [airplane, setAirplane] = useState(null);

  const [ticketInfo, setTicketInfo] = useState({
    flightId: "",
    name: "",
    idCard: "",
    phone: "",
    email: "",
  });

  const [selectedSeat, setSelectedSeat] = useState(null);

  // ✅ fallback nếu chưa load được ticketClasses
  const safeTicketClasses = useMemo(() => {
    const list = Array.isArray(ticketClasses) ? ticketClasses : [];
    if (list.length > 0) return list;

    // fallback 2 hạng cơ bản (để UI không trống)
    return [
      { id: "fallback-economy", name: "Phổ thông", percentage: 100 },
      { id: "fallback-business", name: "Thương gia", percentage: 150 },
    ];
  }, [ticketClasses]);

  // ✅ default class: ưu tiên % = 100 hoặc tên có "phổ thông"
  const defaultClass = useMemo(() => {
    const list = safeTicketClasses.map((tc) => ({
      ...tc,
      key: normalizeKey(tc.name),
      pct: Number(tc.percentage),
    }));

    return (
      list.find((x) => Number.isFinite(x.pct) && x.pct === 100) ||
      list.find((x) => x.key.includes("pho thong") || x.key.includes("economy")) ||
      list[0] ||
      null
    );
  }, [safeTicketClasses]);

  const [selectedClass, setSelectedClass] = useState(defaultClass);

  // nếu ticketClasses thay đổi => giữ selection nếu còn tồn tại
  useEffect(() => {
    if (!selectedClass && defaultClass) {
      setSelectedClass(defaultClass);
      return;
    }
    if (!selectedClass) return;

    const stillExists = safeTicketClasses.some(
      (c) => String(c.id) === String(selectedClass.id)
    );
    if (!stillExists) setSelectedClass(defaultClass);
  }, [safeTicketClasses, defaultClass]); // eslint-disable-line

  // ✅ group ghế theo tên hạng vé (B/E) hoặc prefix từ seatConfigs
  const seatGroup = useMemo(() => {
    if (selectedFlight?.seatConfigs?.length) {
      const cfg = selectedFlight.seatConfigs.find(c => String(c.ticketClassId) === String(selectedClass?.id));
      if (cfg?.prefix) return cfg.prefix.toLowerCase();
    }
    return guessSeatGroupByClassName(selectedClass?.name);
  }, [selectedClass?.name, selectedClass?.id, selectedFlight?.seatConfigs]);

  // ✅ giá theo % hạng vé
  const computedPrice = useMemo(() => {
    const base = Number(selectedFlight?.price ?? 0);
    const pctRaw = Number(selectedClass?.percentage ?? 100);
    const pct = Number.isFinite(pctRaw) && pctRaw > 0 ? pctRaw : 100;
    return Math.round((base * pct) / 100);
  }, [selectedFlight?.price, selectedClass?.percentage]);

  // ✅ init form
  useEffect(() => {
    let flight = null;

    if (isEditMode) {
      flight = allFlights.find(
        (f) =>
          String(f.flightCode) === String(initialData.flightId) ||
          String(f.id) === String(initialData.flightId)
      );

      setTicketInfo({
        flightId: initialData.flightId,
        name: initialData.name,
        idCard: initialData.idCard,
        phone: initialData.phone,
        email: initialData.email,
      });

      setSelectedSeat(initialData.seat);

      // ✅ chọn đúng hạng vé theo DB (match theo name)
      const target = normalizeKey(initialData.seatClass);
      const match =
        safeTicketClasses.find((tc) => normalizeKey(tc.name) === target) ||
        defaultClass;
      setSelectedClass(match);
    } else if (flightForBooking) {
      flight = flightForBooking;

      setTicketInfo({
        flightId: flight.flightCode ?? flight.id,
        name: "",
        idCard: "",
        phone: "",
        email: "",
      });

      setSelectedSeat(null);
      setSelectedClass(defaultClass);
    } else {
      // create mode bình thường
      setSelectedClass(defaultClass);
    }

    setSelectedFlight(flight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, flightForBooking, allFlights, isEditMode, defaultClass]);

  useEffect(() => {
    if (selectedFlight) {
      const plane = allAirplanes.find((p) => p.id === selectedFlight.planeId);
      setAirplane(plane);
    } else {
      setAirplane(null);
    }
  }, [selectedFlight, allAirplanes]);

  // reset seat nếu đổi hạng vé không đúng nhóm ghế
  useEffect(() => {
    if (!selectedSeat) return;
    const seatPrefix = selectedSeat.match(/^[A-Z]+/)?.[0]?.toLowerCase() || '';
    if (seatPrefix !== seatGroup) setSelectedSeat(null);
  }, [seatGroup, selectedSeat]);

  const handleFlightSelect = (flightId) => {
    const flight = allFlights.find((f) => String(f.id) === String(flightId));
    if (!flight) return;

    setSelectedFlight(flight);
    setTicketInfo({
      flightId: flight.flightCode ?? flight.id,
      name: "",
      idCard: "",
      phone: "",
      email: "",
    });
    setSelectedSeat(null);
  };

  const validateRequired = () => {
    const name = (ticketInfo.name || "").trim();
    const idCard = (ticketInfo.idCard || "").trim();
    const phone = (ticketInfo.phone || "").trim();
    const email = (ticketInfo.email || "").trim();

    if (!name) return "Vui lòng nhập Họ và tên.";
    if (!/^\d{9}(\d{3})?$/.test(idCard))
      return "CMND/CCCD phải là 9 số hoặc 12 số.";
    if (!/^\d{10}$/.test(phone)) return "Số điện thoại phải đúng 10 số.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFlight) return alert("Vui lòng chọn chuyến bay.");
    if (!selectedSeat) return alert("Vui lòng chọn ghế.");
    if (!selectedClass) return alert("Vui lòng chọn hạng vé.");

    const err = validateRequired();
    if (err) return alert(err);

    const finalTicketData = {
      ...ticketInfo,
      flightId: selectedFlight.flightCode ?? selectedFlight.id,
      seat: selectedSeat,
      seatClass: selectedClass.name, // ✅ gửi đúng name hạng vé trong DB
      price: computedPrice, // FE tính để hiển thị; nếu BE có tính lại thì càng tốt
      ticketId: isEditMode ? initialData.ticketId : undefined,
    };

    onSubmit(finalTicketData);
  };

  const Seat = ({ id, type, isTaken }) => {
    const isSelected = selectedSeat === id;

    // type = prefix from seatConfigs (e.g., 'e', 'b', 'p'); seatGroup = selected class prefix
    const isDisabledByType = type !== seatGroup;

    let seatClassStyle = "";
    if (isDisabledByType)
      seatClassStyle = "bg-gray-200 text-gray-400 cursor-not-allowed";
    else if (isTaken) seatClassStyle = "bg-gray-500 cursor-not-allowed text-white";
    else if (isSelected) seatClassStyle = "bg-red-500 text-white";
    else if (type === 'b' || type === 'business')
      seatClassStyle = "bg-teal-200 hover:bg-teal-300 text-teal-800";
    else
      seatClassStyle = "bg-cyan-200 hover:bg-cyan-300 text-cyan-800";

    const canClick = !isTaken && !isDisabledByType;

    return (
      <button
        type="button"
        onClick={() => canClick && setSelectedSeat(id)}
        className={`w-10 h-10 rounded text-xs font-semibold flex items-center justify-center transition-colors ${seatClassStyle}`}
      >
        {id}
      </button>
    );
  };

  const flightKey = selectedFlight?.flightCode ?? selectedFlight?.id;
  const bookedSeats = (allTickets || [])
    .filter((ticket) => String(ticket.flightId) === String(flightKey))
    .map((ticket) => ticket.seat);

  return (
    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-3">
        <h3 className="font-semibold text-lg text-gray-700">Thông tin vé</h3>

        <select
          value={selectedFlight?.id || ""}
          onChange={(e) => handleFlightSelect(e.target.value)}
          disabled={!!flightForBooking || isEditMode}
          className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
        >
          <option value="">-- Chọn chuyến bay --</option>
          {allFlights.map((f) => (
            <option key={f.id} value={f.id}>
              {f.flightCode ?? f.id}: {f.fromCity} - {f.toCity}
            </option>
          ))}
        </select>

        <input
          value={selectedFlight ? formatVND(computedPrice) : ""}
          readOnly
          placeholder="Giá vé"
          className="w-full p-2 border rounded bg-gray-100"
        />

        <input
          value={ticketInfo.name}
          onChange={(e) => setTicketInfo({ ...ticketInfo, name: e.target.value })}
          placeholder="Họ và tên"
          className="w-full p-2 border rounded"
          required
        />
        <input
          value={ticketInfo.idCard}
          onChange={(e) => setTicketInfo({ ...ticketInfo, idCard: e.target.value })}
          placeholder="CMND/CCCD"
          className="w-full p-2 border rounded"
          required
        />
        <input
          value={ticketInfo.phone}
          onChange={(e) => setTicketInfo({ ...ticketInfo, phone: e.target.value })}
          placeholder="Số điện thoại"
          className="w-full p-2 border rounded"
          required
        />
        <input
          value={ticketInfo.email}
          onChange={(e) => setTicketInfo({ ...ticketInfo, email: e.target.value })}
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            {isEditMode ? "Lưu vé" : "Tạo vé"}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className={`lg:col-span-2 p-4 border rounded-lg bg-white ${!selectedFlight ? "opacity-50 cursor-not-allowed" : ""}`}>
        {/* ✅ HẠNG VÉ LẤY ĐỘNG TỪ SETTINGS */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {safeTicketClasses.map((tc) => {
            const active = String(selectedClass?.id) === String(tc.id);
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => setSelectedClass(tc)}
                disabled={!selectedFlight}
                className={`px-4 py-2 rounded ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={`${tc.percentage ?? 100}%`}
              >
                {tc.name}
              </button>
            );
          })}
        </div>

        <div className={`grid grid-cols-6 gap-2 ${!selectedFlight ? "pointer-events-none" : ""}`}>
          {selectedFlight?.seatConfigs?.length ? (
            // ✅ Dynamic seat generation from seatConfigs
            selectedFlight.seatConfigs.map((cfg) =>
              Array.from({ length: cfg.seatCount }, (_, i) => {
                const seatId = `${cfg.prefix}${i + 1}`;
                return (
                  <Seat
                    key={seatId}
                    id={seatId}
                    type={cfg.prefix.toLowerCase()}
                    isTaken={bookedSeats.includes(seatId)}
                  />
                );
              })
            )
          ) : airplane ? (
            // ✅ Fallback: legacy B/E seats
            <>
              {Array.from({ length: airplane.businessSeats }, (_, i) => `B${i + 1}`).map((seatId) => (
                <Seat key={seatId} id={seatId} type="b" isTaken={bookedSeats.includes(seatId)} />
              ))}
              {Array.from({ length: airplane.economySeats }, (_, i) => `E${i + 1}`).map((seatId) => (
                <Seat key={seatId} id={seatId} type="e" isTaken={bookedSeats.includes(seatId)} />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </form>
  );
};

// -------------------- Sub-component: LookupTicket (LỌC CẢ MÃ CHUYẾN BAY & MÃ VÉ) --------------------
const LookupTicket = ({ tickets, canBook, onEdit, onDelete }) => {
  const [mode, setMode] = useState("flightId"); // ✅ flightId | ticketId
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const key = normalizeKey(q);
    if (!key) return tickets || [];

    return (tickets || []).filter((t) => normalizeKey(t?.[mode]).includes(key));
  }, [tickets, q, mode]);

  const clear = () => setQ("");

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="flightId">Lọc theo mã chuyến bay</option>
          <option value="ticketId">Lọc theo mã vé</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder={mode === "flightId" ? "VD: VN2846 / FL0069" : "VD: TK1234"}
          className="flex-1 p-2 border rounded"
        />

        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Xóa
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Mã vé", "Chuyến bay", "Ghế", "Hạng", "Giá", "Hành khách", "Thao tác"].map((h) => (
                <th key={h} className="p-2 text-left font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.ticketId} className="border-t">
                <td className="p-2">{t.ticketId}</td>
                <td className="p-2">{t.flightId}</td>
                <td className="p-2">{t.seat}</td>
                <td className="p-2">{t.seatClass}</td>
                <td className="p-2">{formatVND(Number(t.price || 0))}</td>
                <td className="p-2">{t.name}</td>
                <td className="p-2">
                  {canBook ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(t)} className="p-1 text-gray-400 hover:text-green-500">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(t.ticketId)} className="p-1 text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------- Main: TicketsTab --------------------
const TicketsTab = ({
  flightToBook,
  allFlights,
  allAirplanes,
  onCreateTicket,
  onUpdateTicket,
  onDeleteTicket,
  tickets,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canBook = ["Quản trị", "Nhân viên"].includes(user.role);

  const [subTab, setSubTab] = useState(canBook ? "create" : "lookup");
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const [ticketClasses, setTicketClasses] = useState([]);

  const loadTicketClasses = async () => {
    try {
      const data = await getTicketClasses();
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setTicketClasses(list);
    } catch (err) {
      console.error("getTicketClasses failed:", err);
      setTicketClasses([]);
    }
  };

  useEffect(() => {
    loadTicketClasses();
  }, []);

  // ✅ settings bắn event thì tickets tự reload
  useEffect(() => {
    const onChanged = () => loadTicketClasses();
    window.addEventListener("ticket-classes:changed", onChanged);
    return () => window.removeEventListener("ticket-classes:changed", onChanged);
  }, []);

  useEffect(() => {
    if (flightToBook && canBook) {
      setSubTab("create");
      setEditingTicket(null);
    }
  }, [flightToBook, canBook]);

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setSubTab("edit");
  };

  const handleDeleteClick = (ticketId) => setTicketToDelete(ticketId);

  const confirmDelete = () => {
    onDeleteTicket(ticketToDelete);
    setTicketToDelete(null);
  };

  const cancelDelete = () => setTicketToDelete(null);

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setSubTab("lookup");
  };

  const handleFormSubmit = (ticketData) => {
    if (editingTicket) onUpdateTicket(ticketData);
    else onCreateTicket(ticketData);

    setEditingTicket(null);
    setSubTab("lookup");
  };

  return (
    <div>
      <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {canBook && (
            <button
              onClick={() => setSubTab("create")}
              className={`px-6 py-2 rounded-full text-sm font-semibold ${
                subTab === "create"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tạo vé máy bay
            </button>
          )}

          <button
            onClick={() => setSubTab("lookup")}
            className={`px-6 py-2 rounded-full text-sm font-semibold ${
              subTab === "lookup"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tra cứu
          </button>

          {subTab === "edit" && (
            <span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow">
              Chỉnh sửa vé
            </span>
          )}
        </div>
      </div>

      {subTab === "create" && canBook && (
        <TicketForm
          allFlights={allFlights}
          allAirplanes={allAirplanes}
          allTickets={tickets}
          flightForBooking={flightToBook}
          ticketClasses={ticketClasses}
          onSubmit={handleFormSubmit}
        />
      )}

      {subTab === "edit" && canBook && (
        <TicketForm
          initialData={editingTicket}
          allFlights={allFlights}
          allAirplanes={allAirplanes}
          allTickets={tickets}
          ticketClasses={ticketClasses}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
        />
      )}

      {subTab === "lookup" && (
        <LookupTicket
          tickets={tickets}
          canBook={canBook}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {ticketToDelete && (
        <ConfirmationModal
          message="Bạn có chắc muốn xóa vé này?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TicketsTab;
