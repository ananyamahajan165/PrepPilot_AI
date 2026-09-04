const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

let googleStrategyEnabled = false;

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

          let user = await User.findOne({ email: normalizedEmail });

          if (user) {

            if (!user.googleId) {
              user.googleId = profile.id;
              if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName || "Google User",
            email: normalizedEmail,
            googleId: profile.id,
            avatarUrl,
            provider: "google",

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
