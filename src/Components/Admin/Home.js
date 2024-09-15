import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import TodayIcon from '@mui/icons-material/Today';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';  
import logo from '../Images/logo_url.png';

function AdminDashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcementDate, setAnnouncementDate] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loggedInAdmin, setLoggedInAdmin] = useState('');
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFC133', '#33FFF1'];

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/jadwal`)
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    setSchedules(data.data);
                } else {
                    console.error('Unexpected data structure:', data);
                }
            })
            .catch(error => console.error('Error fetching schedules:', error));
        
        fetch(`${process.env.REACT_APP_API_URL}/api/pengumuman`)
            .then(response => response.json())
            .then(data => setAnnouncements(data))
            .catch(error => console.error('Error fetching announcements:', error));

        const admin = localStorage.getItem('admin');
        setLoggedInAdmin(admin || 'Admin');
    }, []);

    const handleAddAnnouncement = async () => {
        if (newAnnouncement.trim() !== '' && announcementDate.trim() !== '') {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pengumuman`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tanggal_pengumuman: announcementDate,
                        deskripsi_pengumuman: newAnnouncement,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setAnnouncements([
                        ...announcements,
                        {
                            id: data.id,
                            tanggal_pengumuman: announcementDate,
                            deskripsi_pengumuman: newAnnouncement,
                        },
                    ]);
                    setNewAnnouncement('');
                    setAnnouncementDate('');
                    setSuccessMessage('Pengumuman berhasil ditambahkan!');
                    setError('');

                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Pengumuman berhasil ditambahkan!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                setError('Terjadi kesalahan saat menambahkan pengumuman.');
                

                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat menambahkan pengumuman.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            setError('Tanggal dan Deskripsi Pengumuman wajib diisi.');
            

            Swal.fire({
                title: 'Peringatan!',
                text: 'Tanggal dan Deskripsi Pengumuman wajib diisi.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Pengumuman ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pengumuman/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }

                    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
                    setSuccessMessage('Pengumuman berhasil dihapus!');
                    setError('');

                    
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Pengumuman berhasil dihapus!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } catch (error) {
                    setError('Terjadi kesalahan saat menghapus pengumuman.');
                    
                    
                    Swal.fire({
                        title: 'Error!',
                        text: 'Terjadi kesalahan saat menghapus pengumuman.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
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
                    <Link to="/login" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-4/5 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

                {/* Agenda Kegiatan */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-semibold mb-2">Agenda Kegiatan</h2>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">No</th>
                                <th className="px-4 py-2">Nama Kegiatan</th>
                                <th className="px-4 py-2">Tanggal Mulai</th>
                                <th className="px-4 py-2">Tanggal Selesai</th>
                                <th className="px-4 py-2">Jam Mulai</th>
                                <th className="px-4 py-2">Jam Selesai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index) => (
                                <tr key={schedule.id_jadwal} className="border-t">
                                    <td className="px-4 py-2 text-center">{index + 1}</td>
                                    <td className="px-4 py-2">{schedule.nama_kegiatan}</td>
                                    <td className="px-4 py-2">{schedule.tanggal_mulai}</td>
                                    <td className="px-4 py-2">{schedule.tanggal_selesai}</td>
                                    <td className="px-4 py-2">{schedule.jam_mulai}</td>
                                    <td className="px-4 py-2">{schedule.jam_selesai}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Kalender and Pengumuman */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Kalender Kegiatan</h2>
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            height="350px"  // Reduce the height of the calendar
                            events={schedules.map((schedule, index) => ({
                                title: schedule.nama_kegiatan,
                                start: schedule.tanggal_mulai,
                                end: schedule.tanggal_selesai,
                                color: colors[index % colors.length],  // Assign color from array
                            }))}
                        />
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Pengumuman</h2>
                <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div 
                                key={announcement.id} 
                                className="p-4 bg-blue-100 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 duration-300">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{announcement.tanggal_pengumuman}</p>
                                        <p className="text-md text-gray-800 font-semibold">{announcement.deskripsi_pengumuman}</p>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-all"
                                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                        <div className="mt-2">
                            <h3 className="text-md font-semibold mb-1">Tambah Pengumuman</h3>
                            <input
                                type="date"
                                value={announcementDate}
                                onChange={(e) => setAnnouncementDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-2 py-1 mb-1 w-full"
                            />
                            <textarea
                                value={newAnnouncement}
                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                className="border border-gray-300 rounded-lg px-2 py-1 mb-1 w-full"
                                rows="2"
                                placeholder="Deskripsi Pengumuman"
                            ></textarea>
                            <button
                                onClick={handleAddAnnouncement}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
                            >
                                Tambah Pengumuman
                            </button>
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            {successMessage && <p className="text-green-500 text-sm mt-1">{successMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
