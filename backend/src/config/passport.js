import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value.toLowerCase();
                let user = await User.findOne({ email });

                if (!user) {
                    const username = email.split("@")[0];
                    let name =
                        profile.displayName ||
                        `${profile.name?.givenName || ""} ${
                            profile.name?.familyName || ""
                        }`.trim();

                    user = new User({
                        username,
                        email,
                        name,
                        providerId: profile.id,
                        isVerified: true,
                    });

                    await user.save();
                } else if (!user.providerId) {
                    user.providerId = profile.id;
                    await user.save();
                }

                if (!user.isActive) {
                    return done(null, false, {
                        message: "Account is inactive. Please contact support.",
                    });
                }

                const { accessToken, refreshToken } = await generateToken(user);

                const response = {
                    email: user.email,
                    username: user.username,
                    tokenType: "Bearer",
                    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                return done(null, response);
            } catch (error) {
                console.error("OAuth Error:", error);
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;
