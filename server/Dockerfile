FROM node:20.12.1

WORKDIR /app

# Instalar LibreOffice
RUN apt-get update \
  && apt-get install -y libreoffice \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependencias (node_modules)
COPY package*.json .
RUN npm install

# Copiar schema.prisma y generar cliente prisma
COPY prisma ./prisma
RUN npm run generate

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run dev"]
