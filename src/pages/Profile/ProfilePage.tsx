import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ChangePassword from "@/components/profile/ChangePassword";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
    const [openEdit, setOpenEdit] = useState(false);

    return (
        <div className="space-y-6">
            <ProfileHeader />

            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-12 gap-6">
                    {/* LEFT */}
                    <div className="col-span-12 md:col-span-3">
                        <ProfileSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-12 md:col-span-9">
                        {activeTab === "profile" && (
                            <ProfileDetails onEdit={() => setOpenEdit(true)} />
                        )}
                        {activeTab === "password" && <ChangePassword />}
                    </div>
                </div>
            </div>

            <EditProfileModal open={openEdit} onClose={() => setOpenEdit(false)} />
        </div>
    );
}
