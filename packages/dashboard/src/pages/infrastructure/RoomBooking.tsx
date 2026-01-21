import { Calendar, Clock, MapPin, User } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'

const rooms = [
    { id: '1', name: 'Aula Utama', type: 'Aula', capacity: 500, status: 'available' },
    { id: '2', name: 'Lab Komputer 1', type: 'Laboratorium', capacity: 40, status: 'booked' },
    { id: '3', name: 'Lab Komputer 2', type: 'Laboratorium', capacity: 40, status: 'available' },
    { id: '4', name: 'Ruang Rapat', type: 'Meeting', capacity: 20, status: 'booked' },
    { id: '5', name: 'Lab Fisika', type: 'Laboratorium', capacity: 35, status: 'available' },
    { id: '6', name: 'Lab Kimia', type: 'Laboratorium', capacity: 35, status: 'maintenance' },
    { id: '7', name: 'Perpustakaan', type: 'Fasilitas', capacity: 100, status: 'available' },
    { id: '8', name: 'Lapangan Indoor', type: 'Olahraga', capacity: 200, status: 'available' },
]

const bookings = [
    { id: '1', room: 'Lab Komputer 1', bookedBy: 'Pak Budi', purpose: 'Praktikum TIK Kelas 10', date: '2024-01-15', time: '08:00 - 10:00' },
    { id: '2', room: 'Ruang Rapat', bookedBy: 'Bu Siti', purpose: 'Rapat Kurikulum', date: '2024-01-15', time: '10:00 - 12:00' },
    { id: '3', room: 'Aula Utama', bookedBy: 'Admin', purpose: 'Upacara Bendera', date: '2024-01-22', time: '07:00 - 08:00' },
]

export default function RoomBooking() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Booking Ruangan"
                subtitle="Kelola pemesanan ruangan"
                breadcrumb={[
                    { label: 'Infrastruktur', path: '/infrastructure' },
                    { label: 'Booking Ruang' },
                ]}
                actions={
                    <button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        + Booking Baru
                    </button>
                }
            />

            <FilterBar
                searchPlaceholder="Cari ruangan..."
                filters={[
                    {
                        label: 'Tipe Ruangan',
                        options: [
                            { label: 'Laboratorium', value: 'Laboratorium' },
                            { label: 'Aula', value: 'Aula' },
                            { label: 'Meeting', value: 'Meeting' },
                        ],
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Tersedia', value: 'available' },
                            { label: 'Terbooking', value: 'booked' },
                            { label: 'Maintenance', value: 'maintenance' },
                        ],
                    },
                ]}
            />

            {/* Room Grid */}
            <div>
                <h3 className="font-semibold text-text-main dark:text-white mb-4">Daftar Ruangan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin size={20} />
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${room.status === 'available'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : room.status === 'booked'
                                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}
                                >
                                    {room.status === 'available' ? 'Tersedia' : room.status === 'booked' ? 'Terpakai' : 'Maintenance'}
                                </span>
                            </div>
                            <h4 className="font-semibold text-text-main dark:text-white mb-1">{room.name}</h4>
                            <p className="text-sm text-text-secondary mb-2">{room.type}</p>
                            <p className="text-xs text-text-secondary">Kapasitas: {room.capacity} orang</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700">
                <div className="p-4 border-b border-border-color dark:border-gray-700">
                    <h3 className="font-semibold text-text-main dark:text-white">Booking Mendatang</h3>
                </div>
                <div className="divide-y divide-border-color dark:divide-gray-700">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">{booking.purpose}</p>
                                    <p className="text-sm text-text-secondary">{booking.room}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-text-main dark:text-white flex items-center gap-1 justify-end">
                                    <Calendar size={14} /> {booking.date}
                                </p>
                                <p className="text-sm text-text-secondary flex items-center gap-1 justify-end">
                                    <Clock size={14} /> {booking.time}
                                </p>
                                <p className="text-xs text-text-secondary flex items-center gap-1 justify-end mt-1">
                                    <User size={12} /> {booking.bookedBy}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
