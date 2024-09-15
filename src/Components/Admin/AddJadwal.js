import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import TodayIcon from '@mui/icons-material/Today';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import logo from '../Images/logo_url.png';
import LogoutIcon from '@mui/icons-material/Logout';

function AddSchedule() {
    const [loggedInAdmin, setLoggedInAdmin] = useState('');
    const [formData, setFormData] = useState({
        nama_kegiatan: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        jam_mulai: '',
        jam_selesai: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const admin = localStorage.getItem('admin');
        setLoggedInAdmin(admin || 'Admin');
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jadwal`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    Swal.fire(
                        'Berhasil!',
                        'Jadwal baru telah ditambahkan.',
                        'success'
                    );
                    navigate('/admin'); 
                } else {
                    Swal.fire(
                        'Gagal!',
                        'Tidak dapat menambahkan jadwal baru.',
                        'error'
                    );
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire(
                    'Error!',
                    'Terjadi kesalahan, coba lagi nanti.',
                    'error'
                );
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/login');
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
                    <button onClick={handleLogout} className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </div>

            <div className="w-4/5 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Tambah Jadwal Baru</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama Kegiatan</label>
                        <input
                            type="text"
                            name="nama_kegiatan"
                            value={formData.nama_kegiatan}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tanggal Mulai</label>
                        <input
                            type="date"
                            name="tanggal_mulai"
                            value={formData.tanggal_mulai}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tanggal Selesai</label>
                        <input
                            type="date"
                            name="tanggal_selesai"
                            value={formData.tanggal_selesai}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Jam Mulai</label>
                        <input
                            type="time"
                            name="jam_mulai"
                            value={formData.jam_mulai}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            required
                        />
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700">Jam Selesai</label>
                        <input
                            type="time"
                            name="jam_selesai"
                            value={formData.jam_selesai}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Tambah Jadwal</button>
                </form>
            </div>
        </div>
    );
}

export default AddSchedule;
