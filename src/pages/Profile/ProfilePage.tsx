import { motion } from "framer-motion";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ChangePasswordFlow from "@/components/profile/ChangePasswordFlow";
import MFASection from "@/components/profile/MFASection";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
    const [profileEdit, setProfileEdit] = useState(false);
    return (
        <div className="min-h-screen bg-background pb-20">
            <ProfileHeader />

            <div className="mx-auto max-w-3xl px-4 -mt-8 relative z-10 space-y-6">
                {/* 1. Account Details */}
                <SectionWrapper delay={0}>
                    <EditProfileModal open={profileEdit} onClose={() => setProfileEdit(false)} />
                    {!profileEdit && (
                        <ProfileDetails onEdit={() => setProfileEdit(true)} />
                    )}
                </SectionWrapper>

                {/* 2. Security: Password Change (Step-based) */}
                <SectionWrapper delay={0.1}>
                    <ChangePasswordFlow />
                </SectionWrapper>

                {/* 3. Multi-Factor Authentication */}
                <SectionWrapper delay={0.2}>
                    <MFASection />
                </SectionWrapper>

                {/* 4. Danger Zone */}
                <SectionWrapper delay={0.3}>
                    <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-[2rem]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                                <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="rounded-full">Delete Account</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <AlertTriangle className="text-destructive" /> Are you absolutely sure?
                                        </DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button variant="destructive">Confirm Deletion</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </SectionWrapper>
            </div>
        </div>
    );
}

function SectionWrapper({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-card border border-border shadow-sm rounded-[2.5rem] overflow-hidden p-6 md:p-8"
        >
            {children}
        </motion.div>
    );
}