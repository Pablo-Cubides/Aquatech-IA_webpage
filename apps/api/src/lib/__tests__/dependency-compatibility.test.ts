import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("patched uuid CommonJS compatibility", () => {
  it("generates MercadoPago idempotency keys through the installed SDK", () => {
    // Real installed dependencies; no payment request or credential is used.
    const {
      RestClient,
    } = require("mercadopago/dist/utils/restClient/index.js");
    const first = RestClient.generateIdempotencyKey();
    expect(first).toMatch(uuidV4);
    expect(RestClient.generateIdempotencyKey()).not.toBe(first);
  });

  it("generates Google RPC request IDs through Firebase's dependency graph", () => {
    const firebaseRequire = createRequire(require.resolve("firebase-admin"));
    const firestoreRequire = createRequire(
      firebaseRequire.resolve("@google-cloud/firestore"),
    );
    const gaxRequire = createRequire(firestoreRequire.resolve("google-gax"));
    const { makeUUID } = gaxRequire("./util.js");
    expect(makeUUID()).toMatch(uuidV4);
  });
});
