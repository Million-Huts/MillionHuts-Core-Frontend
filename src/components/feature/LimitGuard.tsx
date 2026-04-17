type LimitGuardProps = {
    allowed: boolean;
    message?: string;
    children: React.ReactNode;
};

export function LimitGuard({ allowed, message, children }: LimitGuardProps) {
    if (allowed) return <>{children}</>;

    return (
        <div className="space-y-2">
            <div className="opacity-50 pointer-events-none">{children}</div>
            <p className="text-xs text-muted-foreground">
                {message || "Limit reached. Upgrade to continue."}
            </p>
        </div>
    );
}