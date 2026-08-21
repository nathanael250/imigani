export function getHealth(_req, res) {
  res.json({
    ok: true,
    service: "imigani-backend",
    timestamp: new Date().toISOString(),
  });
}
