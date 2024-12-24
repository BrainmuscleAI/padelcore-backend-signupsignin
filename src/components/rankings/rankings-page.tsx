import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy, Search, Filter, MapPin } from 'lucide-react';

const categories = ['Open', 'Amateur', 'Veteranos', 'Mixto'];
const locations = ['Nacional', 'CDMX', 'Cuernavaca', 'Monterrey', 'Guadalajara'];

export function RankingsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Rankings Nacionales</h1>
            <p className="text-muted-foreground">
              Clasificación actualizada de los mejores jugadores de México
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar jugador..."
              className="w-64"
              icon={Search}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <Tabs defaultValue="open">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {locations.map((location) => (
                  <Button
                    key={location}
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category.toLowerCase()}>
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Posición</TableHead>
                      <TableHead>Jugador</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead className="text-right">Puntos</TableHead>
                      <TableHead className="text-right">Torneos</TableHead>
                      <TableHead className="text-right">Victoria/Derrota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell className="font-medium">
                          {i === 0 && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline mr-2" />
                          )}
                          #{i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://i.pravatar.cc/32?u=${i}`}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium">
                                {['Carlos Ramírez', 'Ana González', 'Miguel Torres'][i % 3]}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {['CDMX', 'Cuernavaca', 'Monterrey'][i % 3]}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {['Club Padel Cuernavaca', 'Padel Center CDMX', 'Club Elite'][i % 3]}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {2500 - i * 50}
                        </TableCell>
                        <TableCell className="text-right">
                          {15 - Math.floor(i / 3)}
                        </TableCell>
                        <TableCell className="text-right">
                          {`${80 - i * 2}%`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}