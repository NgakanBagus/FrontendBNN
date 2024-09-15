import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TodayIcon from '@mui/icons-material/Today';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import logo from '../Images/logo_url.png';
import LogoutIcon from '@mui/icons-material/Logout';
import dayjs from 'dayjs';

function ActivityReport() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [loggedInAdmin, setLoggedInAdmin] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/jadwal`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                if (Array.isArray(data.data) && data.data.length > 0) {
                    const lastWeek = dayjs().subtract(7, 'day').startOf('day');
                    
                    // Filter jadwal untuk satu minggu terakhir
                    const filteredReports = data.data.filter(report => {
                        return dayjs(report.tanggal_mulai).isAfter(lastWeek);
                    });
    
                    if (filteredReports.length > 0) {
                        setReports(filteredReports);
                    } else {
                        console.log('No records found in the filtered data');
                        setError('Tidak ada data jadwal yang ditemukan untuk satu minggu terakhir.');
                    }
                } else {
                    console.log('No records found in the fetched data');
                    setError('Tidak ada data jadwal yang ditemukan.');
                }
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
                setError('Terjadi kesalahan saat mengambil laporan.');
            });

            const admin = localStorage.getItem('admin');
            setLoggedInAdmin(admin || 'Admin');
    }, []);
    
    const handleDownload = async (type, month) => {
        const validMonth = dayjs(month, 'YYYY-MM', true).isValid() ? month : dayjs().format('YYYY-MM');
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/laporan/download/${type}?month=${validMonth}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report.${type === 'csv' ? 'csv' : type}`); // name based on type
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again.');
        }
    };    
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-1/5 bg-gray-100 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-16" />
                    </div>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <TodayIcon />
                                <span className="ml-3">Jadwal</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/add-schedule" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <AddBoxIcon />
                                <span className="ml-3">Tambah Jadwal</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/revise-schedule" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <EditIcon />
                                <span className="ml-3">Revisi Jadwal</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reports" className="flex items-center p-2 bg-gray-200 rounded-lg">
                                <AssignmentIcon />
                                <span className="ml-3">Laporan Kegiatan</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="mb-4 text-center">Akun: <strong>{loggedInAdmin}</strong></p>
                    <Link to="/login" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-4/5 container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Laporan Kegiatan</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                    <button
                            onClick={() => handleDownload('pdf', dayjs().format('YYYY-MM'))}
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
                        >
                            Unduh PDF Bulan Ini
                        </button>
                        <button
                            onClick={() => handleDownload('csv', dayjs().format('YYYY-MM'))}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Unduh CSV Bulan Ini
                    </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-3 px-4 border-b">Nama Kegiatan</th>
                                    <th className="py-3 px-4 border-b">Tanggal Mulai</th>
                                    <th className="py-3 px-4 border-b">Tanggal Selesai</th>
                                    <th className="py-3 px-4 border-b">Jam Mulai</th>
                                    <th className="py-3 px-4 border-b">Jam Selesai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length > 0 ? (
                                    reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-100">
                                            <td className="py-3 px-4 border-b">{report.nama_kegiatan}</td>
                                            <td className="py-3 px-4 border-b">{report.tanggal_mulai}</td>
                                            <td className="py-3 px-4 border-b">{report.tanggal_selesai}</td>
                                            <td className="py-3 px-4 border-b">{report.jam_mulai}</td>
                                            <td className="py-3 px-4 border-b">{report.jam_selesai}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-3 px-4 border-b text-center">
                                            Tidak ada data jadwal yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityReport;
