if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error(
    "FATAL_ERROR: JWT_ACCESS_SECRET is not defined in environment variables."
  );
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error(
    "FATAL_ERROR: JWT_REFRESH_SECRET is not defined in environment variables."
  );
}

export const ACCESS_TOKEN_TTL = "7d";
export const REFRESH_TOKEN_TTL = "7d";
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
