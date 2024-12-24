import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/lib/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export function NotificationsList() {
  const { notifications, markAsRead, clearNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <AnimatePresence>
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No hay notificaciones
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-muted/50' : 'bg-muted'
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}