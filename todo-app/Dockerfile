# Backend Build Stage
FROM golang:1.23-alpine AS build

WORKDIR /app

# Go-Abhängigkeiten installieren
COPY todo-app/go.mod todo-app/go.sum ./
RUN go mod download

# Restlichen Backend-Code kopieren
COPY todo-app/ .

# Backend-Binary erstellen
RUN go build -o main cmd/api/main.go

# Backend Production Stage
FROM alpine:3.20.1 AS prod
WORKDIR /app

# Binary und notwendige Dateien kopieren
COPY --from=build /app/main /app/main
COPY todo-app/migrations ./migrations
COPY todo-app/docs ./docs

# Port definieren
EXPOSE ${PORT}
CMD ["./main"]

# Frontend Build Stage
FROM node:22 AS frontend_builder
WORKDIR /frontend

# package.json und Abhängigkeiten installieren
COPY todo-app/frontend/package*.json ./
RUN npm install

# Frontend-Code kopieren und bauen
COPY todo-app/frontend/. ./
RUN npm run build

# Frontend Development Stage
FROM node:22 AS frontend_dev
WORKDIR /app

# package.json kopieren und Abhängigkeiten installieren
COPY todo-app/frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Source Code kopieren
COPY todo-app/frontend/. ./

# PATH für lokale Binärdateien setzen
ENV PATH /app/node_modules/.bin:$PATH

# Port und Startbefehl für die Entwicklungsumgebung
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend Production Stage
FROM node:22-slim AS frontend
WORKDIR /app

# Globales "serve" installieren
RUN npm install -g serve@14.0.1

# Gebauten Code vom Builder kopieren
COPY --from=frontend_builder /frontend/dist /app/dist

# Port definieren und Startbefehl
EXPOSE 5173
CMD ["serve", "-s", "/app/dist", "-l", "5173"]
