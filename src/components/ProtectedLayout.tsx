import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/common/AppSidebar";
import TopNavbar from "@/components/common/TopNavbar";
import { useState } from "react";

const ProtectedLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            <AppSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="flex-1 bg-gray-50 p-4">
                <TopNavbar
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
