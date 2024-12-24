import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const progressData = [
  {
    skill: 'Saque',
    inicial: 60,
    actual: 85,
  },
  {
    skill: 'Volea',
    inicial: 55,
    actual: 75,
  },
  {
    skill: 'Bandeja',
    inicial: 45,
    actual: 70,
  },
  {
    skill: 'Smash',
    inicial: 50,
    actual: 80,
  },
  {
    skill: 'Posicionamiento',
    inicial: 65,
    actual: 90,
  },
];

export function ProgressTracking() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Progreso por Habilidad</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={progressData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="skill" type="category" width={100} />
            <Tooltip />
            <Bar
              dataKey="inicial"
              fill="hsl(var(--muted))"
              name="Nivel Inicial"
              barSize={20}
            />
            <Bar
              dataKey="actual"
              fill="hsl(var(--primary))"
              name="Nivel Actual"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Comparación entre nivel inicial y actual por habilidad
      </p>
    </Card>
  );
}