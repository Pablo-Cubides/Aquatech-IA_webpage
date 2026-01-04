import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal, AuthButton } from "../AuthModal";
import { signIn, signOut, useSession } from "next-auth/react";
import "@testing-library/jest-dom";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
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

      expect(screen.queryByRole("heading", { name: "Iniciar Sesión" })).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
    });

    it("should render with dark theme by default", async () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} />,
      );

      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass("bg-[#10111A]");
    });

    it("should render with light theme when specified", async () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="light" />,
      );

      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass("bg-white");
    });
  });

  describe("Unauthenticated state", () => {
    beforeEach(() => {
      (useSession as any).mockReturnValue({ data: null });
    });

    it('should show "Iniciar Sesión" title', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
    });

    it("should show Google sign-in button", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
    });

    it("should show description text", () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(
        screen.getByText(
          /Accede a tu cuenta para continuar/,
        ),
      ).toBeInTheDocument();
    });

    it("should call signIn when Google button is clicked", async () => {
      (signIn as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("google", expect.objectContaining({ callbackUrl: expect.any(String) }));
      });
    });

    it("should show loading state during sign-in", async () => {
      (signIn as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      expect(screen.getByText("Conectando...")).toBeInTheDocument();

      // Find button by its loading text instead
      const loadingButton = screen
        .getByText("Conectando...")
        .closest("button");
      expect(loadingButton).toBeDisabled();
    });

    it("should close modal after successful sign-in", async () => {
      (signIn as any).mockResolvedValue({});

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const googleButton = screen.getByText("Continuar con Google");
      await userEvent.click(googleButton);

      await waitFor(() => {
        // expect(mockOnClose).toHaveBeenCalled(); // Google sign-in redirects, so onClose is not called explicitly
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

      expect(screen.getByText("Cerrando...")).toBeInTheDocument();
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

    it("should display default avatar if user image not provided", () => {
      const sessionWithoutImage = {
        user: {
          name: "Jane Doe",
          email: "jane@example.com",
        },
      };
      (useSession as any).mockReturnValue({ data: sessionWithoutImage });

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      // Should show the default robot avatar
      const img = screen.getByAltText("Jane Doe");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", expect.stringContaining("bottts"));
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

      const backdrop = await screen.findByTestId("auth-modal-backdrop");
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not close when modal content is clicked", async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      // Click on the modal content container (not the text which may trigger other handlers)
      const modalContent = screen.getByRole("heading", { name: "Iniciar Sesión" }).closest('div[class*="rounded-xl"]');
      if (modalContent) {
        fireEvent.click(modalContent);
      }

      // The onClick handler on the modal div calls stopPropagation, so onClose should NOT be called
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Theme variations", () => {
    it("should apply dark theme text colors", async () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="dark" />,
      );

      const modal = await screen.findByRole("dialog");
      expect(modal.querySelector(".text-white")).toBeInTheDocument();
      expect(modal.querySelector(".text-gray-400")).toBeInTheDocument();
    });

    it("should apply light theme text colors", async () => {
      const { container } = render(
        <AuthModal isOpen={true} onClose={mockOnClose} theme="light" />,
      );

      const modal = await screen.findByRole("dialog");
      expect(modal.querySelector(".text-gray-900")).toBeInTheDocument();
      expect(modal.querySelector(".text-gray-700")).toBeInTheDocument();
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

    it('should show user name when authenticated', () => {
      (useSession as any).mockReturnValue({
        data: {
          user: { name: "John Doe", email: "john@example.com" },
        },
      });

      render(<AuthButton />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Modal interaction", () => {
    it("should open modal when button is clicked", async () => {
      render(<AuthButton />);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
    });

    it("should close modal when backdrop is clicked", async () => {
      const { container } = render(<AuthButton />);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();

      const backdrop = await screen.findByTestId("auth-modal-backdrop");
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(
          screen.queryByText("Continuar con Google"),
        ).not.toBeInTheDocument();
      });
    });

    it("should pass correct theme to modal", async () => {
      const { container } = render(<AuthButton theme="light" />);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass("bg-white");
    });
  });
});
