import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiPrivate } from "@/lib/api";
import { Loader2 } from "lucide-react";
import type { Tenant } from "@/interfaces/tenant";

interface Props {
    onCreated: (tenant: Tenant) => void;
    onCancel?: () => void; // Added to fix the TS error
}

export default function CreateTempTenantForm({ onCreated, onCancel }: Props) {
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await apiPrivate.post("/tenants/createProfile", {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dateOfBirth: new Date(formData.get("dateOfBirth") as string).toISOString(),
                gender
            });
            onCreated(res.data.tenant);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input name="fullName" placeholder="John Doe" required />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Phone Number</Label>
                    <Input name="phone" type="tel" placeholder="9876543210" required />
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs">Email Address</Label>
                <Input name="email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs">Date of Birth</Label>
                    <Input name="dateOfBirth" type="date" required />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
                        Back
                    </Button>
                )}
                <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Profile"}
                </Button>
            </div>
        </form>
    );
}