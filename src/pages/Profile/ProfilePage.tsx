import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ChangePassword from "@/components/profile/ChangePassword";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
    const [openEdit, setOpenEdit] = useState(false);

    return (
        <div className="min-h-screen">
            <ProfileHeader />

            {/* Main Content Grid - mt-12 prevents overlap with the header text */}
            <div className="mx-auto max-w-6xl px-4 mt-8 md:mt-12 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Sidebar: Above content on mobile, Left on desktop */}
                    <div className="col-span-12 md:col-span-3">
                        <ProfileSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    {/* Content Area */}
                    <div className="col-span-12 md:col-span-9 bg-card border rounded-3xl p-6 shadow-sm min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "profile" && (
                                    <ProfileDetails onEdit={() => setOpenEdit(true)} />
                                )}
                                {activeTab === "password" && (
                                    <ChangePassword />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <EditProfileModal open={openEdit} onClose={() => setOpenEdit(false)} />
        </div>
    );
}