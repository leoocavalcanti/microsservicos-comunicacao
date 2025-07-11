FROM node:18-slim

WORKDIR /app

# Instalando dependências necessárias para o Prisma
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Criar diretório de logs
RUN mkdir -p logs && chmod 777 logs

COPY package*.json ./

RUN npm install

COPY . .

# Criar script de inicialização
COPY <<EOF /app/start.sh
#!/bin/sh
echo "Recriando banco de dados..."
npx prisma db push --accept-data-loss
echo "Gerando cliente Prisma..."
npx prisma generate
echo "Iniciando aplicação..."
npm start
EOF

RUN chmod +x /app/start.sh

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["/app/start.sh"] 