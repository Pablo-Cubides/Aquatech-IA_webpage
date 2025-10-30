import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal, AuthButton } from "@/components/auth/AuthModal";
import { signIn, signOut, useSession } from "next-auth/react";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

describe("AuthModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSession as any).mockReturnValue({ data: null });
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      render(<AuthModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByText("Iniciar Sesión")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    });

    it("should render with dark theme by default", () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} />,
      );

      const modal = container.querySelector(".bg-\\[\\#10111A\\]");
      expect(modal).toBeInTheDocument();
    });

    it("should render with light theme when specified", () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="light" />,
      );

      const modal = container.querySelector(".bg-white");
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Unauthenticated state", () => {
    beforeEach(() => {
      (useSession as any).mockReturnValue({ data: null });
    });

    it('should show "Iniciar Sesión" title', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    });

    it("should show Google sign-in button", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
    });

    it("should show description text", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(
        screen.getByText(
          /Inicia sesión para acceder a todas las funcionalidades/,
        ),
      ).toBeInTheDocument();
    });

    it("should call signIn when Google button is clicked", async () => {
      (signIn as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("google", { redirect: false });
      });
    });

    it("should show loading state during sign-in", async () => {
      (signIn as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();

      // Find button by its loading text instead
      const loadingButton = screen
        .getByText("Iniciando sesión...")
        .closest("button");
      expect(loadingButton).toBeDisabled();
    });

    it("should close modal after successful sign-in", async () => {
      (signIn as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should handle sign-in error gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (signIn as any).mockRejectedValue(new Error("Sign-in failed"));

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error signing in:",
          expect.any(Error),
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Authenticated state", () => {
    const mockSession = {
      user: {
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/avatar.jpg",
      },
    };

    beforeEach(() => {
      (useSession as any).mockReturnValue({ data: mockSession });
    });

    it('should show "Mi Cuenta" title', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Mi Cuenta")).toBeInTheDocument();
    });

    it("should display user name", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should display user email", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should display user avatar", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("should show sign-out button", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
    });

    it("should call signOut when button is clicked", async () => {
      (signOut as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const signOutButton = screen.getByText("Cerrar Sesión");
      await userEvent.click(signOutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith({ redirect: false });
      });
    });

    it("should show loading state during sign-out", async () => {
      (signOut as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const signOutButton = screen.getByText("Cerrar Sesión");
      await userEvent.click(signOutButton);

      expect(screen.getByText("Cerrando sesión...")).toBeInTheDocument();
      expect(signOutButton).toBeDisabled();
    });

    it("should close modal after successful sign-out", async () => {
      (signOut as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const signOutButton = screen.getByText("Cerrar Sesión");
      await userEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should handle sign-out error gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (signOut as any).mockRejectedValue(new Error("Sign-out failed"));

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const signOutButton = screen.getByText("Cerrar Sesión");
      await userEvent.click(signOutButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error signing out:",
          expect.any(Error),
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it("should not display user image if not provided", () => {
      const sessionWithoutImage = {
        user: {
          name: "Jane Doe",
          email: "jane@example.com",
        },
      };
      (useSession as any).mockReturnValue({ data: sessionWithoutImage });

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.queryByAltText("Jane Doe")).not.toBeInTheDocument();
    });
  });

  describe("Close functionality", () => {
    it("should call onClose when close button is clicked", async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole("button", { name: "" });
      await userEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should call onClose when backdrop is clicked", async () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} />,
      );

      const backdrop = container.firstChild as HTMLElement;
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not close when modal content is clicked", async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const title = screen.getByText("Iniciar Sesión");
      await userEvent.click(title);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Theme variations", () => {
    it("should apply dark theme text colors", () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="dark" />,
      );

      expect(
        container.querySelector(".text-\\[\\#F3F6FF\\]"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".text-\\[\\#B6C2DF\\]"),
      ).toBeInTheDocument();
    });

    it("should apply light theme text colors", () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="light" />,
      );

      expect(
        container.querySelector(".text-\\[\\#0D161C\\]"),
      ).toBeInTheDocument();
      expect(container.querySelector(".text-gray-700")).toBeInTheDocument();
    });
  });
});

describe("AuthButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSession as any).mockReturnValue({ data: null });
  });

  describe("Rendering", () => {
    it("should render with default dark theme", () => {
      const { container } = render(<AuthButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-white/20");
    });

    it("should render with light theme", () => {
      const { container } = render(<AuthButton theme="light" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-gray-300");
    });

    it("should accept custom className", () => {
      render(<AuthButton className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Button text", () => {
    it('should show "Iniciar sesión" when not authenticated', () => {
      (useSession as any).mockReturnValue({ data: null });

      render(<AuthButton />);

      expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    });

    it('should show "Mi Cuenta" when authenticated', () => {
      (useSession as any).mockReturnValue({
        data: {
          user: { name: "John Doe", email: "john@example.com" },
        },
      });

      render(<AuthButton />);

      expect(screen.getByText("Mi Cuenta")).toBeInTheDocument();
    });
  });

  describe("Modal interaction", () => {
    it("should open modal when button is clicked", async () => {
      render(<AuthButton />);

      const button = screen.getByText("Iniciar sesión");
      await userEvent.click(button);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
    });

    it("should close modal when backdrop is clicked", async () => {
      const { container } = render(<AuthButton />);

      const button = screen.getByText("Iniciar sesión");
      await userEvent.click(button);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();

      const backdrop = container.querySelector(".fixed.inset-0") as HTMLElement;
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(
          screen.queryByText("Continuar con Google"),
        ).not.toBeInTheDocument();
      });
    });

    it("should pass correct theme to modal", async () => {
      const { container } = render(<AuthButton theme="light" />);

      const button = screen.getByText("Iniciar sesión");
      await userEvent.click(button);

      const modal = container.querySelector(".bg-white");
      expect(modal).toBeInTheDocument();
    });
  });
});
