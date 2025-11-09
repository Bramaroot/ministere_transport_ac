import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "./auth.config";

export function signAccessToken(payload: object) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: object) {
    const jti = uuid();
    const token = jwt.sign({ ...payload, jti }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
    return { token, jti };
}

export function verifyAccess(token: string) {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function verifyRefresh(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}
