import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/common/AppSidebar";
import TopNavbar from "./common/TopNavbar";
import { useState } from "react";

const ProtectedLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            <AppSidebar mobileOpen={mobileOpen} setMobileOpen={(val: boolean) => setMobileOpen(val)} />

            <main className="flex-1 bg-gray-50 p-4">
                <TopNavbar mobileOpen={mobileOpen} setMobileOpen={(val: boolean) => setMobileOpen(val)} />
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
