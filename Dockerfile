FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código
COPY . .

# Construir NestJS
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
