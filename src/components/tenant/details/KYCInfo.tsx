import type { Kyc } from '@/interfaces/tenant'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react';

const statusBg: Record<string, string> = {
    PENDING: "bg-yellow-200",
    SUBMITTED: "bg-teal-300",
    VERIFIED: "bg-emerald-500",
    REJECTED: "bg-red-700",
};


export default function KYCInfo({ kyc, requestKyc }: { kyc: Kyc[] | [], requestKyc: () => void }) {

    return (
        <div className={`flex-1 w-full gap-2 p-4 mt-2 md:border-r`}>
            <h2 className="text-2xl font-semibold mb-6 text-center">KYC Information</h2>
            <div className={`w-full flex flex-col ${kyc.length > 0 ? '' : 'h-full justify-center'}`}>
                {kyc && kyc.length > 0 ? kyc.map((k) => (
                    <>
                        <Card className={statusBg[k.status] ?? "bg-white"}>
                            <CardHeader>
                                <h2 className='text-lg text-bold'>{k.documentType}</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row justify-between border-b border-zinc-400">
                                        <span>Id </span>
                                        <p>{k.documentNo}</p>
                                    </div>
                                    <div className="flex flex-row justify-between border-b border-zinc-400">
                                        <span>Status</span>
                                        <p>{k.status}</p>
                                    </div>
                                    <Button size={"sm"} className='w-fit'> <Eye /> View Document</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>KYC Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                <p>KYC Information is Available only on request!</p>
                                <Button variant={"outline"} className='w-fit mx-auto' onClick={requestKyc}>Request Now!</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
