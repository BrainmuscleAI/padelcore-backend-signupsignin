import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Send,
  Trophy,
  Camera,
  Shield,
  AlertTriangle,
  Ban,
  Bell,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  reported?: boolean;
  hidden?: boolean;
}

const cameras = [
  { id: 1, name: 'Cancha Principal', active: true },
  { id: 2, name: 'Ángulo Lateral', active: false },
  { id: 3, name: 'Vista Aérea', active: false },
  { id: 4, name: 'Cámara Lenta', active: false },
];

export function LiveStreaming() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [activeCamera, setActiveCamera] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: 'Carlos R.', message: '¡Gran partido!', timestamp: '12:01' },
    { id: 2, user: 'Ana G.', message: 'Excelente saque 🎾', timestamp: '12:02' },
    { id: 3, user: 'Miguel T.', message: '¡Vamos!', timestamp: '12:03' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Nuevo Comentario Reportado',
      message: 'Un comentario ha sido marcado como inapropiado',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Alta Audiencia',
      message: '¡Más de 1000 espectadores en vivo!',
      type: 'success',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      user: 'Tú',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleReportMessage = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, reported: true } : msg
    ));
    toast({
      title: "Mensaje Reportado",
      description: "El mensaje ha sido marcado para revisión.",
    });
  };

  const handleHideMessage = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, hidden: true } : msg
    ));
    toast({
      title: "Mensaje Ocultado",
      description: "El mensaje ha sido ocultado del chat.",
    });
  };

  const handleBanUser = (username: string) => {
    toast({
      title: "Usuario Bloqueado",
      description: `${username} ha sido bloqueado del chat.`,
      variant: "destructive",
    });
  };

  const handleCameraChange = (cameraId: number) => {
    setActiveCamera(cameraId);
    toast({
      title: "Cámara Cambiada",
      description: `Cambiado a ${cameras.find(c => c.id === cameraId)?.name}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Video and Match Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Controls */}
          {user?.role === 'admin' && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Panel de Control</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Cambiar Cámara
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {cameras.map((camera) => (
                      <DropdownMenuItem
                        key={camera.id}
                        onClick={() => handleCameraChange(camera.id)}
                      >
                        {camera.name}
                        {camera.id === activeCamera && (
                          <Badge className="ml-2" variant="secondary">
                            Activa
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          )}

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video bg-muted rounded-lg overflow-hidden relative lighting-card"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {cameras.find(c => c.id === activeCamera)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Club de Padel Cuernavaca
                </p>
              </div>
            </div>
          </motion.div>

          {/* Match Information */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                Torneo Nacional - Cuartos de Final
              </h1>
              <div className="flex items-center gap-4">
                <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        2
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notificaciones</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 rounded-lg bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            {notification.type === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <Trophy className="h-5 w-5 text-primary" />
                            )}
                            <h4 className="font-semibold">{notification.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Espectadores</p>
                <p className="text-lg font-bold">1.2k</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <MessageSquare className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Mensajes</p>
                <p className="text-lg font-bold">{messages.length}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Heart className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Me gusta</p>
                <p className="text-lg font-bold">856</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Carlos Ramírez / Ana González</h2>
                <p className="text-sm text-muted-foreground">vs</p>
                <h2 className="font-semibold">Miguel Torres / Laura Hernández</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">6-4, 5-3</p>
                <p className="text-sm text-muted-foreground">En progreso</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Chat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-[calc(100vh-2rem)] flex flex-col"
        >
          <Card className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat en Vivo
              </h2>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages
                  .filter(msg => !msg.hidden)
                  .map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-muted p-3 rounded-lg ${
                        msg.reported ? 'border-yellow-500 border' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{msg.user}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp}
                          </span>
                          {user?.role === 'admin' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Shield className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleHideMessage(msg.id)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ocultar Mensaje
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleBanUser(msg.user)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Bloquear Usuario
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          {!user?.role && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleReportMessage(msg.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}