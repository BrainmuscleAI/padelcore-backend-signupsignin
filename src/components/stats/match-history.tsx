import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const matches = [
  {
    id: 1,
    date: '12 Abril 2024',
    tournament: 'Liga Local',
    opponent: 'M. Torres / L. Hernández',
    result: '6-4, 7-5',
    status: 'victoria',
  },
  {
    id: 2,
    date: '10 Abril 2024',
    tournament: 'Torneo Nacional',
    opponent: 'A. González / C. Ramírez',
    result: '4-6, 5-7',
    status: 'derrota',
  },
  // Add more matches...
];

export function MatchHistory() {
  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Torneo</TableHead>
            <TableHead>Oponentes</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id} className="hover:bg-muted/50">
              <TableCell>{match.date}</TableCell>
              <TableCell>{match.tournament}</TableCell>
              <TableCell>{match.opponent}</TableCell>
              <TableCell>{match.result}</TableCell>
              <TableCell>
                <Badge
                  variant={match.status === 'victoria' ? 'success' : 'destructive'}
                >
                  {match.status === 'victoria' ? 'Victoria' : 'Derrota'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}