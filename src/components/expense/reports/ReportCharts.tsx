import type { Expense } from "@/interfaces/expense";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

type categoryData = {
    name: string;
    value: number;
}

type PieProps = {
    type: "pie";
    data: categoryData[];
};

type BarProps = {
    type: "bar";
    data: Expense[];
};

type Props = PieProps | BarProps;

export default function ReportCharts({ data, type }: Props) {
    if (type === "pie") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={8}
                        cornerRadius={10}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: number | undefined) => [value ? `₹${value.toLocaleString()}` : "₹0", "Amount"]}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    const chartData = data.reduce((acc: any[], curr) => {
        const date = new Date(curr.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.amount += Number(curr.amount);
        } else {
            acc.push({ date, amount: Number(curr.amount) });
        }
        return acc;
    }, []).slice(-7);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                    tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                />
                <Tooltip
                    cursor={{ fill: '#f1f5f9', radius: 8 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number | undefined) => [value ? `₹${value.toLocaleString()}` : "₹0", "Spent"]}
                />
                <Bar
                    dataKey="amount"
                    fill="#6366f1"
                    radius={[8, 8, 8, 8]}
                    barSize={32}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}