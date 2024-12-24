import { useState } from 'react';
import { NotificationsContext, type Notification } from '@/lib/notifications';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nuevo Ranking',
    message: 'Has subido 3 posiciones en el ranking.',
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Partido Programado',
    message: 'Tienes un partido mañana a las 10:00 AM.',
    type: 'info',
    read: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Alerta de Moderación',
    message: 'Se ha reportado contenido inapropiado.',
    type: 'warning',
    read: false,
    timestamp: new Date().toISOString(),
  },
];

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}