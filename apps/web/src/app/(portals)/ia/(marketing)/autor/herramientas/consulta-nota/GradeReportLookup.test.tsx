import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import GradeReportLookup from "./GradeReportLookup";
const report = {
  period: "2026-3",
  courseId: "course-1",
  courseTitle: "Plantas",
  group: "1",
  cut: 2,
  studentCode: "00001234",
  studentName: "NOMBRE PRIVADO",
  cutTotal: null,
  cutMax: 30,
  grades: [
    {
      activityId: "C2-PAR",
      title: "Parcial",
      grade: 12.3,
      max: 15,
      countsTowardAggregate: true,
      justification: "Revisión de cálculos.",
    },
    {
      activityId: "C2-PRO",
      title: "Proyecto",
      grade: 0,
      max: 5,
      countsTowardAggregate: true,
      justification: "Cero confirmado.",
    },
    {
      activityId: "C2-ACT",
      title: "Actividades",
      grade: null,
      max: 5,
      countsTowardAggregate: true,
      justification: "Falta una nota.",
    },
  ],
};
afterEach(() => vi.unstubAllGlobals());
describe("code-only grade lookup", () => {
  it("shows code and actual scales, zero and pending, without a name", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ courses: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ found: true, reports: [report] }),
      });
    vi.stubGlobal("fetch", fetchMock);
    render(<GradeReportLookup />);
    fireEvent.change(screen.getByTestId("grade-code"), {
      target: { value: "00001234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    await screen.findByText("Código 00001234");
    expect(screen.queryByText("NOMBRE PRIVADO")).not.toBeInTheDocument();
    expect(screen.getByText("/15")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getAllByText("Pendiente").length).toBeGreaterThan(0);
    expect(fetchMock.mock.calls[1][0]).toBe("/api/grade-reports/lookup");
    expect(fetchMock.mock.calls[1][1].body).toBe(
      JSON.stringify({ code: "00001234" }),
    );
  });
  it("reports empty results and allows another lookup after a network error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ courses: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ found: false, reports: [] }),
      })
      .mockRejectedValueOnce(Error("Servicio no disponible"));
    vi.stubGlobal("fetch", fetchMock);
    render(<GradeReportLookup />);
    fireEvent.change(screen.getByTestId("grade-code"), {
      target: { value: "00001234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    await screen.findByText(/No hay calificaciones publicadas/);
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    await screen.findByText("Servicio no disponible");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Consultar" }),
      ).not.toBeDisabled(),
    );
  });
});
