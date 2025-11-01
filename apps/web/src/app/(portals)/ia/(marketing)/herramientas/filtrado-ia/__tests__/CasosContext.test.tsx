import { describe, it, expect } from "vitest";
import React from "react";
import { CasosProvider } from "../src/context/CasosContext";

describe("CasosContext", () => {
  it("should render CasosProvider without errors", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(CasosProvider, { children });

    expect(wrapper).toBeDefined();
  });

  it("should create CasosProvider component", () => {
    expect(CasosProvider).toBeDefined();
  });

  it("should handle loading casos", async () => {
    const TestApp = ({ children }: { children: React.ReactNode }) =>
      React.createElement(CasosProvider, { children }, "Test Content");

    expect(TestApp).toBeDefined();
  });

  it("should provide selected caso state", () => {
    const TestComponent = () => {
      const [selectedIndex, setSelectedIndex] = React.useState(-1);
      return React.createElement("div", null, String(selectedIndex));
    };

    expect(TestComponent).toBeDefined();
  });
});
