/**
 * Consistent response envelope for every API endpoint.
 *
 * IMPORTANT: this stays backward-compatible with the existing frontend.
 * `success(res, 201, { token, user })` still sends `{ success: true, token, user }`,
 * so `res.data.token` / `res.data.user` on the client keep working exactly as
 * before — we're only adding a `success` flag, not changing the shape.
 */

function success(res, statusCode, data = {}, message) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...data,
  });
}

function error(res, statusCode, message, extra = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...extra,
  });
}

module.exports = { success, error };
