import { api } from '@/api';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
  date_creation: string;
  derniere_connexion?: string;
  telephone?: string;
  adresse?: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}

export interface SingleUserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserData {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: string;
  actif?: boolean;
  telephone?: string;
  adresse?: string;
}

export interface UpdateUserData {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: string;
  actif?: boolean;
  telephone?: string;
  adresse?: string;
}

export const getUsers = async (): Promise<UserResponse> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

export const getUserById = async (id: number): Promise<SingleUserResponse> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserData): Promise<SingleUserResponse> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: UpdateUserData): Promise<SingleUserResponse> => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};