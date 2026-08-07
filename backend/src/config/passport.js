const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

// This app authenticates entirely with JWT (access token in memory +
// rotating refresh token in an httpOnly cookie — see authController.js).
// Passport is used ONLY to run the Google OAuth handshake and hand us back
// a verified profile; every strategy call below runs with `session: false`
// (set where this is invoked, in authRoutes.js), so Passport never touches
// req.session and express-session is never mounted. This is the standard
// "Passport for OAuth handshake, JWT for actual sessions" pattern — it
// deliberately does NOT create a second, parallel auth system.

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

// Whether the Google strategy actually got registered — authRoutes.js
// checks this before mounting the /google routes, and googleCallback in
// authController.js checks it too, so a missing/misconfigured credential
// only disables Google login specifically, never the rest of the app.
let googleStrategyEnabled = false;

// IMPORTANT: passport-oauth2's Strategy constructor throws synchronously
// if `clientID` (or `authorizationURL`/`tokenURL`, which
// passport-google-oauth20 fills in for us) is missing. Since this file is
// required at server startup (before app.listen ever runs), that throw
// would previously crash the ENTIRE backend process — meaning email/password
// login and signup would ALSO stop working, with no obvious connection to
// Google OAuth at all. Guarding this means a missing Google credential only
// ever disables the Google button, never the rest of the app.
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async function verify(accessToken, refreshToken, profile, done) {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          if (!email) {
            return done(new Error("Google account has no email to sign in with"));
          }

          const avatarUrl = (profile.photos && profile.photos[0] && profile.photos[0].value) || "";
          const normalizedEmail = email.toLowerCase();

          // Match the EXACT workflow requested: check MongoDB by email first.
          let user = await User.findOne({ email: normalizedEmail });

          if (user) {
            // Existing account (however it was created) — link the Google
            // identity to it if not already linked. Deliberately does NOT
            // touch `provider` or `password`: if this was a local
            // email/password account, it keeps working as a local account
            // too. This means "sign in with Google" and "sign in with
            // email/password" both work afterward for the same person,
            // rather than one silently disabling the other.
            if (!user.googleId) {
              user.googleId = profile.id;
              if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
              await user.save();
            }
            return done(null, user);
          }

          // No account with this email at all — create a new Google-only user.
          user = await User.create({
            name: profile.displayName || "Google User",
            email: normalizedEmail,
            googleId: profile.id,
            avatarUrl,
            provider: "google",
            // No `password` field at all — the schema makes password
            // conditionally required only for provider "local" (see User.js).
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  googleStrategyEnabled = true;
} else {
  console.warn(
    "[passport] Google OAuth is not configured (missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or " +
      "GOOGLE_CALLBACK_URL in .env) — the Google login/signup buttons will return an error until this is set. " +
      "Email/password authentication is unaffected."
  );
}

module.exports = { passport, googleStrategyEnabled };
