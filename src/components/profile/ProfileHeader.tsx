import { Camera, Trash2, User as UserIcon, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfileHeader() {
    const { user, setUser } = useAuth();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file); // Backend expects "image"

        try {
            const res = await apiPrivate.post('/users/profile-image', formData);
            setUser({ ...user, profileImageUrl: res.data.data.profileImageUrl });
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleRemoveImage = async () => {
        try {
            await apiPrivate.delete('/users/profile-image');
            setUser({ ...user, profileImageUrl: null });
            toast.success("Avatar removed");
        } catch (error) {
            toast.error("Error removing image");
        }
    };

    return (
        <div className="relative w-full">
            <div className="h-56 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 md:h-64" />

            <div className="mx-auto max-w-3xl px-4">
                <div className="relative -mt-20 flex flex-col items-center">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-[2.5rem] border-8 border-background bg-muted overflow-hidden flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-20 w-20 text-muted-foreground/40" />
                            )}
                        </div>

                        {/* Hover Overlay with Glassmorphism */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[2rem]">
                            <div className="flex gap-2">
                                <label className="cursor-pointer p-3 bg-white/20 hover:bg-white/40 rounded-2xl text-white transition-colors">
                                    <Camera className="h-6 w-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {user?.profileImageUrl && (
                                    <button onClick={handleRemoveImage} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-2xl text-red-200 transition-colors">
                                        <Trash2 className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">{user?.name}</h2>
                            {user?.isActive && <Check className="w-5 h-5 bg-primary text-primary-foreground rounded-full p-1" />}
                        </div>
                        <p className="text-muted-foreground font-medium">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}