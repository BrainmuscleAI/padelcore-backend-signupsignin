import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignUpDialog } from '../sign-up-dialog';
import { AuthProvider } from '../auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { useToast } from '@/hooks/use-toast';

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sign Up Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpDialog = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SignUpDialog open={true} onOpenChange={() => {}} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('should show validation errors for invalid form submission', async () => {
    renderSignUpDialog();

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/el correo electrónico es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre de usuario es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre completo es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  it('should successfully register a new user and redirect to dashboard', async () => {
    const { toast } = useToast();
    renderSignUpDialog();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'Test123!@#' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    fireEvent.click(submitButton);

    // Verify loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creando cuenta/i)).toBeInTheDocument();

    // Wait for success and redirect
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Cuenta Creada',
        description: 'Tu cuenta ha sido creada exitosamente.',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show error message for duplicate email', async () => {
    const { toast } = useToast();
    renderSignUpDialog();

    // Fill out the form with existing email
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: 'existinguser' },
    });
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Existing User' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'Test123!@#' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    // Verify error message
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Este correo ya está registrado',
        variant: 'destructive',
      });
    });
  });

  it('should toggle password visibility', () => {
    renderSignUpDialog();

    // Get password inputs and toggle buttons
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icons

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle confirm password visibility
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Toggle back
    fireEvent.click(toggleButtons[0]);
    fireEvent.click(toggleButtons[1]);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});