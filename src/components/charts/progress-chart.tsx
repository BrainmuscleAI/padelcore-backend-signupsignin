import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Ene', rating: 1200 },
  { name: 'Feb', rating: 1250 },
  { name: 'Mar', rating: 1280 },
  { name: 'Abr', rating: 1310 },
  { name: 'May', rating: 1290 },
  { name: 'Jun', rating: 1350 },
];

export function ProgressChart() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Progreso de Rating</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              padding={{ left: 0, right: 0 }}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              padding={{ top: 20, bottom: 20 }}
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}