// components/tenant/CreateTempTenantForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiPrivate } from "@/lib/api";
import { Loader2, User, Phone, Mail, Calendar, ChevronLeft } from "lucide-react";
import type { Tenant } from "@/interfaces/tenant";

interface Props {
    onCreated: (tenant: Tenant) => void;
    onCancel?: () => void;
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
            console.error("Profile creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Name and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User size={12} className="text-primary" /> Full Name
                    </Label>
                    <Input
                        name="fullName"
                        placeholder="John Doe"
                        required
                        className="bg-background border-border focus:ring-2 focus:ring-primary/20 rounded-sm transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Phone size={12} className="text-primary" /> Phone Number
                    </Label>
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        required
                        className="bg-background border-border focus:ring-2 focus:ring-primary/20 rounded-sm transition-all"
                    />
                </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Mail size={12} className="text-primary" /> Email Address
                </Label>
                <Input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-background border-border focus:ring-2 focus:ring-primary/20 rounded-sm transition-all"
                />
            </div>

            {/* DOB and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Calendar size={12} className="text-primary" /> Date of Birth
                    </Label>
                    <Input
                        name="dateOfBirth"
                        type="date"
                        required
                        className="bg-background border-border focus:ring-2 focus:ring-primary/20 rounded-sm transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger className="bg-background border-border focus:ring-2 focus:ring-primary/20 rounded-sm h-11 transition-all text-left">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-border bg-popover shadow-xl">
                            <SelectItem value="Male" className="focus:bg-primary/10 transition-colors">Male</SelectItem>
                            <SelectItem value="Female" className="focus:bg-primary/10 transition-colors">Female</SelectItem>
                            <SelectItem value="Other" className="focus:bg-primary/10 transition-colors">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 rounded-sm h-12 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        onClick={onCancel}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                <Button
                    type="submit"
                    className="flex-[2] rounded-sm h-12 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <span>Creating...</span>
                        </div>
                    ) : (
                        "Create Profile"
                    )}
                </Button>
            </div>
        </form>
    );
}