import { motion } from 'framer-motion';
import { Users, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useActions } from '@/lib/actions';
import { useAuth } from '@/lib/auth';
import { SignInDialog } from './auth/sign-in-dialog';
import { useState } from 'react';

const upcomingMatches = [
  {
    id: 1,
    title: 'Torneo Amateur',
    location: 'Club de Padel Cuernavaca',
    date: '15 de Abril, 2024',
    players: 16,
  },
  {
    id: 2,
    title: 'Liga Local',
    location: 'Padel Center Morelos',
    date: '20 de Abril, 2024',
    players: 24,
  },
  {
    id: 3,
    title: 'Desafío Mixto',
    location: 'Deportivo Cuernavaca',
    date: '25 de Abril, 2024',
    players: 12,
  },
];

export function Community() {
  const { user } = useAuth();
  const { joinTournament } = useActions();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleJoin = (tournament: typeof upcomingMatches[0]) => {
    if (!user) {
      setShowSignIn(true);
      return;
    }
    joinTournament(tournament.title);
  };

  return (
    <section className="container mx-auto px-4 py-24" id="comunidad">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Comunidad Activa
          </h2>
          <p className="text-muted-foreground">
            Únete a eventos y conoce a otros jugadores
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingMatches.map((match) => (
            <motion.div
              key={match.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="lighting-card hover:shadow-lg hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>{match.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{match.players} jugadores</span>
                  </div>
                  <Button 
                    className="w-full hover:bg-primary/90 transition-colors"
                    onClick={() => handleJoin(match)}
                  >
                    Unirse
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </section>
  );
}