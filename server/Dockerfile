# server/Dockerfile

FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*
COPY wait-for-mysql.sh .
RUN chmod +x wait-for-mysql.sh
CMD ["sh", "./wait-for-mysql.sh"]

