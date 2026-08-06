// Shared refresh-token cookie config — used by authController (issuing,
// refreshing, clearing) and profileController (clearing on account
// deletion). Kept in one place so both stay in sync.
const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = "/api/auth"; // cookie only ever sent to auth endpoints

module.exports = { REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH };
