# === STAGE 1: BUILD (Giai đoạn này cài cả dev dependencies để chạy 'nest build') ===
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Cài đặt TẤT CẢ các gói (bao gồm cả devDependencies)
RUN npm ci

COPY . .

# Chạy lệnh build (lúc này 'nest' đã có sẵn)
RUN npm run build

# === STAGE 2: PRODUCTION (Giai đoạn này chỉ cài production dependencies) ===
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Chỉ copy những file cần thiết cho production
COPY package*.json ./
# Chỉ cài đặt dependencies (loại trừ devDependencies)
RUN npm ci --omit=dev

# Copy thư mục build (dist) từ giai đoạn 'builder'
COPY --from=builder /usr/src/app/dist ./dist 

# Các file khác cần thiết (nếu có, ví dụ: .env, public, etc.)
# COPY --from=builder /usr/src/app/node_modules ./node_modules 
# COPY --from=builder /usr/src/app/package*.json ./

# Lệnh chạy ứng dụng
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
