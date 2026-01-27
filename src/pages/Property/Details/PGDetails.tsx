import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PGContentWrapper from "@/components/property/PGContentWrapper";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toNumber } from "@/lib/utils";

/* ================= TYPES ================= */

interface Details {
    id?: string;
    pgId: string;
    contactNumber: string;
    registrationNo?: string | null;
    messAvailable?: boolean | null;
    pgType?: "MENS" | "WOMENS" | "COLIVING";
    rentStart?: number | null;
    rentUpto?: number | null;
    messType?: "VEG" | "NON_VEG" | "MIXED";
    rentCycleDay?: number | null;
    noticePeriod?: number | null;
    lateFee?: number | null;
    totalFloors?: number | null;
}

/* ================= PAGE ================= */

export default function PGDetails() {
    const { pgId } = useParams();
    const [details, setDetails] = useState<Details | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await apiPrivate.get(`/pgs/details/${pgId}`);
                setDetails(res.data);
            } catch {
                setDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [pgId]);

    if (loading)
        return (
            <PGContentWrapper>
                Loading...
            </PGContentWrapper>
        );

    return (
        <PGContentWrapper>
            {!editing ? (
                <DetailsView
                    details={details}
                    onEdit={() => setEditing(true)}
                />
            ) : (
                <DetailsForm
                    details={details}
                    pgId={pgId!}
                    onCancel={() => setEditing(false)}
                    onUpdated={(data) => {
                        setDetails((prev) => ({ ...prev, ...data } as Details));
                        setEditing(false);
                    }}
                />
            )}
        </PGContentWrapper>
    );
}

/* ================= VIEW ================= */

function DetailsView({
    details,
    onEdit,
}: {
    details: Details | null;
    onEdit: () => void;
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Details</h2>
                <Button variant="outline" onClick={onEdit}>
                    {details ? "Edit" : "Add Details"}
                </Button>
            </div>

            {!details ? (
                <p className="text-sm text-gray-500">
                    No property details configured yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <Info label="Contact Number" value={details.contactNumber} />
                    <Info label="PG Type" value={details.pgType} />
                    <Info label="Mess Available" value={details.messAvailable ? "Yes" : "No"} />
                    <Info label="Mess Type" value={details.messType} />
                    <Info label="Rent Range" value={`${details.rentStart ?? "-"} - ${details.rentUpto ?? "-"}`} />
                    <Info label="Rent Cycle Day" value={details.rentCycleDay} />
                    <Info label="Notice Period (days)" value={details.noticePeriod} />
                    <Info label="Late Fee" value={details.lateFee} />
                    <Info label="Total Floors" value={details.totalFloors} />
                    <Info label="Registration No" value={details.registrationNo} />
                </div>
            )}
        </div>
    );
}

function Info({ label, value }: { label: string; value?: any }) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value ?? "-"}</p>
        </div>
    );
}

/* ================= EDIT FORM ================= */

function DetailsForm({
    details,
    pgId,
    onCancel,
    onUpdated,
}: {
    details: Details | null;
    pgId: string;
    onCancel: () => void;
    onUpdated: (data: Partial<Details>) => void;
}) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload: any = {
            pgId,
            contactNumber: formData.get("contactNumber"),
            registrationNo: formData.get("registrationNo") || null,
            messAvailable: formData.get("messAvailable") === "on",
            pgType: formData.get("pgType") === "" ? null : formData.get("pgType"),
            messType: formData.get("messType") === "" ? null : formData.get("messType"),
            rentStart: toNumber(formData.get("rentStart")),
            rentUpto: toNumber(formData.get("rentUpto")),
            rentCycleDay: toNumber(formData.get("rentCycleDay")),
            noticePeriod: toNumber(formData.get("noticePeriod")),
            lateFee: toNumber(formData.get("lateFee")),
            totalFloors: toNumber(formData.get("totalFloors")),
        };

        try {
            await apiPrivate.patch(`/pgs/details/update/${pgId}`, payload);
            toast.success("Property details updated");
            onUpdated(payload);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Contact Number">
                    <Input
                        name="contactNumber"
                        defaultValue={details?.contactNumber}
                        required
                    />
                </Field>

                <Field label="Registration No">
                    <Input
                        name="registrationNo"
                        defaultValue={details?.registrationNo ?? ""}
                    />
                </Field>

                <Field label="PG Type">
                    <Select name="pgType" defaultValue={details?.pgType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select PG Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MENS">Mens</SelectItem>
                            <SelectItem value="WOMENS">Womens</SelectItem>
                            <SelectItem value="COLIVING">Co-living</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Mess Type">
                    <Select name="messType" defaultValue={details?.messType ?? undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Mess Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VEG">Veg</SelectItem>
                            <SelectItem value="NON_VEG">Non-Veg</SelectItem>
                            <SelectItem value="MIXED">Mixed</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Rent Start">
                    <Input type="number" name="rentStart" defaultValue={details?.rentStart ?? ""} />
                </Field>

                <Field label="Rent Upto">
                    <Input type="number" name="rentUpto" defaultValue={details?.rentUpto ?? ""} />
                </Field>

                <Field label="Rent Cycle Day">
                    <Input type="number" name="rentCycleDay" defaultValue={details?.rentCycleDay ?? ""} />
                </Field>

                <Field label="Notice Period (days)">
                    <Input type="number" name="noticePeriod" defaultValue={details?.noticePeriod ?? ""} />
                </Field>

                <Field label="Late Fee">
                    <Input type="number" name="lateFee" defaultValue={details?.lateFee ?? ""} />
                </Field>

                <Field label="Total Floors">
                    <Input type="number" name="totalFloors" defaultValue={details?.totalFloors ?? ""} />
                </Field>

                <div className="flex items-center gap-3 pt-6">
                    <Switch name="messAvailable" defaultChecked={details?.messAvailable ?? false} />
                    <Label>Mess Available</Label>
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            {children}
        </div>
    );
}
