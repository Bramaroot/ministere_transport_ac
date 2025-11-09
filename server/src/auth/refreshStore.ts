const store = new Map();
export async function saveRefresh({ jti, userId, expiresAt, userAgent, ip }) {
    store.set(jti, { userId, expiresAt, revokedAt: null, userAgent, ip });
}
export async function findRefresh(jti) { return store.get(jti); }
export async function revokeRefresh(jti, reason = "logout") {
    const entry = store.get(jti); if (entry) entry.revokedAt = new Date().toISOString();
}
export async function replaceRefresh(oldJti, newJti, data) {
    await revokeRefresh(oldJti, "rotated");
    await saveRefresh({ jti: newJti, ...data });
}
