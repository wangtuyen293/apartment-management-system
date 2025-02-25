import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import User from "../models/users.js";
import generateToken from "./generateToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (profile, done) => {
            try {
                const email = profile.emails[0].value.toLowerCase();
                let user = await User.findOne({ email });

                if (user && user.authProvider !== "google") {
                    return done(null, false, {
                        message: "Please log in using email and password.",
                    });
                }

                if (!user) {
                    const username = email.split("@")[0];
                    let name = profile.displayName;

                    if (!name && profile.name) {
                        name = `${profile.name.givenName || ""} ${
                            profile.name.familyName || ""
                        }`.trim();
                    }

                    user = new User({
                        username,
                        email,
                        name,
                        providerId: profile.id,
                        authProvider: "google",
                        isVerified: true,
                    });

                    await user.save();
                }

                if (!user.isActive) {
                    return done(null, false, {
                        message: "User account is inactive.",
                    });
                }

                if (!user.isVerified) {
                    return done(null, false, {
                        message: "Email has not been verified.",
                    });
                }

                const { accessToken, refreshToken } = await generateToken(user);

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 1000,
                    sameSite: "Strict",
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    sameSite: "Strict",
                });

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
