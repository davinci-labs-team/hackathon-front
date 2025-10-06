import { useAuthStore } from '@/stores/auth'

export function loginDiscord(organizerPlatform: boolean = false, userId: string) {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_API_URL + '/api/auth/discord/callback');

    const supabaseUserId = useAuthStore().user?.supabaseUserId;

if (!supabaseUserId) {
  console.error('supabaseUserId is undefined! Cannot login with Discord.');
  return;
}

const state = encodeURIComponent(JSON.stringify({
  supabaseUserId,
  userId,
  organizerPlatform,
}));

    window.location.href = 
        `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${state}`;

    
}