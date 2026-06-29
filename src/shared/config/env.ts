import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:4000")
});

const serverEnvSchema = clientEnvSchema.extend({
  API_INTERNAL_BASE_URL: z.string().url().optional(),
  AUTH_COOKIE_NAME: z.string().default("lat_session"),
  LAT_API_BEARER_TOKEN: z.string().optional()
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const serverEnv =
  typeof window === "undefined"
    ? serverEnvSchema.parse({
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        API_INTERNAL_BASE_URL: process.env.API_INTERNAL_BASE_URL,
        AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
        LAT_API_BEARER_TOKEN: process.env.LAT_API_BEARER_TOKEN
      })
    : null;
