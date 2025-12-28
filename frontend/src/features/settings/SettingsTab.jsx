import React, { useEffect, useMemo, useState } from "react";
import { EditIcon, TrashIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
  createAirport,
  deleteAirport,
  updateAirport,
  createTicketClass,
  updateTicketClass,
  deleteTicketClass,
  updateSettings,
} from "../../services/api";

const SettingsTab = ({
  airports,
  onUpdateAirports,
  ticketClasses,
  onUpdateTicketClasses,
  rules,
  onUpdateRules,
}) => {
  // ---------------- Airports ----------------
  const [airportName, setAirportName] = useState("");
  const [airportCity, setAirportCity] = useState("");
  const [airportCountry, setAirportCountry] = useState("");
  const [editingAirport, setEditingAirport] = useState(null);
  const [airportToDelete, setAirportToDelete] = useState(null);

  // ---------------- Ticket Classes ----------------
  const [tcName, setTcName] = useState("");
  const [tcPercent, setTcPercent] = useState("");
  const [editingTc, setEditingTc] = useState(null);
  const [tcToDelete, setTcToDelete] = useState(null);

  // ---------------- Rules ----------------
  const [localRules, setLocalRules] = useState(rules || {});

  useEffect(() => {
    setLocalRules(rules || {});
  }, [rules]);

  const resetAirportForm = () => {
    setAirportName("");
    setAirportCity("");
    setAirportCountry("");
    setEditingAirport(null);
  };

  const resetTcForm = () => {
    setTcName("");
    setTcPercent("");
    setEditingTc(null);
  };

  // ✅ bắn event để TicketsTab tự reload ticketClasses
  const notifyTicketClassesChanged = () => {
    window.dispatchEvent(new Event("ticket-classes:changed"));
  };

  // ---------------- Airports handlers ----------------
  const handleSubmitAirport = async (e) => {
    e.preventDefault();
    try {
      if (!airportName.trim() || !airportCity.trim() || !airportCountry.trim()) {
        alert("Vui lòng nhập đầy đủ thông tin sân bay!");
        return;
      }

      if (editingAirport) {
        const updated = await updateAirport(editingAirport.id, {
          name: airportName,
          city: airportCity,
          country: airportCountry,
        });
        onUpdateAirports(
          airports.map((a) => (a.id === editingAirport.id ? updated : a))
        );
      } else {
        const created = await createAirport({
          name: airportName,
          city: airportCity,
          country: airportCountry,
        });
        onUpdateAirports([...(airports || []), created]);
      }

      resetAirportForm();
    } catch (err) {
      console.error("Airport submit failed:", err);
      alert(err?.response?.data?.message || "Không thể lưu sân bay");
    }
  };

  const confirmDeleteAirport = async () => {
    try {
      await deleteAirport(airportToDelete);
      onUpdateAirports((airports || []).filter((a) => a.id !== airportToDelete));
      setAirportToDelete(null);
    } catch (err) {
      console.error("Delete airport failed:", err);
      alert(err?.response?.data?.message || "Không thể xóa sân bay");
    }
  };

  // ---------------- Ticket class handlers ----------------
  const handleSubmitTicketClass = async (e) => {
    e.preventDefault();
    try {
      if (!tcName.trim()) {
        alert("Vui lòng nhập tên hạng vé!");
        return;
      }
      const pct = Number(tcPercent);
      if (!Number.isFinite(pct) || pct <= 0) {
        alert("Phần trăm đơn giá phải là số > 0");
        return;
      }

      if (editingTc) {
        const updated = await updateTicketClass(editingTc.id, {
          name: tcName,
          percentage: pct,
        });
        onUpdateTicketClasses(
          (ticketClasses || []).map((t) => (t.id === editingTc.id ? updated : t))
        );
      } else {
        const created = await createTicketClass({
          name: tcName,
          percentage: pct,
        });
        onUpdateTicketClasses([...(ticketClasses || []), created]);
      }

      resetTcForm();
      notifyTicketClassesChanged(); // ✅
    } catch (err) {
      console.error("Ticket class submit failed:", err);
      alert(err?.response?.data?.message || "Không thể lưu hạng vé");
    }
  };

  const confirmDeleteTicketClass = async () => {
    try {
      await deleteTicketClass(tcToDelete);
      onUpdateTicketClasses((ticketClasses || []).filter((t) => t.id !== tcToDelete));
      setTcToDelete(null);
      notifyTicketClassesChanged(); // ✅
    } catch (err) {
      console.error("Delete ticket class failed:", err);
      alert(err?.response?.data?.message || "Không thể xóa hạng vé");
    }
  };

  // ---------------- Rules handlers ----------------
  const handleSaveRules = async () => {
    try {
      const updated = await updateSettings(localRules);
      onUpdateRules(updated);
      alert("Đã lưu quy định!");
    } catch (err) {
      console.error("Update settings failed:", err);
      alert(err?.response?.data?.message || "Không thể lưu quy định");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-10">
      {/* Airports + Ticket classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Airports */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Sân bay</h2>

          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Tên Sân bay", "Thành phố", "Thao tác"].map((h) => (
                    <th key={h} className="p-3 text-left font-semibold text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(airports || []).map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3">{a.name}</td>
                    <td className="p-3">{a.city}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAirport(a);
                            setAirportName(a.name);
                            setAirportCity(a.city);
                            setAirportCountry(a.country);
                          }}
                          className="p-1 text-gray-500 hover:text-green-600"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAirportToDelete(a.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {(airports || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Chưa có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleSubmitAirport} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={airportName}
                onChange={(e) => setAirportName(e.target.value)}
                placeholder="Tên sân bay"
                className="p-2 border rounded"
              />
              <input
                value={airportCity}
                onChange={(e) => setAirportCity(e.target.value)}
                placeholder="Thành phố"
                className="p-2 border rounded"
              />
              <input
                value={airportCountry}
                onChange={(e) => setAirportCountry(e.target.value)}
                placeholder="Quốc gia"
                className="p-2 border rounded"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg">
              {editingAirport ? "Lưu" : "Thêm"}
            </button>

            {editingAirport && (
              <button
                type="button"
                onClick={resetAirportForm}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
              >
                Hủy
              </button>
            )}
          </form>
        </div>

        {/* Ticket Classes */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Hạng vé</h2>

          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Tên hạng vé", "Phần trăm", "Thao tác"].map((h) => (
                    <th key={h} className="p-3 text-left font-semibold text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(ticketClasses || []).map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.percentage}%</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTc(t);
                            setTcName(t.name);
                            setTcPercent(String(t.percentage));
                          }}
                          className="p-1 text-gray-500 hover:text-green-600"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTcToDelete(t.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {(ticketClasses || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Chưa có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleSubmitTicketClass} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={tcName}
                onChange={(e) => setTcName(e.target.value)}
                placeholder="Tên hạng vé"
                className="p-2 border rounded"
              />
              <input
                value={tcPercent}
                onChange={(e) => setTcPercent(e.target.value)}
                placeholder="Phần trăm đơn giá"
                className="p-2 border rounded"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg">
              {editingTc ? "Lưu" : "Tạo hạng vé"}
            </button>

            {editingTc && (
              <button
                type="button"
                onClick={resetTcForm}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
              >
                Hủy
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Rules */}
      <div className="border rounded-xl p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Quy định chung</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Thời gian bay tối thiểu</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.minFlightTime ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, minFlightTime: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Phút</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Số sân bay trung gian tối đa</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.maxStopovers ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, maxStopovers: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Sân</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Thời gian dừng tối thiểu</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.minStopTime ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, minStopTime: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Phút</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Thời gian dừng tối đa</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.maxStopTime ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, maxStopTime: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Phút</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Thời gian đặt vé chậm nhất</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.latestBookingTime ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, latestBookingTime: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Ngày</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Thời gian hủy đặt vé chậm nhất</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={localRules.latestCancelTime ?? ""}
                onChange={(e) => setLocalRules({ ...localRules, latestCancelTime: Number(e.target.value) })}
              />
              <span className="self-center text-gray-500 text-sm">Giờ</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveRules}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>

      {/* Modals */}
      {airportToDelete && (
        <ConfirmationModal
          message="Bạn có chắc muốn xóa sân bay này?"
          onConfirm={confirmDeleteAirport}
          onCancel={() => setAirportToDelete(null)}
        />
      )}

      {tcToDelete && (
        <ConfirmationModal
          message="Bạn có chắc muốn xóa hạng vé này?"
          onConfirm={confirmDeleteTicketClass}
          onCancel={() => setTcToDelete(null)}
        />
      )}
    </div>
  );
};

export default SettingsTab;
