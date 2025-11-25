import axios from "axios";

// Interrupteur pour activer/désactiver la logique de rafraîchissement
let isAuthInterceptorActive = false;

/**
 * Active ou désactive l'intercepteur de rafraîchissement de token.
 * Doit être appelé par les composants de route (protégées ou non).
 * @param isActive booléen pour activer ou non
 */
export function setAuthInterceptor(isActive: boolean) {
    isAuthInterceptorActive = isActive;
}


export const api = axios.create({
    // Utiliser le proxy Vite en dev (/api), sinon l'URL complète en prod
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true // IMPORTANT: transmettre le cookie refresh !
});

let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }

api.interceptors.request.use((config) => {
    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        
        // La logique de rafraîchissement n'est exécutée que si l'interrupteur est activé
        if (isAuthInterceptorActive && error.response?.status === 401 && !original._retry) {
            original._retry = true;
            if (!refreshing) {
                refreshing = true;
                try {
                    const { data } = await api.post("/auth/refresh");
                    setAccessToken(data.accessToken);
                    queue.forEach((cb) => cb());
                    queue = [];
                    return api(original);
                } catch (e) {
                    queue = [];
                    setAccessToken(null);
                    // Ajoute ici un redirect/logout si besoin !
                    return Promise.reject(e);
                } finally {
                    refreshing = false;
                }
            }
            // Attend la fin du refresh si déjà en cours
            return new Promise((resolve) => { queue.push(() => resolve(api(original))); });
        }
        return Promise.reject(error);
    }
);
