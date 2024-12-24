import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SignUpForm } from './sign-up-form';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Cuenta</DialogTitle>
          <DialogDescription>
            Únete a la comunidad más grande de padel en México. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
}