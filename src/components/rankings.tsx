import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const topPlayers = [
  { rank: 1, name: 'Carlos Ramírez', points: 2500, matches: 45, winRate: '75%' },
  { rank: 2, name: 'Ana González', points: 2350, matches: 42, winRate: '72%' },
  { rank: 3, name: 'Miguel Ángel Torres', points: 2200, matches: 38, winRate: '70%' },
  { rank: 4, name: 'Laura Hernández', points: 2150, matches: 40, winRate: '68%' },
  { rank: 5, name: 'David Morales', points: 2000, matches: 36, winRate: '65%' },
];

export function Rankings() {
  return (
    <section className="container mx-auto px-4 py-24" id="rankings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Medal className="h-8 w-8 text-primary" />
            Top Jugadores
          </h2>
          <p className="text-muted-foreground">
            Los mejores jugadores de nuestra comunidad
          </p>
        </div>

        <div className="rounded-lg border shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Posición</TableHead>
                <TableHead>Jugador</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Partidos</TableHead>
                <TableHead>% Victoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlayers.map((player) => (
                <TableRow
                  key={player.rank}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <TableCell className="font-medium">{player.rank}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.points}</TableCell>
                  <TableCell>{player.matches}</TableCell>
                  <TableCell>{player.winRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </section>
  );
}