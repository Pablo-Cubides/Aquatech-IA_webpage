import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PromptSelector from "../PromptSelector";

const mockPrompts = [
  { id: "1", prompt: "Spider-Man", description: "Portrait painting" },
  { id: "2", prompt: "Superman", description: "Flying scene" },
  { id: "3", prompt: "Portrait", description: "Woman portrait" },
];

describe("PromptSelector", () => {
  it("should render all prompts", () => {
    const onSelect = vi.fn();
    render(
      <PromptSelector
        prompts={mockPrompts}
        selectedId={undefined}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText("Spider-Man")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
    expect(screen.getByText("Portrait")).toBeInTheDocument();
  });

  it("should render prompt descriptions", () => {
    const onSelect = vi.fn();
    render(
      <PromptSelector
        prompts={mockPrompts}
        selectedId={undefined}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText("Portrait painting")).toBeInTheDocument();
    expect(screen.getByText("Flying scene")).toBeInTheDocument();
  });

  it("should call onSelect when clicking a prompt", () => {
    const onSelect = vi.fn();
    render(
      <PromptSelector
        prompts={mockPrompts}
        selectedId={undefined}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("Spider-Man"));
    expect(onSelect).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("Superman"));
    expect(onSelect).toHaveBeenCalledWith("2");
  });

  it("should highlight selected prompt", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <PromptSelector prompts={mockPrompts} selectedId="1" onSelect={onSelect} />
    );

    const selectedElement = container.querySelector(".border-primary");
    expect(selectedElement).toBeInTheDocument();
  });

  it("should render empty when no prompts", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <PromptSelector prompts={[]} selectedId={undefined} onSelect={onSelect} />
    );

    expect(container.querySelectorAll("div > div").length).toBe(0);
  });
});
