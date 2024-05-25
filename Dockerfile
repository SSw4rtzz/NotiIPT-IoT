# Imagem base para Node.js
FROM node:22

# Diretório de trabalho para a aplicação
WORKDIR /usr/src/app

# Copiar arquivos da API
COPY ./api/package*.json ./
RUN npm install
COPY ./api .

# Copiar arquivos do front-end React
COPY ./notiipt ./notiipt

# Instalar dependências e construir o front-end React
WORKDIR /usr/src/app/notiipt
RUN npm install
RUN npm run build

# Voltar para o diretório raiz
WORKDIR /usr/src/app

# Expor a porta da aplicação
EXPOSE 3000

# Iniciar o servidor Express para servir o front-end e a API
CMD ["node", "index.js"]
