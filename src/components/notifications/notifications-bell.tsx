import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/lib/notifications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NotificationsList } from './notifications-list';

export function NotificationsBell() {
  const { unreadCount } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notificaciones</DialogTitle>
        </DialogHeader>
        <NotificationsList />
      </DialogContent>
    </Dialog>
  );
}