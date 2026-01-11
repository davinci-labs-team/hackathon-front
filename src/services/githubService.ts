import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

function getAuthHeaders() {
    const authStore = useAuthStore()
    if (!authStore.user?.accessToken) {
        throw new Error('User is not authenticated')
    }
    return {
        Authorization: `Bearer ${authStore.user.accessToken}`,
    }
}

export const githubService = {
    async initializeOrganization(): Promise<any[]> {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/github/initialize-organization`,
            {},
            {
                headers: getAuthHeaders(),
            }
        )
        return res.data
    },
}
