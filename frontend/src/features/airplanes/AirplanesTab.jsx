import React, { useState, useEffect } from "react";
import axios from "axios";
import { EditIcon, TrashIcon, SearchIcon, PlusCircleIcon } from "../../components/common/Icons";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const API_URL = "http://localhost:3000/airplanes";

const AirplaneForm = ({ initialData, onSubmit, onCancel, ticketClasses }) => {
    const isEditMode = !!initialData;

    const getPrefixForClassName = (name) => {
        // Lấy chữ cái đầu tiên của tên hạng vé (normalize để xử lý dấu tiếng Việt)
        const normalized = (name || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toUpperCase();
        return normalized.charAt(0) || 'X';
    };

    const buildSeatConfigs = (plane, classes) => {
        if (plane?.seatConfigs?.length) return plane.seatConfigs;
        // Fallback: nếu có ticketClasses thì map theo classes, nếu không thì để rỗng
        if (!classes || classes.length === 0) return [];
        return classes.map(tc => ({
            ticketClassId: tc.id,
            name: tc.name,
            prefix: getPrefixForClassName(tc.name),
            seatCount: 0
        }));
    };

    const [planeData, setPlaneData] = useState(isEditMode ? initialData : { name: 'Máy bay mới', code: '', economySeats: 0, businessSeats: 0, seatConfigs: buildSeatConfigs({}, ticketClasses) });
    const [seatConfigs, setSeatConfigs] = useState(buildSeatConfigs(initialData, ticketClasses));

    useEffect(() => {
        if (initialData) {
            setPlaneData(initialData);
            // Luôn set seatConfigs từ initialData nếu có
            if (initialData.seatConfigs && initialData.seatConfigs.length > 0) {
                // Remap seatConfigs để match với ticketClasses hiện tại VÀ normalize prefix
                const remappedConfigs = initialData.seatConfigs.map(cfg => {
                    if (ticketClasses && ticketClasses.length > 0) {
                        // Tìm ticketClass matching theo tên hoặc prefix
                        const matchedClass = ticketClasses.find(tc => {
                            const tcName = (tc.name || '').toLowerCase();
                            const cfgName = (cfg.name || '').toLowerCase();
                            return tcName === cfgName || 
                                   (cfg.prefix && tc.name && (cfg.prefix.toLowerCase() === tc.name.charAt(0).toLowerCase()));
                        });
                        if (matchedClass) {
                            return { 
                                ...cfg, 
                                ticketClassId: matchedClass.id,
                                name: matchedClass.name,
                                prefix: getPrefixForClassName(matchedClass.name)
                            };
                        }
                    }
                    // Nếu không match được class, vẫn normalize prefix dựa trên tên hiện có
                    return { ...cfg, prefix: getPrefixForClassName(cfg.name) };
                });
                setSeatConfigs(remappedConfigs);
            } else if (ticketClasses && ticketClasses.length > 0) {
                // Build từ legacy fields nếu không có seatConfigs
                const legacyConfigs = ticketClasses.map(tc => {
                    const name = tc.name || '';
                    let seatCount = 0;
                    if (/pho thong|economy/i.test(name)) {
                        seatCount = initialData.economySeats || 0;
                    } else if (/thuong gia|business|vip/i.test(name)) {
                        seatCount = initialData.businessSeats || 0;
                    }
                    return {
                        ticketClassId: tc.id,
                        name: tc.name,
                        prefix: getPrefixForClassName(tc.name),
                        seatCount: seatCount
                    };
                });
                setSeatConfigs(legacyConfigs);
            }
        }
    }, [initialData, ticketClasses]);

    // Khi ticketClasses thay đổi ở create mode, cập nhật seatConfigs
    useEffect(() => {
        if (!isEditMode && ticketClasses && ticketClasses.length > 0) {
            setSeatConfigs(prev => {
                // Thêm ticket classes mới nếu chưa có
                const merged = [...prev];
                ticketClasses.forEach(tc => {
                    if (!merged.find(c => String(c.ticketClassId) === String(tc.id))) {
                        merged.push({
                            ticketClassId: tc.id,
                            name: tc.name,
                            prefix: getPrefixForClassName(tc.name),
                            seatCount: 0
                        });
                    }
                });
                return merged;
            });
        }
    }, [ticketClasses, isEditMode]);

    const handleInputChange = (e) => { const { name, value } = e.target; setPlaneData(prev => ({...prev, [name]: value})); }

    const handleSeatConfigChange = (ticketClassId, value) => {
        setSeatConfigs(prev => {
            const exists = prev.some(cfg => String(cfg.ticketClassId) === String(ticketClassId));
            if (!exists) {
                const tc = ticketClasses?.find(t => String(t.id) === String(ticketClassId));
                const prefix = getPrefixForClassName(tc?.name);
                return [...prev, { ticketClassId, name: tc?.name || `Hạng ${ticketClassId}`, prefix, seatCount: value }];
            }
            return prev.map(cfg => String(cfg.ticketClassId) === String(ticketClassId) ? { ...cfg, seatCount: value } : cfg);
        });
    };

    const computedTotalSeats = seatConfigs.reduce((s, c) => s + (parseInt(c.seatCount, 10) || 0), 0);
    
    const handleSubmit = () => { 
        // Validate cơ bản: yêu cầu code, name và tổng ghế > 0
        if (!planeData.code || !planeData.name) {
            alert("Vui lòng nhập đầy đủ Số hiệu (code) và Tên máy bay.");
            return;
        }
        if (computedTotalSeats <= 0) {
            alert("Vui lòng nhập số ghế cho ít nhất một hạng vé.");
            return;
        }
        const payload = { ...planeData, seatConfigs, totalSeats: computedTotalSeats };
        onSubmit(payload); 
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-700">{isEditMode ? 'Cập nhật máy bay' : 'Thông tin máy bay mới'}</h3>
                
                <input name="code" value={planeData.code} onChange={handleInputChange} placeholder="Số hiệu (VD: VN-A123)" className="w-full p-2 border rounded" disabled={isEditMode} />
                
                <input name="name" value={planeData.name} onChange={handleInputChange} placeholder="Tên máy bay" className="w-full p-2 border rounded" />
                
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h4 className="font-semibold text-gray-600 mb-2">Chi tiết hạng vé</h4>
                    {ticketClasses && ticketClasses.length > 0 ? (
                        ticketClasses.map((tc) => {
                            const cfg = seatConfigs.find(c => String(c.ticketClassId) === String(tc.id)) || { ticketClassId: tc.id, name: tc.name, prefix: getPrefixForClassName(tc.name), seatCount: 0 };
                            return (
                                <div className="flex items-center gap-2" key={tc.id}>
                                    <label className="w-32 text-sm font-medium text-gray-700">{tc.name}</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={cfg.seatCount}
                                        onChange={(e) => handleSeatConfigChange(tc.id, Number(e.target.value))}
                                        placeholder="Số ghế"
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <span className="text-xs text-gray-500 w-20">Prefix: {cfg.prefix}</span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có hạng vé. Vui lòng tạo hạng vé trong phần Cài đặt.</p>
                    )}
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex justify-between items-center"><span className="font-semibold text-gray-600">Tổng số ghế:</span><span className="font-bold text-xl text-blue-600">{computedTotalSeats}</span></div>
                <div className="flex gap-4"><button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu</button><button onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy</button></div>
            </div>
            
            <div className="lg:col-span-2 p-4 border rounded-lg bg-white">
                <div className="grid grid-cols-6 gap-2">
                    {seatConfigs.map((cfg) => 
                        Array.from({ length: parseInt(cfg.seatCount) || 0 }, (_, i) => {
                            const seatId = `${cfg.prefix}${i + 1}`;
                            // Xác định màu dựa trên prefix hoặc tên hạng
                            let bgColor = 'bg-cyan-200 text-cyan-800'; // Default
                            const nameLower = (cfg.name || '').toLowerCase();
                            if (/thuong gia|business|vip/i.test(nameLower) || cfg.prefix.toUpperCase() === 'T') {
                                bgColor = 'bg-teal-200 text-teal-800'; // Thương gia
                            } else if (/pho thong|economy/i.test(nameLower) || cfg.prefix.toUpperCase() === 'P') {
                                bgColor = 'bg-cyan-200 text-cyan-800'; // Phổ thông
                            }
                            return (
                                <div key={seatId} className={`w-10 h-10 ${bgColor} rounded flex items-center justify-center text-xs font-semibold`}>
                                    {seatId}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

// 👇 Nhận prop canManage để ẩn hiện nút thao tác
const AirplanesList = ({ airplanes, onEdit, onCreate, onDelete, canManage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const safeList = Array.isArray(airplanes) ? airplanes : [];

    const filteredAirplanes = safeList.filter(plane => {
        const name = plane.name ? plane.name.toLowerCase() : '';
        const code = plane.code ? plane.code.toLowerCase() : '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || code.includes(search);
    });

    return (
        <div className="p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <input type="text" placeholder="Tìm mã hoặc tên máy bay..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {/* 👇 Chỉ hiện nút Tạo mới nếu có quyền */}
                {canManage && (
                    <button onClick={onCreate} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all shadow flex items-center space-x-2"><PlusCircleIcon className="w-5 h-5"/><span>Tạo mới</span></button>
                )}
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Số hiệu (Code)</th>
                            <th className="p-4 font-semibold text-gray-600">Tên máy bay</th>
                            <th className="p-4 font-semibold text-gray-600">Số lượng ghế</th>
                            {/* 👇 Chỉ hiện cột Thao tác nếu có quyền */}
                            {canManage && <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAirplanes.length > 0 ? filteredAirplanes.map(plane => (
                            <tr key={plane.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-blue-600 font-bold">{plane.code}</td>
                                <td className="p-4 text-gray-800">{plane.name}</td>
                                <td className="p-4 text-gray-800"><span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">{plane.totalSeats}</span></td>
                                
                                {/* 👇 Chỉ hiện nút Sửa/Xóa nếu có quyền */}
                                {canManage && (
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => onEdit(plane)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition"><EditIcon className="w-4 h-4"/></button>
                                            <button onClick={() => onDelete(plane.backendId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AirplanesTab = ({ airplanes: propAirplanes, onUpdateAirplanes, ticketClasses }) => { 
    const [airplanes, setAirplanes] = useState(propAirplanes || []);
    const [subTab, setSubTab] = useState('list');
    const [editingAirplane, setEditingAirplane] = useState(null);
    const [airplaneToDelete, setAirplaneToDelete] = useState(null);

    // 👇 LOGIC PHÂN QUYỀN
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Admin và Điều hành bay được quản lý. Ban giám đốc chỉ xem.
    const canManage = ['Quản trị', 'Điều hành bay'].includes(user.role);

    // Sync props to local state when props change
    useEffect(() => {
        setAirplanes(propAirplanes || []);
    }, [propAirplanes]);

    const handleSave = async (planeData) => {
        try {
            const getPrefixForClassName = (name) => {
                const n = (name || '').toLowerCase();
                if (/pho thong|economy/.test(n)) return 'E';
                if (/thuong gia|business|vip/.test(n)) return 'B';
                return (name || '').charAt(0).toUpperCase() || 'X';
            };

            const seatConfigs = Array.isArray(planeData.seatConfigs) ? planeData.seatConfigs.map(cfg => ({
                ...cfg,
                seatCount: Number(cfg.seatCount) || 0,
                prefix: cfg.prefix || getPrefixForClassName(cfg.name)
            })) : [];

            const economySeats = seatConfigs
                .filter(c => /pho thong|economy/i.test(c.name || '') || (c.prefix || '').toUpperCase() === 'P')
                .reduce((s, c) => s + (Number(c.seatCount) || 0), 0);
            const businessSeats = seatConfigs
                .filter(c => /thuong gia|business|vip/i.test(c.name || '') || (c.prefix || '').toUpperCase() === 'T')
                .reduce((s, c) => s + (Number(c.seatCount) || 0), 0);

            const payload = {
                name: planeData.name,
                code: planeData.code,
                seatConfigs,
                economySeats,
                businessSeats,
            };

            if (editingAirplane) {
                const res = await axios.patch(`${API_URL}/${editingAirplane.backendId}`, payload);
                const updatedAirplanes = airplanes.map(a => a.backendId === editingAirplane.backendId ? {
                    id: res.data.code,
                    backendId: res.data.id,
                    name: res.data.name,
                    code: res.data.code,
                    totalSeats: res.data.totalSeats,
                    businessSeats: res.data.businessSeats,
                    economySeats: res.data.economySeats,
                    seatConfigs: res.data.seatConfigs,
                } : a);
                setAirplanes(updatedAirplanes);
                onUpdateAirplanes(updatedAirplanes);
                alert("Cập nhật máy bay thành công!");
            } else {
                const res = await axios.post(API_URL, payload);
                // Sau khi tạo, tải lại danh sách để đảm bảo đồng bộ seatConfigs và tổng ghế
                const listRes = await axios.get(API_URL);
                const fresh = Array.isArray(listRes?.data) ? listRes.data.map(p => ({
                    id: p.code,
                    backendId: p.id,
                    name: p.name,
                    code: p.code,
                    totalSeats: p.totalSeats,
                    businessSeats: p.businessSeats,
                    economySeats: p.economySeats,
                    seatConfigs: p.seatConfigs,
                })) : [];
                setAirplanes(fresh);
                onUpdateAirplanes(fresh);
                alert("Thêm máy bay thành công!");
            }
            setSubTab('list');
            setEditingAirplane(null);
        } catch (error) {
            alert("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteClick = (planeBackendId) => { setAirplaneToDelete(planeBackendId); }
    
    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${airplaneToDelete}`);
            const updatedAirplanes = airplanes.filter(a => a.backendId !== airplaneToDelete);
            setAirplanes(updatedAirplanes);
            onUpdateAirplanes(updatedAirplanes);
        } catch (error) {
            alert("Máy bay này không thể xóa vì đang có chuyến bay sử dụng.");
        } finally {
            setAirplaneToDelete(null);
        }
    }

    const cancelDelete = () => setAirplaneToDelete(null);
    const handleCreateClick = () => { setEditingAirplane(null); setSubTab('create'); }
    const handleEditClick = (plane) => { 
        // Đảm bảo plane có seatConfigs (fallback nếu không có)
        const planeWithConfigs = {
            ...plane,
            seatConfigs: plane.seatConfigs || [
                { ticketClassId: 0, name: 'Phổ thông', prefix: 'E', seatCount: plane.economySeats || 0 },
                { ticketClassId: 1, name: 'Thương gia', prefix: 'B', seatCount: plane.businessSeats || 0 },
            ]
        };
        setEditingAirplane(planeWithConfigs); 
        setSubTab('edit'); 
    }
    const handleCancel = () => { setEditingAirplane(null); setSubTab('list'); }
    
    const SubTabButton = ({ value, children }) => ( <button onClick={() => { setSubTab(value); setEditingAirplane(null); }} className={`px-6 py-2 rounded-full text-sm font-semibold ${subTab === value && !editingAirplane ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button> );

    const renderContent = () => {
        switch(subTab) {
            // 👇 Truyền canManage xuống List
            case 'list': return <AirplanesList airplanes={airplanes} onCreate={handleCreateClick} onEdit={handleEditClick} onDelete={handleDeleteClick} canManage={canManage}/>;
            
            // 👇 Chặn truy cập Form nếu không có quyền
            case 'create': 
                return canManage ? <AirplaneForm initialData={editingAirplane} onSubmit={handleSave} onCancel={handleCancel} ticketClasses={ticketClasses} /> : <div className="p-6 text-red-500">Bạn không có quyền thêm mới.</div>;
            case 'edit': 
                return canManage ? <AirplaneForm initialData={editingAirplane} onSubmit={handleSave} onCancel={handleCancel} ticketClasses={ticketClasses} /> : <div className="p-6 text-red-500">Bạn không có quyền chỉnh sửa.</div>;
            default: return null;
        }
    }

    return (
        <div>
            <div className="px-6 pt-4 pb-2 border-b flex items-center justify-between bg-white">
                <div className="flex items-center space-x-2">
                    <SubTabButton value="list">Danh sách máy bay</SubTabButton>
                    {/* 👇 Ẩn nút tab Tạo mới nếu không có quyền */}
                    {canManage && <SubTabButton value="create">Tạo máy bay mới</SubTabButton>}
                    {subTab === 'edit' && (<span className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow animate-fade-in">Chi tiết máy bay</span>)}
                </div>
            </div>
            <div className="bg-gray-50 min-h-[500px]">{renderContent()}</div>
            {airplaneToDelete && <ConfirmationModal message="Bạn có chắc muốn xóa máy bay này? Dữ liệu không thể phục hồi." onConfirm={confirmDelete} onCancel={cancelDelete}/>}
        </div>
    );
};

export default AirplanesTab;