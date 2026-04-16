import { formatFeatureUI } from "@/lib/feature-utils";
import { CheckCircle2, XCircle } from "lucide-react";

// Helper to handle the nested backend object structure
const flattenFeatures = (obj: any): Record<string, any> => {
    const flat: Record<string, any> = {};
    const recurse = (current: any) => {
        for (const key in current) {
            if (typeof current[key] === 'object' && current[key] !== null && !Array.isArray(current[key])) {
                recurse(current[key]);
            } else {
                flat[key] = current[key];
            }
        }
    };
    recurse(obj);
    return flat;
};

export const FeatureGrid = ({ features }: { features: Record<string, any> }) => {
    // Flatten the nested features (limits, modules, financial, etc.)
    const flatFeatures = flattenFeatures(features);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(flatFeatures).map(([key, value]) => {
                const feature = formatFeatureUI(key, value);
                const Icon = feature.icon;

                return (
                    <div
                        key={key}
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 ${feature.active
                            ? "bg-card border-border shadow-sm"
                            : "bg-muted/20 opacity-50 grayscale-[0.5]"
                            }`}
                    >
                        {/* Header: Label and Icon */}
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.15em]">
                                {feature.label}
                            </span>
                            <Icon
                                size={16}
                                className={feature.active ? "text-primary" : "text-muted-foreground"}
                            />
                        </div>

                        {/* Status Section */}
                        <div className="flex items-center gap-2">
                            {typeof value === "boolean" ? (
                                feature.active ? (
                                    <CheckCircle2 className="text-emerald-500" size={18} />
                                ) : (
                                    <XCircle className="text-muted-foreground/30" size={18} />
                                )
                            ) : (
                                <div className="p-1 px-2 rounded bg-primary/10 text-primary text-[10px] font-black">
                                    {value === 0 ? "∞" : value}
                                </div>
                            )}

                            <span className={`text-sm font-bold ${feature.active ? "text-foreground" : "text-muted-foreground"}`}>
                                {feature.status}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};