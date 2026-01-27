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

const pageMeta: Record<string, { title: string; desc: string }> = {
    "/dashboard": {
        title: "Dashboard",
        desc: "Overview of your PG system",
    },
    '/dashboards': {
        title: "Multi-PG Dashboard",
        desc: "Switch between properties and view isolated data"
    },
    "/pgs": {
        title: "PGs",
        desc: "Manage your properties",
    },
    "/rooms": {
        title: "Room Management",
        desc: "Manage rooms and occupancy"
    },
    "/tenants": {
        title: "Tenant Management",
        desc: "Manage tenant details, documents, and payment history",
    },
    "/payments": {
        title: "Payment Dashboard",
        desc: "Rent tracking and payment management",
    },
    "/assets": {
        title: "Asset Management",
        desc: "Manage assets across all rooms and track their status"
    },
    "/expenses": {
        title: "Expense Management",
        desc: "Track and manage all PG expenses"
    },
    "/staff": {
        title: "Staff Management",
        desc: "Manage staff members, attendance and roles"
    },
    "/mess": {
        title: "Mess Management",
        desc: "Daily meal planning and complaint tracking"
    },
    "/reports": {
        title: "Reports & Analytics",
        desc: "Detailed insights and data export options"
    },
    "/notifications": {
        title: "Notifications",
        desc: "Manage rent reminders and tenant requests",
    },
    "/settings": {
        title: "Profile Settings",
        desc: "Manage your account and property information",
    },

};

const dynamicPageMeta: {
    pattern: string; // react-router pattern
    getMeta: () => { title: string; desc: string };
}[] = [
        {
            pattern: "/pgs/:pgId",
            getMeta: () => ({
                title: "Property Information",
                desc: `Manage property details`,
            }),
        },
        {
            pattern: "/pgs/:pgId/:options",
            getMeta: () => ({
                title: "Property Information",
                desc: `Manage property details`,
            }),
        },
        {
            pattern: "/room/:roomId",
            getMeta: () => ({
                title: "Room Details",
                desc: `Manage tenants and details for Room`,
            }),
        },
        {
            pattern: "/tenant/:tenantId",
            getMeta: () => ({
                title: "Tenant Details",
                desc: `Detailed info about tenant`,
            }),
        },
    ];

const TopNavbar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (val: boolean) => void; }) => {
    const location = useLocation();

    // check static first
    let meta = pageMeta[location.pathname];

    // if not static, check dynamic
    if (!meta) {
        for (const dyn of dynamicPageMeta) {
            const match = matchPath({ path: dyn.pattern, end: true }, location.pathname);
            if (match) {
                meta = dyn.getMeta();
                break;
            }
        }
    }

    // fallback if still nothing
    if (!meta) {
        meta = { title: "Page", desc: "Page not recognized" };
    }

    return (
        <div className="w-full border-b bg-background px-2 py-3 flex items-center justify-between">
            {/* Left: Page Info */}
            <div className="flex flex-row items-center gap-2">
                <div className={`md:hidden block top-4 transition-all duration-200 ${mobileOpen ? "left-50" : "left-4"}`}>
                    <Button size="icon" variant="outline" onClick={() => setMobileOpen(!mobileOpen)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
                <div>
                    <h1 className="text-xl font-semibold">{meta.title}</h1>
                    <p className="text-sm text-muted-foreground">{meta.desc}</p>
                </div>
            </div>

            {/* Right: Icons and Profile */}
            <div className="flex items-center gap-4">
                {/* Notification */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative p-2 hover:bg-muted rounded-full">
                            <Bell className="w-5 h-5" />
                            {/* Optional badge */}
                            {/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /> */}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>No notifications</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Announcement */}
                <button className="p-2 hover:bg-muted rounded-full">
                    <Megaphone className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TopNavbar;
