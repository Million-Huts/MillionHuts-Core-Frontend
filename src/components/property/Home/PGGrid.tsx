// components/property/Home/PGGrid.tsx
import { motion } from "framer-motion";
import PGCard from "@/components/property/Home/PGCard";
import type { PG } from "@/interfaces/pg";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function PGGrid({ pgs }: { pgs: PG[] }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {pgs.map((pg) => (
                <motion.div key={pg.id} variants={item}>
                    <PGCard pg={pg} />
                </motion.div>
            ))}
        </motion.div>
    );
}