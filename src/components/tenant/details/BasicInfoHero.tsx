// components/tenant/details/BasicInfoHero.tsx
import { Mail, Phone, Calendar, MapPin, User, BadgeCheck, Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function BasicInfoHero({ tenant, stay }: any) {
    const isResident = stay?.status === "ACTIVE";

    return (
        <div className="relative overflow-hidden bg-card/40 backdrop-blur-xl rounded-sm p-8 border border-border/50 shadow-2xl flex flex-col lg:flex-row gap-10 items-start lg:items-center transition-all duration-500">
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Profile Section */}
            <div className="relative group">
                <Avatar className="h-40 w-40 border-[6px] border-background shadow-2xl ring-1 ring-border group-hover:ring-primary/30 transition-all duration-500">
                    <AvatarImage src={tenant.profileImage} className="object-cover" />
                    <AvatarFallback className="text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                        {tenant.fullName?.[0]}
                    </AvatarFallback>
                </Avatar>
                {isResident && (
                    <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg ring-4 ring-background animate-in zoom-in-50 duration-700">
                        <BadgeCheck size={20} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            {/* Information Grid */}
            <div className="flex-1 space-y-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-4xl font-black tracking-tighter text-foreground">
                                {tenant.fullName}
                            </h2>
                            <Badge
                                variant="secondary"
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${isResident
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}
                            >
                                {stay?.status || 'PENDING'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            <Hash size={14} className="text-primary/50" />
                            <span className="text-xs uppercase tracking-widest font-bold">Resident ID: {tenant.id?.slice(-8).toUpperCase()}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-4 border-t border-border/40">
                    <div className="flex items-center gap-4 group">
                        <div className="p-2.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <Mail size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold truncate max-w-[180px]">{tenant.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="p-2.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <Phone size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</p>
                            <p className="text-sm font-bold">{tenant.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="p-2.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <MapPin size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Room</p>
                            <p className="text-sm font-bold text-primary">
                                {stay?.room?.name ? `Room ${stay.room.name}` : 'Awaiting Assignment'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="p-2.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <Calendar size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date of Birth</p>
                            <p className="text-sm font-bold">{formatDate(tenant.dateOfBirth)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="p-2.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <User size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</p>
                            <p className="text-sm font-bold capitalize">{tenant.gender}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}