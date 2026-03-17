import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit3, DoorOpen, CreditCard, ArrowRight, UserPlus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import type { Tenant } from "@/interfaces/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditRoomModal from "@/components/room/EditRoomModal";
import type { Room } from "@/interfaces/room";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function RoomDetails() {
    const { roomId } = useParams();
    const { currentPG } = usePG();
    const navigate = useNavigate();

    const [room, setRoom] = useState<Room | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [tenantLoading, setTenantLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchRoomData = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${currentPG?.id}/rooms/${roomId}`);
            setRoom(res.data.data.room);
        } catch {
            toast.error("Could not find the data!")
        } finally { setLoading(false); }
    };

    const fetchTenants = async () => {
        try {
            const res = await apiPrivate.get(`/tenants/${currentPG?.id}?roomId=${roomId}`);
            setTenants(res.data.tenants || []);
        }
        catch { }
        finally {
            setTenantLoading(false);
        }
    };

    useEffect(() => {
        if (!currentPG?.id || !roomId) return;
        fetchRoomData();
        fetchTenants();
    }, [roomId, currentPG]);

    if (loading) return (
        <div className="relative min-h-[70vh]">
            <LoadingOverlay message="Fetching room data..." isLoading={loading} />
        </div>
    )
    if (!room) return <div className="p-10 text-center">Room not found.</div>;

    const occupancyPercentage = (room?.occupiedCount! / room?.capacity!) * 100;

    return (
        <div className="max-w-6xl mx-auto md:p-6 p-1 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-sm">
                    <ChevronLeft size={16} /> Back
                </Button>
                <Button variant="outline" className="gap-2 rounded-sm font-bold" onClick={() => setIsEditOpen(true)}>
                    <Edit3 size={14} /> Edit Room
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card rounded-sm p-8 shadow-sm border space-y-8">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 mb-3 font-black tracking-widest uppercase">{room?.roomType}</Badge>
                            <h1 className="text-4xl font-black tracking-tighter">Room {room?.name}</h1>
                            <p className="text-muted-foreground font-medium mt-1">{room?.sharing} Sharing</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between font-black text-sm">
                                <span>Occupancy</span>
                                <span>{room?.occupiedCount} / {room?.capacity}</span>
                            </div>
                            <Progress value={occupancyPercentage} className="h-3 rounded-full" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-sm">
                                <CreditCard className="text-primary" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Rent</p>
                                    <p className="font-black text-lg">₹{room?.rent.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-sm">
                                <DoorOpen className="text-primary" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                                    <p className="font-black">{room?.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tenant List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tighter">Residents</h2>
                        {room?.occupiedCount! < room?.capacity! && (
                            <Button className="rounded-sm font-black gap-2">
                                <UserPlus size={16} /> Add Tenant
                            </Button>
                        )}
                    </div>

                    {tenants.length === 0 ? (
                        <div className="flex flex-col relative min-h-[40vh] items-center justify-center py-20 border-2 border-dashed rounded-sm text-center">
                            {tenantLoading ? (
                                <LoadingOverlay message="Fetching tenants..." isLoading={tenantLoading} />
                            ) : (
                                <>
                                    <LayoutGrid className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <p className="font-bold text-muted-foreground">No tenants assigned yet.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">

                            {tenants.map((tenant) => (
                                <div key={tenant.id} onClick={() => navigate(`/pgs/${currentPG?.id}/tenants/${tenant.id}`)}
                                    className="group flex items-center justify-between p-4 bg-background rounded-sm  border hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12"><AvatarImage src={tenant.profileImage} /><AvatarFallback>{tenant.fullName[0]}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="font-black">{tenant.fullName}</p>
                                            <p className="text-xs font-medium text-muted-foreground">{tenant.phone}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <EditRoomModal room={room!} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={fetchRoomData} />
        </div>
    );
}