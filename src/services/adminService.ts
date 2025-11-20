import { api } from '@/api';

// ====================================================================
// Gestion des demandes de permis international pour l'admin
// ====================================================================

export const getPermisInternationalApplications = async (page = 1, limit = 10, search = '', status = '') => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) {
            params.append('search', search);
        }
        if (status) {
            params.append('status', status);
        }

        const response = await api.get(`/admin/demandes/permis-international?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des demandes de permis international:", error);
        throw error;
    }
};

export const getPermisInternationalApplicationById = async (id: number) => {
    try {
        const response = await api.get(`/admin/demandes/permis-international/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la demande ${id}:`, error);
        throw error;
    }
};

export const updatePermisInternationalApplicationStatus = async (id: number, status: string, comment?: string) => {
    try {
        const response = await api.put(`/admin/demandes/permis-international/${id}/status`, { status, comment });
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut de la demande ${id}:`, error);
        throw error;
    }
};
