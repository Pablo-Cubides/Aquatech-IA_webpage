import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import PrivacyContent from "./PrivacyContent";
import TermsContent from "./TermsContent";

const urlsIn = (element: React.ReactElement) => {
  const html = renderToStaticMarkup(element);
  return [...html.matchAll(/"url":"([^"]*)"/g)].map((m) => m[1]);
};

describe("JSON-LD de privacidad y terminos usa la URL de su portal", () => {
  it.each([
    ["privacy", PrivacyContent],
    ["terms", TermsContent],
  ] as const)("%s: ambiental no emite /ia/", (segment, Component) => {
    const ambiental = urlsIn(React.createElement(Component, { portal: "ambiental" }));
    expect(ambiental).toContain(`https://aquatechia.com/ambiental/${segment}`);
    expect(ambiental.some((url) => url.includes("/ia/"))).toBe(false);
    expect(urlsIn(React.createElement(Component))).toContain(`https://aquatechia.com/ia/${segment}`);
  });
});
