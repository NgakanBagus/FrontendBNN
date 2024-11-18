import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TodayIcon from '@mui/icons-material/Today';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../Images/logo_url.png';
import dayjs from 'dayjs';

function LaporanKegiatan() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(''); 

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/jadwal`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data) && data.data.length > 0) {
                    const lastMonth = dayjs().subtract(1, 'month').startOf('day'); 
                
                const filteredReports = data.data.filter(report => {
                    return dayjs(report.tanggal_mulai).isAfter(lastMonth);
                });

                if (filteredReports.length > 0) {
                    setReports(filteredReports);
                } else {
                    console.log('No records found in the filtered data');
                    setError('Tidak ada data jadwal yang ditemukan untuk satu bulan terakhir.');
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
        const username = localStorage.getItem('username');
        setLoggedInUser(username || 'User');
    }, []);

    const handleDownload = async (type, month) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/laporan/download/${type}?month=${month}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report.${type === 'csv' ? 'csv' : type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Gagal mengunduh laporan. Silakan coba lagi.');
        }
    };

    return (
        <div className="flex">
            <div className="w-1/5 bg-gray-100 p-4 h-screen flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-16" />
                    </div>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/user" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <TodayIcon />
                                <span className="ml-3">Jadwal</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/laporan-kegiatan" className="flex items-center p-2 bg-gray-200 rounded-lg">
                                <AssignmentIcon />
                                <span className="ml-3">Laporan Kegiatan</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="mb-4 text-center">Akun: <strong>{loggedInUser}</strong></p>
                    <Link to="/login" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </Link>
                </div>
            </div>

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

export default LaporanKegiatan;
