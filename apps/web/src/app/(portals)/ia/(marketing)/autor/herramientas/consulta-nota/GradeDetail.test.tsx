import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GradeDetail from "./GradeDetail";
describe("grade detail", () => {
  it("opens on hover, retains readable prose and closes on pointer exit", () => {
    render(
      <GradeDetail
        title="Jar/SST"
        comment="4,3 menos 0,5 = 3,8. Datos contrastados."
      />,
    );
    const button = screen.getByRole("button", {
      name: "Ver detalle de Jar/SST",
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.mouseEnter(button);
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "4,3 menos 0,5 = 3,8",
    );
    if (!button.parentElement) throw Error("Missing detail container");
    fireEvent.mouseLeave(button.parentElement);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
  it("works by keyboard and touch; Escape closes it", () => {
    render(<GradeDetail title="Parcial" comment="Resolución correcta." />);
    const button = screen.getByRole("button", {
      name: "Ver detalle de Parcial",
    });
    fireEvent.focus(button);
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Resolución correcta",
    );
    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
