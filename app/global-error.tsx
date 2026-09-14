"use client";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "#fafaf9",
          color: "#1c1917",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#78716c",
            }}
          >
            FixItNow
          </p>

          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1.75rem",
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            The app failed to start
          </h1>

          <p
            style={{
              margin: "0.75rem 0 0",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#57534e",
            }}
          >
            Something broke before the page could render. Reloading usually
            clears it.
          </p>

          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: "1.75rem",
              border: 0,
              borderRadius: "9999px",
              padding: "0.6rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              background: "#facc15",
              color: "#422006",
            }}
          >
            Try again
          </button>

          {error.digest && (
            <p
              style={{
                margin: "1.75rem 0 0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.75rem",
                color: "#78716c",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
