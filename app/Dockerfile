# -----------------------------
# Étape 1 : Build du frontend
# -----------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

COPY scripts/entrypoint.sh .
RUN chmod +x entrypoint.sh

# Replace CMD
CMD ["./entrypoint.sh"]

# # -----------------------------
# # Étape 2 : Serveur Nginx
# # -----------------------------
# FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html

# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
