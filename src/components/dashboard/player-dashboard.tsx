import { StatsDashboard } from '../stats/stats-dashboard';

export function PlayerDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Jugador</h1>
      <StatsDashboard />
    </div>
  );
}