import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; 
import { BuildingIcon, TicketIcon, DollarSignIcon } from "../../components/common/Icons";

const API_URL = "http://localhost:3000/reports"; 

const DonutChart = ({ data }) => {
    const size = 180; const strokeWidth = 25; const radius = (size - strokeWidth) / 2; const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;
    return ( <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e6e6e6" strokeWidth={strokeWidth}></circle> {data.map((item, index) => { const percent = item.value / 100 * circumference; const offset = circumference - percent; const rotation = accumulatedPercent * 3.6; accumulatedPercent += item.value; return ( <circle key={index} cx={size/2} cy={size/2} r={radius} fill="none" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={`${percent} ${offset}`} strokeDashoffset={0} transform={`rotate(${rotation - 90} ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 0.3s ease' }} /> ) })} </svg> )
}

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ReportsTab = () => {
    const [reportType, setReportType] = useState('month');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- GỌI API ---
    const fetchReport = async () => {
        setLoading(true);
        try {
            let url = '';
            let params = {};
            
            if (reportType === 'month') {
                url = `${API_URL}/monthly`;
                params = { month: selectedMonth };
            } else {
                url = `${API_URL}/yearly`;
                params = { year: selectedYear };
            }

            const res = await axios.get(url, { params });
            setData(res.data);
        } catch (error) {
            console.error("Lỗi tải báo cáo:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [reportType, selectedMonth, selectedYear]);

    // --- HANDLE ĐỔI LOẠI BÁO CÁO (FIX LỖI CRASH Ở ĐÂY) ---
    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setData(null); // 👇 QUAN TRỌNG: Xóa dữ liệu cũ ngay lập tức để tránh xung đột
    };

    // --- XUẤT EXCEL ---
    const handleExportExcel = async () => {
        if (!data || !data.details) return;

        // 1. Khởi tạo Workbook và Worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Báo cáo doanh thu');

        // 2. Định nghĩa cột (Columns)
        if (reportType === 'month') {
            worksheet.columns = [
                { header: 'STT', key: 'stt', width: 10 },
                { header: 'Tên chuyến bay', key: 'name', width: 50 }, // Cột này rộng ra để chứa tên
                { header: 'Số vé bán', key: 'ticketCount', width: 15 },
                { header: 'Doanh thu', key: 'revenue', width: 25 },
                { header: 'Tỷ lệ (%)', key: 'ratio', width: 15 },
            ];
        } else {
            worksheet.columns = [
                { header: 'STT', key: 'stt', width: 10 },
                { header: 'Tháng', key: 'month', width: 15 },
                { header: 'Số chuyến bay', key: 'flightCount', width: 20 },
                { header: 'Doanh thu', key: 'revenue', width: 25 },
                { header: 'Tỷ lệ (%)', key: 'ratio', width: 15 },
            ];
        }

        // 3. Thêm Tiêu đề lớn ở dòng 1
        const titleText = reportType === 'month' 
            ? `BÁO CÁO DOANH THU THÁNG ${selectedMonth}` 
            : `BÁO CÁO DOANH THU NĂM ${selectedYear}`;
        
        // Merge dòng 1 từ cột A đến E
        worksheet.mergeCells('A1:E1');
        const titleRow = worksheet.getCell('A1');
        titleRow.value = titleText;
        titleRow.font = { name: 'Arial', family: 4, size: 16, bold: true, color: { argb: 'FF1E40AF' } }; // Màu xanh đậm
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
        
        // Thêm dòng trống
        worksheet.addRow([]); 

        // 4. Định dạng Header bảng (Dòng 3 - Vì dòng 1 là title, dòng 2 trống)
        // Lưu ý: Do ta đã define columns ở bước 2, header tự động nằm ở dòng tiếp theo sau khi ta addRow
        // Nhưng để dễ quản lý style, ta sẽ lấy dòng header ra
        const headerRow = worksheet.getRow(3);
        headerRow.values = reportType === 'month' 
            ? ['STT', 'Tên chuyến bay', 'Số vé bán', 'Doanh thu', 'Tỷ lệ (%)'] 
            : ['STT', 'Tháng', 'Số chuyến bay', 'Doanh thu', 'Tỷ lệ (%)'];

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Chữ trắng
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2563EB' } // Nền xanh dương (Blue-600)
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
            };
        });

        // 5. Thêm dữ liệu (Data Rows)
        let totalRevenue = 0;
        let totalCount = 0; // Vé hoặc Chuyến bay

        data.details.forEach((item, index) => {
            const rowData = reportType === 'month' ? {
                stt: index + 1,
                name: item.name,
                ticketCount: item.ticketCount,
                revenue: Number(item.revenue),
                ratio: `${item.ratio}%`
            } : {
                stt: index + 1,
                month: `Tháng ${item.month}`,
                flightCount: item.flightCount,
                revenue: Number(item.revenue),
                ratio: `${item.ratio}%`
            };

            const row = worksheet.addRow(rowData);
            
            // Format từng ô trong dòng
            row.eachCell((cell, colNumber) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                
                // Căn giữa STT và các chỉ số số lượng
                if (colNumber !== 2 && colNumber !== 4) { // Trừ tên và doanh thu
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
                
                // Format cột Doanh thu (Cột 4)
                if (colNumber === 4) {
                    cell.numFmt = '#,##0 "₫"'; // Format Excel: 10,000 ₫
                    cell.alignment = { vertical: 'middle', horizontal: 'right' };
                }
            });

            // Cộng tổng
            totalRevenue += Number(item.revenue);
            totalCount += reportType === 'month' ? item.ticketCount : item.flightCount;
        });

        // 6. Thêm dòng Tổng cộng (Footer)
        const footerRow = worksheet.addRow([
            '', 
            'TỔNG CỘNG', 
            totalCount, 
            totalRevenue, 
            '100%'
        ]);
        
        footerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, color: { argb: 'FFDC2626' } }; // Chữ đỏ đậm
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }; // Nền đỏ nhạt
            cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
            
            if (colNumber === 4) {
                cell.numFmt = '#,##0 "₫"';
                cell.alignment = { horizontal: 'right' };
            }
            if (colNumber === 3 || colNumber === 5) {
                cell.alignment = { horizontal: 'center' };
            }
        });

        // 7. Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `BaoCao_${reportType}_${selectedMonth || selectedYear}.xlsx`);
    };

    // --- RENDER GIAO DIỆN ---
    if (!data && !loading) return <div className="p-10 text-center">Không có dữ liệu (Vui lòng chọn thời gian khác)</div>;

    const chartColors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    
    // 👇 SỬA LỖI LOGIC TÍNH CHART DATA (Thêm kiểm tra an toàn)
    const chartData = reportType === 'year' && data?.details 
        ? data.details.map((d, i) => ({
            // Thêm d.month ? ... : '' để tránh lỗi undefined.toString()
            label: d.month ? d.month.toString() : 'N/A', 
            value: parseFloat(d.ratio),
            color: chartColors[i % chartColors.length]
        })) 
        : [];

    return (
        <div className="animate-fade-in">
            {/* Filter Bar */}
            <div className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* 👇 SỬA SỰ KIỆN ONCHANGE */}
                    <select onChange={handleReportTypeChange} value={reportType} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700">
                        <option value="month">Báo cáo theo tháng</option>
                        <option value="year">Báo cáo theo năm</option>
                    </select>
                    
                    {reportType === 'month' ? (
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    ) : (
                        <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    )}
                </div>
                <button onClick={handleExportExcel} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Xuất Excel
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="p-20 text-center text-gray-500">Đang tính toán số liệu...</div>
            ) : (
                data && (
                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4 border-l-4 border-blue-500">
                            <div className="p-3 bg-blue-100 rounded-full"><BuildingIcon className="w-6 h-6 text-blue-600"/></div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng chuyến bay</p>
                                <p className="text-2xl font-bold text-gray-800">{data.summary?.totalFlights || 0}</p>
                            </div>
                        </div>
                        {reportType === 'month' && (
                            <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4 border-l-4 border-green-500">
                                <div className="p-3 bg-green-100 rounded-full"><TicketIcon className="w-6 h-6 text-green-600"/></div>
                                <div>
                                    <p className="text-sm text-gray-500">Tổng vé bán ra</p>
                                    <p className="text-2xl font-bold text-gray-800">{data.summary?.totalTickets || 0}</p>
                                </div>
                            </div>
                        )}
                        <div className={`p-4 bg-white rounded-lg shadow flex items-center gap-4 border-l-4 border-yellow-500 ${reportType === 'year' ? 'md:col-span-2' : ''}`}>
                            <div className="p-3 bg-yellow-100 rounded-full"><DollarSignIcon className="w-6 h-6 text-yellow-600"/></div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(data.summary?.totalRevenue || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table & Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Table */}
                        <div className={`${reportType === 'year' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-600 rounded"></span>
                                Danh sách chi tiết
                            </h3>
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 font-semibold text-gray-600 text-sm">STT</th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm">{reportType === 'month' ? 'Chuyến bay' : 'Tháng'}</th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm text-center">{reportType === 'month' ? 'Số vé' : 'Số chuyến'}</th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm text-right">Doanh thu</th>
                                            <th className="p-3 font-semibold text-gray-600 text-sm text-center">Tỷ lệ (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.details && data.details.length > 0 ? data.details.map((row, index) => (
                                            <tr key={index} className="hover:bg-blue-50 transition">
                                                <td className="p-3 text-gray-500">{index + 1}</td>
                                                <td className="p-3 font-medium text-gray-800">
                                                    {reportType === 'month' ? row.name : `Tháng ${row.month}`}
                                                </td>
                                                <td className="p-3 text-center">{reportType === 'month' ? row.ticketCount : row.flightCount}</td>
                                                <td className="p-3 text-right font-bold text-blue-600">{formatCurrency(row.revenue)}</td>
                                                <td className="p-3 text-center">
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{row.ratio}%</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="p-6 text-center text-gray-400">Không có dữ liệu trong thời gian này</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Chart (Chỉ hiện khi xem Năm) */}
                        {reportType === 'year' && (
                            <div className="bg-white rounded-lg shadow p-6 h-fit">
                                <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">Biểu đồ tỷ trọng doanh thu</h3>
                                {chartData.length > 0 ? (
                                    <>
                                        <div className="flex justify-center items-center py-4">
                                            <DonutChart data={chartData} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-6">
                                            {chartData.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                                                    <span>Tháng {item.label} ({item.value}%)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 py-10">Chưa có số liệu để vẽ biểu đồ</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                )
            )}
        </div>
    );
};

export default ReportsTab;