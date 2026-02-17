// components/Common/TopNavbar.tsx
import {
    Bell,
    Megaphone,
    Menu,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { matchPath, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

/* =====================================================
   Static Page Metadata
===================================================== */

const pageMeta: Record<string, { title: string; desc: string }> = {
    "/dashboard": {
        title: "Dashboard",
        desc: "Overview of your PG system",
    },
    "/pgs": {
        title: "Properties",
        desc: "Manage your properties",
    },
    "/rooms": {
        title: "Room Management",
        desc: "Manage rooms and occupancy",
    },
    "/tenants": {
        title: "Tenant Management",
        desc: "Manage tenant details and history",
    },
    "/settings": {
        title: "Settings",
        desc: "Manage your account",
    },
};

/* =====================================================
   Dynamic Route Metadata
===================================================== */

const dynamicPageMeta = [
    {
        pattern: "/pgs/:pgId",
        meta: {
            title: "Property",
            desc: "Manage property details",
        },
    },
    {
        pattern: "/pgs/:pgId/:tab",
        meta: {
            title: "Property",
            desc: "Manage property information",
        },
    },
    {
        pattern: "/rooms/:roomId",
        meta: {
            title: "Room Details",
            desc: "Manage room and tenants",
        },
    },
    {
        pattern: "/tenants/:tenantId",
        meta: {
            title: "Tenant Details",
            desc: "Detailed tenant information",
        },
    },
];

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const TopNavbar = ({ mobileOpen, setMobileOpen }: Props) => {
    const location = useLocation();

    /* =====================================================
       Resolve Page Meta
    ===================================================== */

    let meta = pageMeta[location.pathname];

    if (!meta) {
        for (const route of dynamicPageMeta) {
            const match = matchPath(
                { path: route.pattern, end: true },
                location.pathname
            );

            if (match) {
                meta = route.meta;
                break;
            }
        }
    }

    if (!meta) {
        meta = {
            title: "Page",
            desc: "Page not recognized",
        };
    }

    /* =====================================================
       Render
    ===================================================== */

    return (
        <div className="w-full border-b bg-background px-2 py-3 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-2">
                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                {/* Page Info */}
                <div>
                    <h1 className="text-xl font-semibold">
                        {meta.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {meta.desc}
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative p-2 hover:bg-muted rounded-full">
                            <Bell className="w-5 h-5" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            Notifications
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            No notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Announcements */}
                <button className="p-2 hover:bg-muted rounded-full">
                    <Megaphone className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TopNavbar;
