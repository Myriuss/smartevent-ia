# syntax=docker/dockerfile:1
FROM node:20-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build || (echo "=== Angular error log ===" && ls -1 /tmp | grep ng- || true && find /tmp -maxdepth 2 -name "angular-errors.log" -print -exec cat {} \; || true && exit 1)
FROM nginx:1.27-alpine
# Angular "application" builder outputs under dist/<name>/browser
COPY --from=build /app/dist/front/browser /usr/share/nginx/html
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
