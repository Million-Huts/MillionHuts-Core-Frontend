import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import type { Tenant } from "@/pages/Tenant/Tenants";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

export default function CreateTempTenantForm({
    onCreated,
}: {
    onCreated: (tenant: Tenant) => void;
}) {

    const [gender, setGender] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dob = new Date(formData.get("dateOfBirth") as string).toISOString()

        const res = await apiPrivate.post("/tenants/createProfile", {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: dob,
            gender
        });
        onCreated(res.data.tenant);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="mb-1 ml-1">Fullname</Label>
                <Input name="fullName" type="text" placeholder="Full name" required />
            </div>
            <div>
                <Label className="mb-1 ml-1">Email</Label>
                <Input name="email" type="email" placeholder="Email" required />
            </div>
            <div>
                <Label className="mb-1 ml-1">Phone</Label>
                <Input name="phone" type="number" placeholder="Phone" required />
            </div>
            <div>
                <Label className="mb-1 ml-1">Date Of Birth</Label>
                <Input name="dateOfBirth" type="date" required />
            </div>
            <div>
                <Label className="mb-1 ml-1">Gender</Label>
                <Select value={gender} name="gender" onValueChange={(val) => setGender(val)} required>
                    <SelectTrigger className="w-full h-8 cursor-pointer">
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"Male"}>Male</SelectItem>
                        <SelectItem value={"Female"}>Female</SelectItem>
                        <SelectItem value={"Other"}>Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full">
                Create Profile
            </Button>
        </form>
    );
}
