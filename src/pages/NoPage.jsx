function NoPage() {
  return (
    <main
      style={{
        display: "grid",
        alignContent: "center",
        gap: 24,
        minHeight: "calc(100vh - var(--header-h))",
        padding: "0 var(--gutter)",
      }}
    >
      <h1 className="t-display" style={{ fontSize: "clamp(120px, 30vw, 420px)", lineHeight: 0.8 }}>
        404
      </h1>
      <p className="t-mono">
        This page does not exist.
      </p>
    </main>
  );
}

export default NoPage;
