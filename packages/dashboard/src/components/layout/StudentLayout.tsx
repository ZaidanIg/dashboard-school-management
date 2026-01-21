import { Outlet } from 'react-router-dom'
import StudentNavbar from './StudentNavbar'

export default function StudentLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-display antialiased">
            <StudentNavbar />
            <main className="md:pt-20 pb-24 md:pb-8 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}
