import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
    activeTab: "profile" | "password";
    setActiveTab: (tab: "profile" | "password") => void;
}

export default function ProfileSidebar({ activeTab, setActiveTab }: Props) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
            <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
            >
                Profile
            </Button>

            <Button
                variant={activeTab === "password" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("password")}
            >
                Password
            </Button>

            <Link
                to="/settings"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
                Settings
            </Link>
        </div>
    );
}
