import axios from "axios";
import { getAuthHeaders } from "@/stores/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const S3BucketService = {
    uploadFile: async (file: File): Promise<{ path: string }> => {
        const formData = new FormData();
        formData.append("file", file);
    
        const res = await axios.post(`${API_URL}/api/s3-bucket/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        return res.data;
      },
    
    getFileUrl: async (filePath: string): Promise<{ url: string }> => {
        const res = await axios.get(`${API_URL}/api/s3-bucket/download/${encodeURIComponent(filePath)}`);
        return res.data;
    },
}