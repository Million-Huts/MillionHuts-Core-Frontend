import type { Tenant } from "@/interfaces/tenant";
import { formatDate } from "@/lib/utils";
import { Calendar, Mail, Phone, User } from "lucide-react";

export default function BasicInfo({ tenant }: { tenant: Tenant }) {
    if (!tenant) return null;

    const infoRow = (label: string, value?: string | null, icon?: React.ReactNode) => (
        <div className="my-2 border-b border-zinc-400 p-1 flex items-center justify-between gap-2">
            <span className="font-semibold flex items-center gap-2">
                {icon} {label}
            </span>
            <p className="text-right">{value || "-"}</p>
        </div>
    );

    return (
        <div className="flex-1 w-full flex flex-col items-center gap-2 p-4 mt-2 md:border-r">
            <h2 className="text-2xl font-semibold mb-6">Tenant Profile</h2>

            <div className="mb-4">
                <img
                    src={tenant.profileImage || "/avatar-placeholder.png"}
                    alt="Profile"
                    className="rounded-full md:w-64 md:h-64 w-48 h-48 object-cover bg-gray-200"
                />
            </div>

            <div className="max-w-sm w-full md:px-8 px-4 py-4 rounded-xl shadow-md bg-slate-200">
                {infoRow("Name", tenant.fullName, <User size={18} />)}
                {infoRow("Email", tenant.email, <Mail size={18} />)}
                {infoRow("Phone", tenant.phone, <Phone size={18} />)}
                {infoRow(
                    "Date of Birth",
                    tenant.dateOfBirth ? formatDate(tenant.dateOfBirth) : undefined,
                    <Calendar size={18} />
                )}
                {infoRow("Gender", tenant.gender)}
            </div>
        </div>
    );
}
