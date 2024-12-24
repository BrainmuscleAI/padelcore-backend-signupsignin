import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "¡Hola! Soy tu asistente de Padel Core. Puedo ayudarte con:\n\n• Información sobre torneos\n• Consejos técnicos\n• Reglas del juego\n• Reserva de canchas\n• Rankings y estadísticas",
  timestamp: new Date().toLocaleTimeString(),
};

const generateResponse = async (message: string): Promise<string> => {
  // Simulate AI response based on keywords
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const keywords = {
    torneo: "Los próximos torneos están programados para abril. ¿Te gustaría ver el calendario completo?",
    ranking: "Actualmente tenemos más de 1,000 jugadores en nuestro sistema de ranking. ¿Quieres consultar tu posición?",
    cancha: "Contamos con 12 canchas disponibles para reserva. ¿Te gustaría ver la disponibilidad?",
    regla: "Las reglas oficiales del padel están disponibles en nuestra sección de recursos. ¿Necesitas alguna aclaración específica?",
    precio: "Ofrecemos diferentes planes de membresía, incluyendo nuestra exclusiva Membresía Platino. ¿Te gustaría conocer más detalles?",
  };

  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(keywords)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return "Entiendo tu consulta. ¿Te gustaría que te proporcione más información sobre algún aspecto específico del padel?";
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await generateResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 w-80 h-[500px] z-50"
          >
            <Card className="h-full flex flex-col shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Asistente Padel Core</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] space-y-1 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70">{message.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              size="icon"
              onClick={() => setIsOpen(true)}
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}