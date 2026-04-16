import {
    Building,
    Users,
    Receipt,
    PieChart,
    MessageSquare,
    Bell,
    ShieldCheck,
    CheckCircle2,
    ShieldAlert,
    FileText,
    LayoutDashboard,
    Zap,
    TrendingUp
} from "lucide-react";

export const FEATURE_LABELS: Record<string, { label: string; icon: any }> = {
    // Limits
    maxPGs: { label: "Properties", icon: Building },
    maxUsers: { label: "Admin Users", icon: Users },

    // Modules
    expense: { label: "Expense Management", icon: PieChart },
    complaints: { label: "Tenant Helpdesk", icon: MessageSquare },
    announcements: { label: "Broadcasting", icon: Bell },
    gateSecurity: { label: "Gate Control", icon: ShieldCheck },
    entryLogs: { label: "Visitor Logs", icon: ShieldAlert },

    // Financial
    tenantPayments: { label: "Online Rent Collection", icon: Zap },
    digitalBilling: { label: "Auto Invoicing", icon: Receipt },
    reports: { label: "Financial Records", icon: FileText },

    // Analytics
    dashboard: { label: "Admin Dashboard", icon: LayoutDashboard },
    advancedReports: { label: "Growth Analytics", icon: TrendingUp },

    // Support
    priority: { label: "Priority Support", icon: CheckCircle2 },
};

/**
 * Formats a raw feature key and value into a human-readable UI object
 */
export const formatFeatureUI = (key: string, value: any) => {
    const config = FEATURE_LABELS[key] || {
        label: key.replace(/([A-Z])/g, ' $1').trim(), // Fallback: camelCase to Title Case
        icon: CheckCircle2
    };

    // 1. Handle Booleans (Enabled/Disabled)
    if (typeof value === "boolean") {
        return {
            label: config.label,
            icon: config.icon,
            status: value ? "Included" : "Not Included",
            active: value
        };
    }

    // 2. Handle Numbers (Limits)
    if (typeof value === "number") {
        let displayStatus = "";

        if (value === 0) displayStatus = "Unlimited";
        else if (value === 1) displayStatus = "Single Access";
        else displayStatus = `Up to ${value}`;

        return {
            label: config.label,
            icon: config.icon,
            status: displayStatus,
            active: value > 0
        };
    }

    // 3. Fallback for strings or unknown types
    return {
        label: config.label,
        icon: config.icon,
        status: String(value),
        active: true
    };
};