export const PATTERNS = {
  NUMBERS_ONLY: "^[0-9]*$",
  NUMBERS_WITH_DOTS: "^[0-9.,]+$",
  NUMBERS_WITH_DOTS_AND_SPACES: "^[0-9., ]+$",
  PASSWORD: "^[A-Za-z0-9@$!%*#?&]*$",
  LOGIN: "^[A-Za-z0-9._-]*$",
} as const;
