# Step 1: Build the application
FROM node:21.7.3 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm clean-install

COPY . .
RUN npm install
RUN npm run build

# Step 2: Set up the production environment
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html