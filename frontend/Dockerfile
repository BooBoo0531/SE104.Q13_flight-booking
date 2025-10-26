# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm i; fi
COPY . .
# Nếu bạn dùng biến ở build-time, đặt ở đây (phải bắt đầu bằng VITE_)
# ENV VITE_API_BASE=http://backend:3000
RUN npm run build

# 2) Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
