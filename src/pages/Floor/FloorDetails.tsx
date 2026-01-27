import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { Floor } from "./Floors";
import { usePG } from "@/context/PGContext";
import type { Room } from "../Room/Rooms";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import RoomGrid from "@/components/room/RoomGrid";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

export default function FloorDetails() {
    const { floorId } = useParams();
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const [loading, setLoading] = useState(true);
    const navigator = useNavigate();

    const [floor, setFloor] = useState<Floor | null>(null);
    const [editing, setEditing] = useState(false);

    const [rooms, setRooms] = useState<Room[] | []>([]);

    useEffect(() => {
        if (!pgId || !floorId) return;
        setFloor(null);
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/floors/${floorId}`);
                setFloor(res.data.floor);
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [pgId, floorId]);

    useEffect(() => {
        if (!floor || !pgId || !floorId) return;
        const fetchRooms = async () => {
            setRooms([]);
            setLoading(true);
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/rooms/floor/${floorId}`);
                if (res.data.rooms.length !== 0)
                    setRooms(res.data.rooms);
            } catch (error: any) {
                toast.error(error.response.data.message)
            } finally {
                setLoading(false);
            }
        }
        fetchRooms()
    }, [floor])

    if (loading) return <div className="p-6">Loading floor...</div>;

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLoading(true);
        const payload = {
            label: formData.get("label"),
            publicPlaces: floor!.publicPlaces,
        };
        try {
            await apiPrivate.patch(
                `/pgs/${pgId}/floors/update/${floorId}`,
                payload
            );
            toast.success("Floor updated");
            setEditing(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="p-6 space-y-6">
            {!editing ? (
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {floor!.label}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Total Rooms: {floor!.totalRooms}
                        </p>
                        <div className="text-lg font-semibold flex gap-2">
                            {floor!.publicPlaces.length !== 0 && floor?.publicPlaces.map((place, idx) => (
                                <Badge
                                    variant={"secondary"}
                                    className="bg-blue-500 text-white dark:bg-blue-600"
                                    key={idx}
                                >
                                    <BadgeCheckIcon />
                                    {place}
                                </Badge>
                            ))}
                        </div>

                    </div>
                    <Button variant="outline" onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleUpdate} className="space-y-3 max-w-md">
                    <Input name="label" defaultValue={floor!.label} />
                    <Button type="submit">Save</Button>
                </form>
            )}

            {/* Dummy rooms */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold">Rooms</h3>
                {rooms.length === 0 ? (
                    <EmptyRoomsState onAdd={() => navigator('/')} />
                ) : (
                    <RoomGrid rooms={rooms} />
                )}
            </div>
        </div>
    );
}
