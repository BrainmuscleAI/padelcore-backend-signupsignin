import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Send,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop";
const CLUB_AVATAR = "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=64&h=64&fit=crop";

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Club Padel Cuernavaca',
        avatar: CLUB_AVATAR,
      },
      content: '¡Gran torneo este fin de semana! Felicitaciones a todos los participantes. 🏆',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
      likes: 156,
      comments: 24,
      shares: 12,
      timestamp: 'Hace 2 horas',
    },
    {
      id: 2,
      user: {
        name: 'Ana García',
        avatar: DEFAULT_AVATAR,
      },
      content: 'Increíble partido hoy. ¡Gracias a todos por el apoyo! 🎾',
      likes: 89,
      comments: 15,
      shares: 5,
      timestamp: 'Hace 4 horas',
    },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      user: {
        name: 'Usuario',
        avatar: DEFAULT_AVATAR,
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Ahora',
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="p-4 mb-4">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10">
              <img src={DEFAULT_AVATAR} alt="Usuario" className="object-cover" />
            </Avatar>
            <textarea
              className="flex-1 min-h-[100px] p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="¿Qué está pasando en el mundo del padel?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button type="submit" disabled={!newPost.trim()}>
              <Send className="h-5 w-5 mr-2" />
              Publicar
            </Button>
          </div>
        </form>
      </Card>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10">
                    <img src={post.user.avatar} alt={post.user.name} className="object-cover" />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Reportar</DropdownMenuItem>
                    <DropdownMenuItem>Silenciar</DropdownMenuItem>
                    <DropdownMenuItem>Bloquear</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="mt-3">{post.content}</p>

              {post.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Contenido del post"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="flex justify-between mt-4">
                <Button variant="ghost" size="sm" className="space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>{post.shares}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}