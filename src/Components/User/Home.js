import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import TodayIcon from '@mui/icons-material/Today';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../Images/logo_url.png';

function UserMenu() {
    const [announcements, setAnnouncements] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('');
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

        const username = localStorage.getItem('username');
        setLoggedInUser(username || 'User');
    }, []);

    return (
        <div className="flex">
            <div className="w-1/5 bg-gray-100 p-4 h-screen flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-16" />
                    </div>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/user/jadwal" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <TodayIcon />
                                <span className="ml-3">Jadwal</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/laporan-kegiatan" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
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

            <div className="w-4/5 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard User</h1>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Kalender Kegiatan</h2>
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            height="350px"
                            events={schedules.map((schedule, index) => ({
                                title: schedule.nama_kegiatan,
                                start: schedule.tanggal_mulai,
                                end: schedule.tanggal_selesai,
                                color: colors[index % colors.length],
                            }))}
                        />
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Pengumuman</h2>
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div 
                                    key={announcement.id} 
                                    className="p-4 bg-blue-100 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 duration-300">
                                    <div>
                                        <p className="text-sm text-gray-500">{announcement.tanggal_pengumuman}</p>
                                        <p className="text-md text-gray-800 font-semibold">{announcement.deskripsi_pengumuman}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserMenu;
