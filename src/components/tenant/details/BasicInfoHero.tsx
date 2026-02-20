import { Mail, Phone, Calendar, MapPin, User, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function BasicInfoHero({ tenant, stay }: any) {
    return (
        <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-xl">
                <AvatarImage src={tenant.profileImage} className="object-cover" />
                <AvatarFallback className="text-3xl bg-primary/5 text-primary">
                    {tenant.fullName?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-bold tracking-tight">{tenant.fullName}</h2>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        <BadgeCheck size={14} className="mr-1" /> {stay?.status || 'RESIDENT'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={16} className="text-primary" /> {tenant.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={16} className="text-primary" /> {tenant.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} className="text-primary" /> {formatDate(tenant.dateOfBirth)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={16} className="text-primary" /> {tenant.gender}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} className="text-primary" /> {stay?.room?.name ? `Room ${stay.room.name}` : 'No Room Assigned'}
                    </div>
                </div>
            </div>
        </div>
    );
}