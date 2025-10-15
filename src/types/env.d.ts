declare namespace NodeJS {
  interface ProcessEnv {
    ASTRA_VEC_DB?: string;
    ASTRA_VEC_DB_NAMESPACE?: string;
    ASTRA_VEC_DB_COLLLECTION?: string;
    ASTRA_VEC_DB_ENDPOINT?: string;
    GEMINI_KEY?: string;
    OPENAI_API_KEY?: string;
    MONGODB_URI?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    CLERK_SECRET_KEY?: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL?: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL?: string;
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL?: string;
  }
}
