import { getAuthHeaders } from "@/stores/auth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const S3BucketService = {
    uploadFile: async (file: File, bucketName: string): Promise<{ path: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(`${API_URL}/api/s3-bucket/upload/${bucketName}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        });

        return res.data;
    },

    getFileUrl: async (bucketName: string, filePath: string): Promise<{ url: string }> => {
        const res = await axios.get(`${API_URL}/api/s3-bucket/download/${bucketName}/${encodeURIComponent(filePath)}`, {
          headers: getAuthHeaders(),
        });
        return res.data;
    },

    getFileUrlPublic: async (bucketName: string, filePath: string): Promise<{ url: string }> => {
        const res = await axios.get(`${API_URL}/api/s3-bucket/download/public/${bucketName}/${encodeURIComponent(filePath)}`);
        return res.data;
    },
}