import axios from "axios";
import { CreateAnnouncementDTO, UpdateAnnouncementDTO } from "@/types/announcement";
import { getAuthHeaders } from "@/stores/auth";

export enum VisibilityType {
    PRIVATE = "private",
    PUBLIC = "public",
    BOTH = "both",
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const AnnouncementService = {
    create: async (data: CreateAnnouncementDTO) => {
        const res = await axios.post(`${API_URL}/api/announcement`, data, {
          headers: getAuthHeaders(),
        });
        return res.data;
      },
    
      // Demander comment gérer le cas où on n'est pas connecté
      getAll: async (visibilityType: VisibilityType = VisibilityType.BOTH) => {
        const res = await axios.get(`${API_URL}/api/announcement`, {
          params: { visibilityType },
          headers: getAuthHeaders(),
        });
        return res.data;
      },
    
      getById: async (id: string) => {
        const res = await axios.get(`${API_URL}/api/announcement/${id}`);
        return res.data;
      },
    
      update: async (id: string, data: UpdateAnnouncementDTO) => {
        const res = await axios.patch(`${API_URL}/api/announcement/${id}`, data, {
          headers: getAuthHeaders(),
        });
        return res.data;
      },
    
      delete: async (id: string) => {
        const res = await axios.delete(`${API_URL}/api/announcement/${id}`, {
          headers: getAuthHeaders(),
        });
        return res.data;
      },
}