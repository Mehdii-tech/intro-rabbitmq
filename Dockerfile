# Utiliser l'image de base Node.js
FROM node:16-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Compiler le projet TypeScript
RUN npm run build

# Exposer le port sur lequel l'application tourne
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main"]
