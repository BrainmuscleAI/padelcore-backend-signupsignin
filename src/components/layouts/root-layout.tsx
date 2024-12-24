import { Navbar } from '../navbar';
import { Toaster } from '../ui/sonner';
import { ChatBot } from '../chat-bot';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <ChatBot />
      <Toaster />
    </div>
  );
}