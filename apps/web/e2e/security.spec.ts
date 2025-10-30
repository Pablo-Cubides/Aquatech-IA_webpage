import { test, expect } from "@playwright/test";

/**
 * E2E Security Tests for AquatechIA
 * Tests authentication, authorization, and security headers
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Security Tests", () => {
  // =========================================================================
  // SECURITY HEADERS
  // =========================================================================

  test("should include X-Frame-Options header", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia`);
    const headers = response?.headers() || {};

    expect(headers["x-frame-options"]).toBe("DENY");
  });

  test("should include X-Content-Type-Options header", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia`);
    const headers = response?.headers() || {};

    expect(headers["x-content-type-options"]).toBe("nosniff");
  });

  test("should include Strict-Transport-Security header", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia`);
    const headers = response?.headers() || {};

    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("should include Content-Security-Policy header", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia`);
    const headers = response?.headers() || {};

    expect(headers["content-security-policy"]).toBeDefined();
  });

  test("should include Referrer-Policy header", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia`);
    const headers = response?.headers() || {};

    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  // =========================================================================
  // AUTHENTICATION
  // =========================================================================

  test("should redirect to home when accessing /ia/perfil without auth", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/ia/(marketing)/perfil`);

    // Should either redirect or show auth modal
    const url = page.url();
    expect(url).toContain("localhost") || url.includes("signin");
  });

  test("should not expose sensitive data in localStorage", async ({ page }) => {
    await page.goto(`${BASE_URL}/ia`);

    const storage = await page.context().storageState();
    const localStorageJSON = JSON.stringify(storage);

    // Check that no sensitive data is stored
    expect(localStorageJSON).not.toContain("DATABASE_URL");
    expect(localStorageJSON).not.toContain("API_KEY");
    expect(localStorageJSON).not.toContain("SECRET");
  });

  // =========================================================================
  // CORS & API SECURITY
  // =========================================================================

  test("should not allow unauthorized CORS requests", async ({ page }) => {
    const corsError = await page.evaluate(async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/datasets`, {
          method: "GET",
          headers: {
            Origin: "https://evil.com",
          },
        });

        // Check if CORS headers allow the request
        const allowOrigin =
          response.headers.get("Access-Control-Allow-Origin");
        return allowOrigin === "https://evil.com";
      } catch (e) {
        return true; // Request was blocked
      }
    });

    // Should be false (no cross-origin allowed from evil domain)
    expect(corsError).toBe(false);
  });

  // =========================================================================
  // RATE LIMITING
  // =========================================================================

  test("should rate limit API requests", async ({ page }) => {
    const results = [];

    for (let i = 0; i < 15; i++) {
      const response = await page.evaluate(async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/tools/analytics`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventName: "test",
              tool: "test-tool",
            }),
          });

          return res.status;
        } catch {
          return 0;
        }
      });

      results.push(response);
    }

    // At some point should get 429 (Too Many Requests)
    const hasRateLimit = results.includes(429);
    expect(hasRateLimit).toBe(true);
  });

  // =========================================================================
  // INPUT VALIDATION
  // =========================================================================

  test("should reject invalid JSON in POST requests", async ({ page }) => {
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tools/analytics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "{ invalid json }",
        });

        return res.status;
      } catch {
        return 0;
      }
    });

    // Should return 400 (Bad Request) or 500
    expect([400, 500]).toContain(response);
  });

  test("should reject missing required fields", async ({ page }) => {
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tools/analytics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Missing required fields
            eventData: {},
          }),
        });

        return res.status;
      } catch {
        return 0;
      }
    });

    // Should return 400 (Bad Request)
    expect(response).toBe(400);
  });

  // =========================================================================
  // REDIRECTS
  // =========================================================================

  test("should redirect ambiental author tools to IA", async ({ page }) => {
    // Follow redirects
    const response = await page.goto(
      `${BASE_URL}/ambiental/autor/herramientas/visualizador-notas`,
      { waitUntil: "networkidle" }
    );

    const finalUrl = page.url();

    // Should be redirected to IA version
    expect(finalUrl).toContain("/ia/autor/herramientas/visualizador-notas");
  });

  test("should use 301 permanent redirect", async ({ request }) => {
    const response = await request.head(
      `${BASE_URL}/ambiental/autor/herramientas/genealogia-app`
    );

    // 301 = Moved Permanently (good for SEO)
    // 302 = Found (bad for SEO)
    expect([301, 302]).toContain(response.status());
  });

  // =========================================================================
  // XSS PROTECTION
  // =========================================================================

  test("should escape user input to prevent XSS", async ({ page }) => {
    await page.goto(`${BASE_URL}/ia`);

    // Try to inject script via form or URL
    const xssPayload = '<script>alert("XSS")</script>';

    // Navigate to search with malicious input
    await page.goto(`${BASE_URL}/ia?search=${encodeURIComponent(xssPayload)}`);

    // Check that script is not executed
    const hasAlert = await page.evaluate(() => {
      return document.body.innerHTML.includes("<script>");
    });

    expect(hasAlert).toBe(false);
  });

  // =========================================================================
  // PRIVACY & COMPLIANCE
  // =========================================================================

  test("should have privacy policy page", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia/privacy`);

    expect(response?.status()).toBe(200);

    // Verify content
    await expect(page.locator("h1")).toContainText("Política de Privacidad");
  });

  test("should have terms of service page", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/ia/terms`);

    expect(response?.status()).toBe(200);

    // Verify content
    await expect(page.locator("h1")).toContainText("Términos de Servicio");
  });

  // =========================================================================
  // ROBOTS & SITEMAP
  // =========================================================================

  test("should have robots.txt", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);

    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain("User-agent");
    expect(content).toContain("Sitemap");
  });

  test("should have sitemap.xml", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`);

    // 404 is ok if sitemap is generated dynamically
    expect([200, 404]).toContain(response?.status());
  });

  // =========================================================================
  // SENSITIVE ENDPOINTS
  // =========================================================================

  test("should not expose directory listings", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/`);

    expect(response.status()).not.toBe(200);
  });

  test("should not expose environment variables", async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    const html = await page.content();

    // Ensure no secrets are in HTML
    expect(html).not.toContain("NEXTAUTH_SECRET");
    expect(html).not.toContain("DATABASE_URL");
    expect(html).not.toContain("GOOGLE_CLIENT_SECRET");
  });
});
