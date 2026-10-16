#Stage 1: build (cần TypeScript để biên dịch)
FROM node:24-slim AS build
WORKDIR /app

# Copy file khai báo thư viện TRƯỚC để tận dụng cache
COPY package.json package-lock.json ./
RUN npm ci

# Rồi mới copy code và biên dịch ra thư mục dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

#Stage 2: chạy thật (chỉ giữ thứ cần thiết)
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

# Chỉ cài thư viện chạy thật, bỏ TypeScript và công cụ dev
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Lấy kết quả build từ stage 1, bỏ lại mọi thứ còn lại
COPY --from=build /app/dist ./dist

# Không chạy bằng root (image Node có sẵn user "node")
USER node

EXPOSE 3002
CMD ["node", "dist/index.js"]