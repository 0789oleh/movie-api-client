# === STAGE 1: Build ===
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package файлы
COPY package*.json ./
RUN npm ci --silent

# Копируем код
COPY . .

# Сборка CRA
RUN npm run build

# Проверяем, что build создался
RUN ls -la build/

# === STAGE 2: Production ===
FROM nginx:alpine

# Копируем CRA build
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]