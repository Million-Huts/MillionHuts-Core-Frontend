interface Props {
    children: React.ReactNode;
}

export default function PGContentWrapper({ children }: Props) {
    return (
        <div className="p-4">
            {/* Content */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                {children}
            </div>
        </div>
    );
}
