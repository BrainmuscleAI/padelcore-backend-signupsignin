import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const headToHeadData = [
  {
    opponent: 'Miguel Torres',
    matches: 5,
    wins: 3,
    losses: 2,
    lastMatch: '12 Abril 2024',
  },
  {
    opponent: 'Ana González',
    matches: 4,
    wins: 2,
    losses: 2,
    lastMatch: '5 Abril 2024',
  },
  // Add more records...
];

export function HeadToHead() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = headToHeadData.filter((record) =>
    record.opponent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar jugador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Oponente</TableHead>
            <TableHead>Partidos</TableHead>
            <TableHead>Victorias</TableHead>
            <TableHead>Derrotas</TableHead>
            <TableHead>Último Partido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((record) => (
            <TableRow key={record.opponent} className="hover:bg-muted/50">
              <TableCell className="font-medium">{record.opponent}</TableCell>
              <TableCell>{record.matches}</TableCell>
              <TableCell className="text-green-600">{record.wins}</TableCell>
              <TableCell className="text-red-600">{record.losses}</TableCell>
              <TableCell>{record.lastMatch}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}