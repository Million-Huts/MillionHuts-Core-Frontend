import { NavLink } from "react-router-dom";

const links = [
    { label: "Basic Details", path: "basic" },
    { label: "Property Details", path: "details" },
    { label: "Images", path: "images" },
    { label: "Rules", path: "rules" },
    { label: "Amenities", path: "amenities" },
];

export default function PGSidebar({ pgId }: { pgId: string }) {
    return (
        <div className="p-4 space-y-1">
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={`/pgs/${pgId}/${link.path}`}
                    className={({ isActive }) =>
                        `block rounded-md px-3 py-2 text-sm ${isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                    }
                >
                    {link.label}
                </NavLink>
            ))}
        </div>
    );
}
