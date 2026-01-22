# --- Étape 1 : Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ON FORCE VITE À ÉCRIRE LES PLACEHOLDERS DANS LE JS
ENV VITE_API_URL=PLACEHOLDER_VITE_API_URL
ENV VITE_SUPABASE_URL=PLACEHOLDER_VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=PLACEHOLDER_VITE_SUPABASE_ANON_KEY
ENV VITE_DISCORD_CLIENT_ID=PLACEHOLDER_VITE_DISCORD_CLIENT_ID
ENV VITE_DISCORD_REDIRECT_URI=PLACEHOLDER_VITE_DISCORD_REDIRECT_URI
ENV VITE_GITHUB_CLIENT_ID=PLACEHOLDER_VITE_GITHUB_CLIENT_ID
ENV VITE_GITHUB_REDIRECT_URI=PLACEHOLDER_VITE_GITHUB_REDIRECT_URI

RUN npm run build

# --- Étape 2 : Serveur Nginx ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# On copie le build
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Création du script d'injection dynamique
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-inject-env.sh && \
    echo 'echo "Injecting variables into JS assets..."' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'for file in /usr/share/nginx/html/assets/*.js; do' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_API_URL|${VITE_API_URL}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_SUPABASE_URL|${VITE_SUPABASE_URL}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_SUPABASE_ANON_KEY|${VITE_SUPABASE_ANON_KEY}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_DISCORD_CLIENT_ID|${VITE_DISCORD_CLIENT_ID}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_DISCORD_REDIRECT_URI|${VITE_DISCORD_REDIRECT_URI}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_GITHUB_CLIENT_ID|${VITE_GITHUB_CLIENT_ID}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|PLACEHOLDER_VITE_GITHUB_REDIRECT_URI|${VITE_GITHUB_REDIRECT_URI}|g" $file' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'done' >> /docker-entrypoint.d/40-inject-env.sh

RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]