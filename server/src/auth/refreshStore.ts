interface RefreshTokenData {
    jti: string;
    userId: number;
    expiresAt: Date | string;
    userAgent?: string;
    ip?: string;
}

interface RefreshTokenEntry {
    userId: number;
    expiresAt: Date | string;
    revokedAt: string | null;
    userAgent?: string;
    ip?: string;
}

const store = new Map<string, RefreshTokenEntry>();

export async function saveRefresh({ jti, userId, expiresAt, userAgent, ip }: RefreshTokenData): Promise<void> {
    store.set(jti, { userId, expiresAt, revokedAt: null, userAgent, ip });
}

export async function findRefresh(jti: string): Promise<RefreshTokenEntry | undefined> {
    return store.get(jti);
}

export async function revokeRefresh(jti: string, reason: string = "logout"): Promise<void> {
    const entry = store.get(jti);
    if (entry) entry.revokedAt = new Date().toISOString();
}

export async function replaceRefresh(oldJti: string, newJti: string, data: Omit<RefreshTokenData, 'jti'>): Promise<void> {
    await revokeRefresh(oldJti, "rotated");
    await saveRefresh({ jti: newJti, ...data });
}
