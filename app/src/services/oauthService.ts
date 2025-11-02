import { useAuthStore } from '@/stores/auth'

export function loginDiscord(organizerPlatform: boolean = false, userId: string) {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);

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

export function loginGitHub(organizerPlatform: boolean = false, userId: string) {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GITHUB_REDIRECT_URI);
    
    const supabaseUserId = useAuthStore().user?.supabaseUserId;

  if (!supabaseUserId) {
    console.error('supabaseUserId is undefined! Cannot login with GitHub.');
    return;
  }

  const state = encodeURIComponent(JSON.stringify({
    supabaseUserId,
    userId,
    organizerPlatform,
  }));

  const scopes = "read:user repo repo:invite user:email";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  window.location.href = `${githubAuthUrl}&state=${state}`;
}