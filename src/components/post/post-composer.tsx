import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  Smile,
  Send,
  MapPin,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const COMMON_EMOJIS = ['😊', '👍', '🎾', '🏆', '💪', '🔥', '👏', '❤️'];

export function PostComposer() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [location, setLocation] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[100px] px-4',
      },
    },
  });

  const addEmoji = (emoji: string) => {
    editor?.commands.insertContent(emoji);
  };

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const handleSubmit = () => {
    const content = editor?.getHTML();
    console.log('Post content:', { content, location });
    toast({
      title: 'Publicación creada',
      description: 'Tu publicación ha sido creada exitosamente.',
    });
    editor?.commands.clearContent();
    setLocation('');
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <Input
          placeholder="Agregar ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-8"
        />
      </div>

      <div className="border rounded-lg">
        <EditorContent editor={editor} />
        
        <div className="border-t p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'bg-muted' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'bg-muted' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar enlace</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button onClick={addLink}>Agregar</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar imagen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="URL de la imagen..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button onClick={addImage}>Agregar</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor?.commands.focus()}
              >
                <Smile className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-0 mt-2 p-2 bg-background border rounded-lg shadow-lg grid grid-cols-4 gap-2">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="hover:bg-muted p-1 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>
    </Card>
  );
}