export default function ProfileHeader() {
    return (
        <div className="relative">
            {/* Cover */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-500 to-purple-600" />

            {/* DP */}
            <div className="absolute left-1/2 top-32 -translate-x-1/2">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 shadow-lg flex items-center justify-center text-gray-500">
                    {/* Replace later with image */}
                    DP
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}
