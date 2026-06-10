"use client"; // global-error must be a Client Component and render its own <html>/<body>

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Error crítico de la aplicación
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Algo falló al cargar la página. Intenta recargar.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#06b6d4",
              color: "#020617",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recargar
          </button>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "1.5rem" }}>
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
