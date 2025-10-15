import { z } from "zod";
import chalk from "chalk";

const envSchema = z.object({
  ASTRA_VEC_DB: z.string(),
  ASTRA_VEC_DB_NAMESPACE: z.string(),
  ASTRA_VEC_DB_COLLLECTION: z.string(),
  ASTRA_VEC_DB_ENDPOINT: z.string(),
  GEMINI_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  MONGODB_URI: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(chalk.red("❌ Invalid or missing environment variables:"));
  console.table(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

console.log(chalk.green("-Env Check:", "Env's are verified"));
