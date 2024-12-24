import { useToast } from '@/hooks/use-toast';
import { useNotifications } from './notifications';
import { ROUTES } from './routes';

export function useActions() {
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const goToPricing = () => {
    window.location.pathname = ROUTES.PRICING;
  };

  const goToFeatures = () => {
    const element = document.getElementById('caracteristicas');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToRankings = () => {
    window.location.pathname = ROUTES.RANKINGS;
  };

  const goToCommunity = () => {
    window.location.pathname = ROUTES.COMMUNITY;
  };

  const goToAbout = () => {
    const element = document.getElementById('nosotros');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinTournament = (tournamentName: string) => {
    toast({
      title: "¡Inscripción Exitosa!",
      description: `Te has inscrito a ${tournamentName}`,
    });
    addNotification({
      title: "Torneo Registrado",
      message: `Tu inscripción a ${tournamentName} ha sido confirmada.`,
      type: "success",
    });
  };

  const contactSupport = (message: string) => {
    toast({
      title: "Mensaje Enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
  };

  const handlePaymentSuccess = () => {
    addNotification({
      title: "¡Membresía Activada!",
      message: "Tu membresía Platino ha sido activada exitosamente.",
      type: "success",
    });
    
    setTimeout(() => {
      window.location.pathname = ROUTES.DASHBOARD;
    }, 2000);
  };

  const shareContent = (title: string, url: string = window.location.href) => {
    if (navigator.share) {
      navigator.share({
        title,
        url,
      }).catch(() => {
        toast({
          title: "Compartido",
          description: "Enlace copiado al portapapeles",
        });
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Compartido",
        description: "Enlace copiado al portapapeles",
      });
    }
  };

  const likeContent = (contentType: string, contentId: string) => {
    toast({
      title: "Me gusta",
      description: "Tu like ha sido registrado",
    });
  };

  const reportContent = (contentType: string, contentId: string) => {
    toast({
      title: "Contenido Reportado",
      description: "Gracias por ayudarnos a mantener la comunidad segura",
    });
  };

  const bookCourt = (courtName: string, date: string) => {
    toast({
      title: "Cancha Reservada",
      description: `Has reservado ${courtName} para el ${date}`,
    });
    addNotification({
      title: "Reserva Confirmada",
      message: `Tu reserva de ${courtName} ha sido confirmada`,
      type: "success",
    });
  };

  const registerForClass = (className: string, instructor: string) => {
    toast({
      title: "Clase Registrada",
      description: `Te has registrado para la clase con ${instructor}`,
    });
    addNotification({
      title: "Clase Confirmada",
      message: `Tu registro para la clase con ${instructor} ha sido confirmado`,
      type: "success",
    });
  };

  const followPlayer = (playerName: string) => {
    toast({
      title: "Siguiendo",
      description: `Ahora sigues a ${playerName}`,
    });
  };

  const sendMessage = (recipientName: string) => {
    toast({
      title: "Mensaje Enviado",
      description: `Tu mensaje a ${recipientName} ha sido enviado`,
    });
  };

  return {
    goToPricing,
    goToFeatures,
    goToRankings,
    goToCommunity,
    goToAbout,
    joinTournament,
    contactSupport,
    handlePaymentSuccess,
    shareContent,
    likeContent,
    reportContent,
    bookCourt,
    registerForClass,
    followPlayer,
    sendMessage,
  };
}