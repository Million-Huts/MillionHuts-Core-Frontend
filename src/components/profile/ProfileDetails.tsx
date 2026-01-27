import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
    onEdit: () => void;
}

export default function ProfileDetails({ onEdit }: Props) {
    const { user } = useAuth();

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <Button variant="outline" onClick={onEdit}>
                    Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{user?.name}</p>
                </div>

                <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                </div>

                <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                </div>
            </div>
        </div>
    );
}
