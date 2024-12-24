import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Activity,
  Trophy,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Bell,
  MapPin,
  DollarSign,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PendingApproval {
  id: string;
  type: 'ranking' | 'match' | 'tournament';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      type: 'ranking',
      title: 'Actualización de Ranking',
      description: 'Carlos Ramírez sube al puesto #3 (+2)',
      status: 'pending',
      timestamp: '12:30 PM',
    },
    {
      id: '2',
      type: 'match',
      title: 'Resultado de Partido',
      description: 'Final Torneo Nacional: C.Ramírez/A.González vs M.Torres/L.Hernández (6-4, 7-5)',
      status: 'pending',
      timestamp: '11:45 AM',
    },
    {
      id: '3',
      type: 'tournament',
      title: 'Nuevo Torneo',
      description: 'Torneo Verano 2024 - Club Elite (25-30 Junio)',
      status: 'pending',
      timestamp: '10:15 AM',
    },
  ]);

  const handleApproval = (id: string, approved: boolean) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: approved ? 'approved' : 'rejected' }
          : item
      )
    );

    toast({
      title: approved ? "Aprobado" : "Rechazado",
      description: `La solicitud ha sido ${approved ? 'aprobada' : 'rechazada'} exitosamente.`,
      duration: 3000,
    });
  };

  const stats = [
    { label: 'Usuarios Activos', value: '156', icon: Users },
    { label: 'Partidos Hoy', value: '12', icon: Activity },
    { label: 'Torneos Activos', value: '3', icon: Trophy },
    { label: 'Eventos Próximos', value: '8', icon: Calendar },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Input
            placeholder="Buscar..."
            className="max-w-xs"
            icon={Search}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Registro</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="match" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="match">Partido</TabsTrigger>
                  <TabsTrigger value="tournament">Torneo</TabsTrigger>
                  <TabsTrigger value="player">Jugador</TabsTrigger>
                </TabsList>
                <TabsContent value="match" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Jugadores Equipo 1</Label>
                      <Input placeholder="Ej: Carlos Ramírez / Ana González" />
                    </div>
                    <div className="space-y-2">
                      <Label>Jugadores Equipo 2</Label>
                      <Input placeholder="Ej: Miguel Torres / Laura Hernández" />
                    </div>
                    <div className="space-y-2">
                      <Label>Resultado</Label>
                      <Input placeholder="Ej: 6-4, 7-5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha y Hora</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <Button className="w-full">Guardar Partido</Button>
                </TabsContent>
                <TabsContent value="tournament" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del Torneo</Label>
                      <Input placeholder="Ej: Torneo Nacional 2024" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sede</Label>
                      <Input placeholder="Ej: Club de Padel Cuernavaca" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Premio</Label>
                      <Input placeholder="Ej: $500,000" />
                    </div>
                  </div>
                  <Button className="w-full">Crear Torneo</Button>
                </TabsContent>
                <TabsContent value="player" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input placeholder="Ej: Carlos Ramírez" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="ejemplo@correo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating Inicial</Label>
                      <Input type="number" placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Club</Label>
                      <Input placeholder="Ej: Club de Padel Cuernavaca" />
                    </div>
                  </div>
                  <Button className="w-full">Registrar Jugador</Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 lighting-card hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Aprobaciones Pendientes
          </h2>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    approval.status === 'approved' 
                      ? 'bg-green-50 dark:bg-green-900/10' 
                      : approval.status === 'rejected'
                      ? 'bg-red-50 dark:bg-red-900/10'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{approval.title}</h3>
                        <Badge variant="outline">{approval.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {approval.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {approval.timestamp}
                      </p>
                    </div>
                    {approval.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApproval(approval.id, true)}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleApproval(approval.id, false)}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={approval.status === 'approved' ? 'success' : 'destructive'}>
                        {approval.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    date: '12 Abril',
                    type: 'Partido',
                    description: 'C.Ramírez/A.González vs M.Torres/L.Hernández',
                    status: 'Aprobado',
                  },
                  {
                    date: '12 Abril',
                    type: 'Ranking',
                    description: 'Actualización semanal de rankings',
                    status: 'Pendiente',
                  },
                  {
                    date: '11 Abril',
                    type: 'Torneo',
                    description: 'Registro nuevo torneo: Copa Verano 2024',
                    status: 'Aprobado',
                  },
                ].map((activity, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          activity.status === 'Aprobado' 
                            ? 'success' 
                            : activity.status === 'Pendiente'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}