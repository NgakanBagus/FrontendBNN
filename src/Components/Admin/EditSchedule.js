import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import TodayIcon from '@mui/icons-material/Today';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../Images/logo_url.png';

function EditSchedule() {
    const { id_jadwal } = useParams();
    const [schedule, setSchedule] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/jadwal/${id_jadwal}`)
            .then(response => response.json())
            .then(data => setSchedule(data))
            .catch(error => {
                console.error('Error fetching schedule:', error);
                setError('Terjadi kesalahan saat mengambil jadwal.');
            });
    }, [id_jadwal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSchedule(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/api/jadwal/${id_jadwal}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(schedule),
        })
        .then(response => {
            if (response.ok) {
                Swal.fire(
                    'Berhasil!',
                    'Jadwal telah diperbarui.',
                    'success'
                );
                navigate('/admin/revise-schedule');
            } else {
                throw new Error('Failed to update schedule');
            }
        })
        .catch(error => {
            console.error('Error updating schedule:', error);
            setError('Terjadi kesalahan saat mengupdate jadwal.');
        });
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/admin/revise-schedule');  
            }
        });
    };

    if (!schedule) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar/Navbar */}
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
                    <p className="mb-4 text-center">Akun: <strong>Admin</strong></p>
                    <Link to="/login" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="w-4/5 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Jadwal</h1>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nama Kegiatan</label>
                        <input
                            type="text"
                            name="nama_kegiatan"
                            value={schedule.nama_kegiatan}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Mulai</label>
                        <input
                            type="date"
                            name="tanggal_mulai"
                            value={schedule.tanggal_mulai}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Selesai</label>
                        <input
                            type="date"
                            name="tanggal_selesai"
                            value={schedule.tanggal_selesai}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Jam</label>
                        <input
                            type="time"
                            name="jam"
                            value={schedule.jam}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Jadwal
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSchedule;
