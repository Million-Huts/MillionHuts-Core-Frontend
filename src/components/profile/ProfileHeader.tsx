import { Camera, Trash2, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfileHeader() {
    const { user, setUser } = useAuth();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const res = await apiPrivate.patch('/users/update-avatar', formData);
            setUser(res.data.data.user);
            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleRemoveImage = async () => {
        try {
            const res = await apiPrivate.delete('/users/remove-avatar');
            setUser(res.data.data.user);
            toast.success("Profile picture removed");
        } catch (error) {
            toast.error("Error removing image");
        }
    };

    return (
        <div className="relative w-full">
            {/* Cover Gradient - Reduced height to prevent swallowing the name */}
            <div className="h-40 w-full bg-gradient-to-r from-indigo-600 to-violet-700 md:h-48" />

            {/* Profile Info Bar */}
            <div className="mx-auto max-w-6xl px-4">
                <div className="relative -mt-16 flex flex-col items-center md:flex-row md:items-end md:gap-6">
                    {/* Avatar Container */}
                    <div className="relative group shadow-2xl rounded-full">
                        <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden flex items-center justify-center">
                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserIcon className="h-16 w-16 text-muted-foreground" />
                            )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <label className="cursor-pointer p-2 hover:bg-white/20 rounded-full text-white">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            {user?.profileImageUrl && (
                                <button onClick={handleRemoveImage} className="p-2 hover:bg-white/20 rounded-full text-red-400">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Text Details - Positioned to side on desktop, center on mobile */}
                    <div className="mt-4 text-center md:mb-4 md:mt-0 md:text-left">
                        <h2 className="text-2xl font-bold text-foreground md:text-3xl">{user?.name}</h2>
                        <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}