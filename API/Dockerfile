# Imagem base para Node.js
FROM node:14

# Diretório de trabalho para a API
WORKDIR /usr/src/app

# Copiar arquivos da API
COPY ./api/package*.json ./
RUN npm install
COPY ./api .

# Build do front-end
WORKDIR /usr/src/app/notiipt
COPY ./notiipt/package*.json ./
RUN npm install
COPY ./notiipt .
RUN npm run build

# Voltar para o diretório da API
WORKDIR /usr/src/app

# Servir o front-end e iniciar a API
CMD ["sh", "-c", "npx serve -s notiipt/build & node index.js"]

# Expor a porta da API
EXPOSE 3000
