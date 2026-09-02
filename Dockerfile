# ---------- Build stage ----------
FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
    
COPY . .
RUN bun run build
    
# ---------- Runtime stage ----------
#FROM oven/bun:latest
#WORKDIR /app
    
#COPY --from=builder /app/.output ./.output
#COPY --from=builder /app/package.json ./

FROM nginx:stable-alpine
COPY --from=builder /app/school-manager /usr/share/nginx/html
COPY ./nginx-prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]