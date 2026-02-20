import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, AlertCircle } from "lucide-react";

export default function KYCSection({ kyc }: { kyc: any[] }) {
    if (kyc.length === 0) {
        return (
            <div className="text-center p-10 bg-muted/30 rounded-3xl border-2 border-dashed">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No KYC documents submitted yet.</p>
                <Button className="mt-4" variant="outline">Request Documents</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kyc.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{item.documentType}</p>
                                <p className="text-sm text-muted-foreground font-mono">{item.documentNo}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className={
                                item.status === 'VERIFIED' ? 'bg-green-500' :
                                    item.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'
                            }>
                                {item.status}
                            </Badge>
                            <Button size="sm" variant="ghost" className="text-xs h-8">
                                <Eye size={14} className="mr-1" /> View
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}