import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import PGSidebar from "@/components/property/PGSidebar";

export default function PGLayout() {
    const { pgId } = useParams();
    const { pathname } = useLocation();
    const isMenuLevel = pathname === `/pgs/${pgId}`;
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className={`${isMenuLevel ? 'block w-full' : 'hidden'} md:block md:w-64 border-r bg-white`}>
                <PGSidebar pgId={pgId!} />
            </div>

            {/* Content */}
            <div className={`flex-1 md:block ${!isMenuLevel ? 'block' : 'hidden'}`}>
                {!isMenuLevel && (
                    <Link to={`/pgs/${pgId}`} className="md:hidden p-4 text-blue-600 block">
                        ← Back to Menu
                    </Link>
                )}
                <Outlet />
            </div>
        </div>

    );
}
