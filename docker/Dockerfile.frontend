# WORK21 Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json и lock файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Порт
EXPOSE 3000

# Запуск в dev режиме
CMD ["npm", "run", "dev"]

