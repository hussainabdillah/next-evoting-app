# Gunakan versi LTS yang stabil
FROM node:20

# Buat direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file
COPY . .

# Build-time public env args
ARG NEXT_PUBLIC_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_CHAIN_ID

# Inject ke env saat build
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=$NEXT_PUBLIC_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_CHAIN_ID=$NEXT_PUBLIC_CHAIN_ID

# Generate prisma client
RUN npx prisma generate

# Build aplikasi
RUN npm run build

# Add this if using SQLite locally
# COPY prisma/dev.db ./prisma/dev.db

# Expose port 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
