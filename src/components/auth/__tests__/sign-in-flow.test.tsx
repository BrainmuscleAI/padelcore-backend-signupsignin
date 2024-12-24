import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignInDialog } from '../sign-in-dialog';
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

describe('Sign In Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInDialog = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SignInDialog open={true} onOpenChange={() => {}} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('should show validation errors for invalid form submission', async () => {
    renderSignInDialog();

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/el correo electrónico es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderSignInDialog();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid credentials', async () => {
    renderSignInDialog();

    // Fill form with invalid credentials
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', () => {
    renderSignInDialog();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should disable form during submission', async () => {
    renderSignInDialog();

    // Fill form
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    // Check disabled state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeDisabled();
      expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
    });
  });
});