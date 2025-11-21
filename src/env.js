import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper function to check which env vars are missing
function checkMissingEnvVars() {
  const required = {
    DATABASE_URL: process.env.DATABASE_URL,
    LIVEBLOCKS_PUBLIC_KEY: process.env.LIVEBLOCKS_PUBLIC_KEY,
    LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
    ...(process.env.NODE_ENV === "production" && {
      AUTH_SECRET: process.env.AUTH_SECRET,
    }),
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value || (typeof value === "string" && value.trim() === ""))
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("\n📖 Please add these variables in Vercel:");
    console.error("   Settings → Environment Variables → Add");
    console.error("\nSee VERCEL_DEPLOYMENT.md for detailed instructions.\n");
  }
}

// Check for missing vars before validation
checkMissingEnvVars();

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1, "AUTH_SECRET is required in production")
        : z.string().optional(),
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LIVEBLOCKS_PUBLIC_KEY: z.string().min(1, "LIVEBLOCKS_PUBLIC_KEY is required"),
    LIVEBLOCKS_SECRET_KEY: z.string().min(1, "LIVEBLOCKS_SECRET_KEY is required"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    LIVEBLOCKS_PUBLIC_KEY: process.env.LIVEBLOCKS_PUBLIC_KEY,
    LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
