import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function PropertySetupCard({ score, flags }: any) {
    return (
        <Card className="border-none bg-primary text-white shadow-xl shadow-primary rounded-3xl">
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Setup Health</h3>
                    <span className="text-2xl font-black">{score}%</span>
                </div>
                <Progress value={score} className="h-2 bg-black" indicatorClassName="bg-white" />

                <div className="space-y-2 pt-2">
                    <SetupItem label="Basic Details" missing={flags.missingDetails} />
                    <SetupItem label="Rules & Policies" missing={flags.missingRules} />
                    <SetupItem label="Property Images" missing={flags.missingImages} />
                </div>
            </CardContent>
        </Card>
    );
}

function SetupItem({ label, missing }: { label: string; missing: boolean }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            {missing ? (
                <AlertCircle className="w-4 h-4 text-indigo-200" />
            ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            )}
            <span className={missing ? "text-indigo-100" : "text-white"}>{label}</span>
        </div>
    );
}