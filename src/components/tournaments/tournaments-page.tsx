import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  ChevronRight,
  Clock,
} from 'lucide-react';

const tournaments = [
  {
    id: 1,
    title: 'Torneo Nacional Amateur',
    date: '15-20 Abril, 2024',
    location: 'Club de Padel Cuernavaca',
    prize: '$50,000 MXN',
    participants: {
      registered: 24,
      total: 32,
    },
    categories: ['Open', 'Amateur', 'Mixto'],
    status: 'Inscripciones Abiertas',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  },
  {
    id: 2,
    title: 'Copa Morelos 2024',
    date: '1-5 Mayo, 2024',
    location: 'Padel Center Morelos',
    prize: '$75,000 MXN',
    participants: {
      registered: 16,
      total: 24,
    },
    categories: ['Profesional', 'Amateur'],
    status: 'Próximamente',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd5c?w=800&q=80',
  },
  // Add more tournaments...
];

export function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Próximos Torneos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participa en los mejores torneos de padel en México
          </p>
        </div>

        <div className="grid gap-8">
          {tournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="relative h-full min-h-[200px] md:col-span-1">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-primary text-white">
                        {tournament.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{tournament.title}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {tournament.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {tournament.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {tournament.prize}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tournament.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {tournament.participants.registered}/{tournament.participants.total} Inscritos
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{
                              width: `${(tournament.participants.registered / tournament.participants.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <Button className="ml-4">
                        Inscribirse
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}