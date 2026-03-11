import { Camera, Trash2, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfileHeader() {
    const { user, setUser } = useAuth();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await apiPrivate.post('/users/profile-image', formData);
            setUser({ ...user, profileImageUrl: res.data.data.profileImageUrl });
            toast.success("Profile Image updated");
        } catch { toast.error("Upload failed"); }
    };

    const handleRemoveImage = async () => {
        try {
            await apiPrivate.delete('/users/profile-image');
            setUser({ ...user, profileImageUrl: null });
            toast.success("Avatar reset");
        } catch { toast.error("Removal failed"); }
    };

    return (
        <div className="relative w-full">
            <div className="mx-auto max-w-3xl px-8">
                <div className="relative flex flex-col md:flex-row items-center gap-8 pb-8">
                    {/* Identity Avatar Module */}
                    <div className="relative group shrink-0">
                        <div className="relative h-60 w-60 rounded-sm border-[6px] border-background bg-muted overflow-hidden shadow-2xl">
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground/30"><UserIcon size={64} /></div>
                            )}
                        </div>

                        {/* Interactive Controls */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-sm">
                            <div className="flex gap-2">
                                <label className="cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-sm text-white backdrop-blur-md">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {user?.profileImageUrl && (
                                    <button onClick={handleRemoveImage} className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-sm text-red-200 backdrop-blur-md">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Identity Text Module */}
                    <div className="pb-2">
                        <div className="flex items-center gap-3">
                            {user?.isActive && (
                                <div className="p-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                                    <ShieldCheck size={20} />
                                </div>
                            )}
                            <h2 className="text-4xl font-black tracking-tighter text-foreground">{user?.name}</h2>
                        </div>
                        <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground mt-1">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}