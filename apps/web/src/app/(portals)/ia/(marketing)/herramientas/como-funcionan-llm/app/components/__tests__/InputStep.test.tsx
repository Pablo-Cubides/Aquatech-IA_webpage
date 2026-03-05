/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputStep from "../InputStep";
import { ProcessProvider } from "../../../context/ProcessContext";

// Mock analytics
vi.mock("../../../utils/analytics", () => ({
  logEvent: vi.fn(),
}));

const mockDemoTexts = [
  "Los pájaros vuelan porque tienen alas",
  "La inteligencia artificial es fascinante",
  "Para estudiar mejor, recomiendo hacer resúmenes",
  "El agua hierve cuando alcanza cien grados",
];

const renderWithProvider = (props = {}) => {
  return render(
    <ProcessProvider>
      <InputStep demoTexts={mockDemoTexts} {...props} />
    </ProcessProvider>,
  );
};

describe("InputStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the welcome message", () => {
    renderWithProvider();

    expect(screen.getByText("Bienvenido a ExploraModelo")).toBeInTheDocument();
  });

  it("should render the text input", () => {
    renderWithProvider();

    const textarea = screen.getByPlaceholderText(
      /La inteligencia artificial es fascinante/i,
    );
    expect(textarea).toBeInTheDocument();
  });

  it("should render demo text buttons", () => {
    renderWithProvider();

    mockDemoTexts.forEach((demo) => {
      expect(screen.getByText(demo)).toBeInTheDocument();
    });
  });

  it("should update input when typing", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hola mundo");

    expect(textarea).toHaveValue("Hola mundo");
  });

  it("should update input when clicking demo text", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const demoButton = screen.getByText(mockDemoTexts[0]);
    await user.click(demoButton);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(mockDemoTexts[0]);
  });

  it("should disable submit button when input is empty", () => {
    renderWithProvider();

    const submitButton = screen.getByRole("button", {
      name: /Comenzar Análisis/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when input has text", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Texto de prueba");

    const submitButton = screen.getByRole("button", {
      name: /Comenzar Análisis/i,
    });
    expect(submitButton).not.toBeDisabled();
  });

  it("should show token count", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hola mundo");

    expect(screen.getByText(/tokens/i)).toBeInTheDocument();
  });

  it("should call onNext when form is submitted", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    renderWithProvider({ onNext });

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Texto para análisis");

    const submitButton = screen.getByRole("button", {
      name: /Comenzar Análisis/i,
    });
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(onNext).toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });
});
