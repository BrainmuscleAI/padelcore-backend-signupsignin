import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Calendar,
  MapPin,
  Search,
  Filter,
  Trophy,
  Clock,
  ChevronRight,
} from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Torneo Nacional Amateur',
    date: '15 Abril, 2024',
    time: '09:00 AM',
    location: 'Club de Padel Cuernavaca',
    participants: 32,
    category: 'Torneo',
    status: 'Inscripciones Abiertas',
  },
  {
    id: 2,
    title: 'Clínica con Pro Players',
    date: '20 Abril, 2024',
    time: '10:00 AM',
    location: 'Padel Center Morelos',
    participants: 16,
    category: 'Clínica',
    status: 'Pocos Lugares',
  },
  // Add more events...
];

const clubs = [
  {
    id: 1,
    name: 'Club de Padel Cuernavaca',
    location: 'Cuernavaca, Morelos',
    courts: 6,
    members: 250,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
  },
  // Add more clubs...
];

export function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Comunidad Padel Core</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a eventos, encuentra jugadores de tu nivel y forma parte de la
            comunidad más grande de padel en México.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar eventos, clubes..."
              className="w-64"
              icon={Search}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Crear Evento
          </Button>
        </div>

        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="clubs">Clubes</TabsTrigger>
            <TabsTrigger value="players">Jugadores</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <Badge>{event.category}</Badge>
                        <Badge variant="outline">{event.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.participants} participantes
                        </span>
                      </div>
                    </div>
                    <Button>
                      Ver Detalles
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="clubs" className="grid md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {club.location}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {club.courts} canchas
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {club.members} miembros
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}