const API_BASE_URL = '/api';

// ====================================================================
// Gestion des demandes de permis international pour l'admin
// ====================================================================

export const getPermisInternationalApplications = async (page = 1, limit = 10, search = '', status = '') => {
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) {
            params.append('search', search);
        }
        if (status) {
            params.append('status', status);
        }

        const response = await fetch(`${API_BASE_URL}/admin/demandes/permis-international?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des demandes');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des demandes de permis international:", error);
        throw error;
    }
};

export const getPermisInternationalApplicationById = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/demandes/permis-international/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la demande');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la demande ${id}:`, error);
        throw error;
    }
};

export const updatePermisInternationalApplicationStatus = async (id: number, status: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/demandes/permis-international/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut de la demande ${id}:`, error);
        throw error;
    }
};
