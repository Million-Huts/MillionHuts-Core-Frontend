import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Room } from '@/pages/Room/Rooms';
import type { TenantStay } from '@/pages/Tenant/TenantDetails';
import { Pencil } from 'lucide-react';

interface FullStayResponse extends TenantStay {
    room?: Room;
}


export default function StayRecordInfo({ stayInfo, changeEdit }: { stayInfo: FullStayResponse, changeEdit: () => void }) {
    if (!stayInfo) return null;
    return (
        <div className={`flex-1 w-full gap-2 p-4 mt-2`}>
            <div className="flex flex-row flex-wrap items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-center">Stay Records</h2>
                <Button onClick={changeEdit}><Pencil size={18} /> Edit</Button>
            </div>
            <hr />
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Room</span>
                    <span>{stayInfo.room?.name || '-'}</span>
                </div>
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Rent</span>
                    <span>{stayInfo.rent}</span>
                </div>
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Deposit</span>
                    <span>{stayInfo.deposit}</span>
                </div>
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Join Date</span>
                    <span>{stayInfo.startDate ? formatDate(stayInfo.startDate) : '-'}</span>
                </div>
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Leave Date</span>
                    <span>{stayInfo.endDate ? formatDate(stayInfo.endDate) : '-'}</span>
                </div>
                <div className="flex flex-row justify-between border-b py-1">
                    <span>Status</span>
                    <span>{stayInfo.status}</span>
                </div>
            </div>
        </div>
    )
}
