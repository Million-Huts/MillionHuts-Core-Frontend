import ChangePasswordFlow from '@/components/profile/ChangePasswordFlow';
import MFASection from '@/components/profile/MFASection';
import React from 'react'
import { motion } from 'framer-motion'

export default function Security() {
    return (
        <div className="w-full pb-20">
            <div className="mx-auto max-w-3xl px-4 relative z-10 space-y-8">
                {/* 2. Authentication Flow */}
                <SectionWrapper delay={0.1}>
                    <ChangePasswordFlow />
                </SectionWrapper>

                {/* 3. Multi-Factor Auth */}
                <SectionWrapper delay={0.2}>
                    <MFASection />
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