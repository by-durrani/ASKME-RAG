import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkProvider = (provider: string) => {
  switch (provider) {
    case "email_code":
      return "email";
    case "from_oauth_github":
      return "github";
    case "from_oauth_google":
      return "google";
  }
};
