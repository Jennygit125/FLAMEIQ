import cors from "cors";

const rawOrigins = process.env.ALLOWED_ORIGINS || "*";
const allowedOrigins = rawOrigins.split(",").map(o => o.trim());
const isWildcardAllowed = allowedOrigins.includes("*");

export const corsConfig = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, server-to-server)
        if (!origin) {
            return callback(null, true);
        }

        // Allow if exact match or wildcard is set
        if (isWildcardAllowed || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    // Credentials MUST be false if wildcard is enabled
    credentials: !isWildcardAllowed,
});