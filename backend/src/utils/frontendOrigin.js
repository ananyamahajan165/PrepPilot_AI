function parseOrigin(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

function resolveFrontendOrigin(req) {
  const originHeader = req?.headers?.origin;
  const refererHeader = req?.headers?.referer;

  const candidate = originHeader || refererHeader;
  const parsed = parseOrigin(candidate);

  if (parsed) return parsed;

  return process.env.CLIENT_URL || "http://localhost:5173";
}

module.exports = { resolveFrontendOrigin };