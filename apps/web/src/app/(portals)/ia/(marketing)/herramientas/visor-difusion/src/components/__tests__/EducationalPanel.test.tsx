import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EducationalPanel from "../EducationalPanel";

describe("EducationalPanel", () => {
  it("should render upper and lower text", () => {
    render(
      <EducationalPanel
        upperText="Test upper text content"
        lowerText="Test lower text content"
      />
    );

    expect(screen.getByText("Test upper text content")).toBeInTheDocument();
    expect(screen.getByText("Test lower text content")).toBeInTheDocument();
  });

  it("should render section headers", () => {
    render(<EducationalPanel upperText="Upper" lowerText="Lower" />);

    expect(screen.getByText("Paso Actual")).toBeInTheDocument();
    expect(screen.getByText("Detalles Técnicos")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <EducationalPanel
        upperText="Upper"
        lowerText="Lower"
        className="custom-class"
      />
    );

    const panel = container.firstChild as HTMLElement;
    expect(panel.classList.contains("custom-class")).toBe(true);
  });

  it("should have correct styling classes", () => {
    const { container } = render(
      <EducationalPanel upperText="Upper" lowerText="Lower" />
    );

    const panel = container.firstChild as HTMLElement;
    expect(panel.classList.contains("flex")).toBe(true);
    expect(panel.classList.contains("flex-col")).toBe(true);
  });
});
