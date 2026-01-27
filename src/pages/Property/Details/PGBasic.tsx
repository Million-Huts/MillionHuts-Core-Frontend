import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PGContentWrapper from "@/components/property/PGContentWrapper";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PGData {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    status: string;
}

export default function PGBasic() {
    const { pgId } = useParams();
    const [pg, setPg] = useState<PGData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchPG = async () => {
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/getOne`);
                setPg(res.data.pg);
            } catch {
                toast.error("Failed to load PG details");
            } finally {
                setLoading(false);
            }
        };

        fetchPG();
    }, [pgId]);

    if (loading) return <PGContentWrapper>Loading...</PGContentWrapper>;
    if (!pg) return null;

    return (
        <PGContentWrapper>
            {!editing ? (
                <PGView pg={pg} onEdit={() => setEditing(true)} />
            ) : (
                <PGEditForm
                    pg={pg}
                    onCancel={() => setEditing(false)}
                    onUpdated={(updated) => {
                        setPg((prev) => ({ ...prev!, ...updated }));
                        setEditing(false);
                    }}
                />
            )}
        </PGContentWrapper>
    );
}

/* ================= VIEW COMPONENT ================= */

function PGView({
    pg,
    onEdit,
}: {
    pg: PGData;
    onEdit: () => void;
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Property Information</h2>
                <Button variant="outline" onClick={onEdit}>
                    Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Info label="Name" value={pg.name} />
                <Info label="Status" value={pg.status} />
                <Info label="City" value={pg.city} />
                <Info label="State" value={pg.state} />
                <Info label="Pincode" value={pg.pincode} />
                <Info label="Address" value={pg.address} full />
            </div>
        </div>
    );
}

function Info({
    label,
    value,
    full,
}: {
    label: string;
    value: string;
    full?: boolean;
}) {
    return (
        <div className={full ? "md:col-span-2" : ""}>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

/* ================= EDIT FORM COMPONENT ================= */

function PGEditForm({
    pg,
    onCancel,
    onUpdated,
}: {
    pg: PGData;
    onCancel: () => void;
    onUpdated: (data: Partial<PGData>) => void;
}) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            pgId: pg.id,
            name: formData.get("name"),
            address: formData.get("address"),
            city: formData.get("city"),
            state: formData.get("state"),
            pincode: formData.get("pincode"),
        };

        try {
            await apiPrivate.patch("/pgs/update-pg", payload);
            toast.success("PG updated");
            onUpdated(payload as Partial<PGData>);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="ml-2 mb-1">PG Name</Label>
                    <Input
                        name="name"
                        defaultValue={pg.name}
                        placeholder="PG Name"
                    />
                </div>
                <div>
                    <Label className="ml-2 mb-1">City</Label>
                    <Input
                        name="city"
                        defaultValue={pg.city}
                        placeholder="City"
                    />
                </div>
                <div>
                    <Label className="ml-2 mb-1">State</Label>
                    <Input
                        name="state"
                        defaultValue={pg.state}
                        placeholder="State"
                    />
                </div>
                <div>
                    <Label className="ml-2 mb-1">Pincode</Label>
                    <Input
                        name="pincode"
                        defaultValue={pg.pincode}
                        placeholder="Pincode"
                    />
                </div>
            </div>
            <div>
                <Label className="ml-2 mb-1">Address</Label>
                <Textarea
                    name="address"
                    defaultValue={pg.address}
                    placeholder="Full Address"
                    rows={6}
                />
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
