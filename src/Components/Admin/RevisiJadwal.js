import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TodayIcon from '@mui/icons-material/Today';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../Images/logo_url.png';
import LogoutIcon from '@mui/icons-material/Logout';

function ReviseSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loggedInAdmin, setLoggedInAdmin] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/jadwal')
            .then(response => response.json())
            .then(data => setSchedules(data.data))
            .catch(error => {
                console.error('Error fetching schedules:', error);
                setError('Terjadi kesalahan saat mengambil jadwal.');
            });

        const admin = localStorage.getItem('admin');
        setLoggedInAdmin(admin || 'Admin');
    }, []);

    const handleDelete = (id_jadwal) => {
        fetch(`http://localhost:5000/api/jadwal/${id_jadwal}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setSchedules(schedules.filter(schedule => schedule.id_jadwal !== id_jadwal));
            } else {
                throw new Error('Failed to delete schedule');
            }
        })
        .catch(error => {
            console.error('Error deleting schedule:', error);
            setError('Terjadi kesalahan saat menghapus jadwal.');
        });
    };

    const handleEdit = (id_jadwal) => {
        navigate(`/admin/edit-schedule/${id_jadwal}`);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-100 p-4 h-screen flex flex-col justify-between">
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
                            <Link to="/admin/reports" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
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
            <div className="w-4/5 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Revisi Jadwal</h1>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <ul>
                        {schedules.map((schedule) => (
                            <li key={schedule.id_jadwal} className="flex items-center justify-between mb-4 p-2 border border-gray-300 rounded">
                                <div>
                                    <p><strong>{schedule.nama_kegiatan}</strong></p>
                                    <p>{schedule.tanggal_mulai} - {schedule.tanggal_selesai} {schedule.jam}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(schedule.id_jadwal)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(schedule.id_jadwal)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ReviseSchedule;
