import EditProfileModal from '@/components/profile/EditProfileModal';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileHeader from '@/components/profile/ProfileHeader';
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function Account() {
    const [profileEdit, setProfileEdit] = useState(false);
    return (
        <div className="w-full pb-20">
            <ProfileHeader />

            <div className="mx-auto max-w-3xl px-4 relative z-10 space-y-8">
                {/* 1. Account Identity */}
                <SectionWrapper delay={0}>
                    <EditProfileModal open={profileEdit} onClose={() => setProfileEdit(false)} />
                    {!profileEdit && (
                        <ProfileDetails onEdit={() => setProfileEdit(true)} />
                    )}
                </SectionWrapper>

                <SectionWrapper delay={0.3}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-destructive">Danger Zone</h3>
                            <p className="text-[11px] font-medium text-muted-foreground mt-1">Permanently purge your account and all associated data from the registry.</p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="h-12 rounded-sm font-black uppercase tracking-widest text-[10px] gap-2">
                                    <Trash2 size={14} /> Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-sm border-border max-h-[90vh] overflow-y-scroll">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3 text-lg font-black tracking-tighter">
                                        <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                                            <AlertTriangle size={20} />
                                        </div>
                                        Absolute Termination?
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-medium mt-2">
                                        This action is irreversible. All property management data, tickets, and user access will be deleted permanently.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6 gap-2">
                                    <Button variant="outline" className="rounded-sm font-bold">Cancel</Button>
                                    <Button variant="destructive" className="rounded-sm font-black uppercase tracking-widest text-[10px]">Confirm Deletion</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </SectionWrapper>
            </div>
        </div>
    )
}

function SectionWrapper({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-card border border-border shadow-sm rounded-sm p-8"
        >
            {children}
        </motion.div>
    );
}