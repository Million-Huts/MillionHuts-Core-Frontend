import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    Edit3,
    Users,
    DoorOpen,
    CreditCard,
    ArrowRight,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import type { Room } from "./Rooms";
import type { Tenant } from "@/interfaces/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditRoomSheet from "@/components/room/EditRoomSheet";

export default function RoomDetails() {
    const { roomId } = useParams();
    const { currentPG } = usePG();
    const navigate = useNavigate();

    const [room, setRoom] = useState<Room | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchRoomData = async () => {
        try {
            const [roomRes, tenantRes] = await Promise.all([
                apiPrivate.get(`/pgs/${currentPG?.id}/rooms/${roomId}`),
                apiPrivate.get(`/tenants/${currentPG?.id}?roomId=${roomId}`)
            ]);
            setRoom(roomRes.data.data.room);
            setTenants(tenantRes.data.tenants || []);
        } catch (error) {
            console.error("Failed to fetch room details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentPG?.id || !roomId) return;

        fetchRoomData();
    }, [roomId, currentPG]);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading room configuration...</div>;
    if (!room) return <div className="p-10 text-center text-destructive">Room not found.</div>;

    const occupancyPercentage = (room.occupiedCount / room.capacity) * 100;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft size={16} /> Back to Rooms
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsEditOpen(true)} // Add this
                >
                    <Edit3 size={14} /> Edit Room
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Room Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-6">
                        <div>
                            <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-none">
                                {room.roomType}
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight">Room {room.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <Users size={16} /> {room.sharing} Sharing
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-end text-sm">
                                <span className="text-muted-foreground">Occupancy</span>
                                <span className="font-bold">{room.occupiedCount} / {room.capacity} Beds</span>
                            </div>
                            <Progress value={occupancyPercentage} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Rent</p>
                                    <p className="font-bold">₹{room.rent.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <DoorOpen size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                                    <p className="font-bold">{room.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Residents List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Current Residents
                            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {tenants.length}
                            </span>
                        </h2>
                        {room.occupiedCount < room.capacity && (
                            <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 gap-2">
                                <UserPlus size={16} /> Add Tenant
                            </Button>
                        )}
                    </div>

                    {tenants.length === 0 ? (
                        <div className="bg-muted/20 border-2 border-dashed rounded-3xl p-12 text-center">
                            <p className="text-muted-foreground">No tenants currently assigned to this room.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tenants.map((tenant) => (
                                <div
                                    key={tenant.id}
                                    onClick={() => navigate(`/pgs/${currentPG?.id}/tenants/${tenant.id}`)}
                                    className="group flex items-center justify-between bg-white p-4 rounded-2xl border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={tenant.profileImage} />
                                            <AvatarFallback className="font-bold text-primary bg-primary/5">
                                                {tenant.fullName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold group-hover:text-primary transition-colors">
                                                {tenant.fullName}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {tenant.phone || tenant.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="hidden sm:inline-flex border-green-200 text-green-700 bg-green-50">
                                            Active Stay
                                        </Badge>
                                        <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Features / Amenities Section */}
                    {room.features && room.features.length > 0 && (
                        <div className="pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Room Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {room.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="rounded-lg font-medium">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {room && (
                <EditRoomSheet
                    room={room}
                    open={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={fetchRoomData}
                />
            )}
        </div>
    );
}