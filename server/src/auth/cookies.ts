export function setRefreshCookie(res, token) {
    res.cookie("rt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax", // "lax" fonctionne car on utilise le proxy Vite
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
export function clearRefreshCookie(res) {
    res.clearCookie("rt", {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === 'production'
    });
}
