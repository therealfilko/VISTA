# Backend Build Stage
FROM golang:1.23-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main cmd/api/main.go

# Backend Production Stage
FROM alpine:3.20.1 AS prod
WORKDIR /app
COPY --from=build /app/main /app/main
COPY migrations ./migrations
COPY docs ./docs
EXPOSE ${PORT}
CMD ["./main"]

# Frontend Build Stage
FROM node:22 AS frontend_builder
WORKDIR /frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/. .
RUN npm run build

# Frontend Development Stage
FROM node:22 AS frontend_dev
WORKDIR /app

# Erst package.json kopieren und installieren
COPY ./frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Source Code kopieren
COPY ./frontend/. .

# TypeScript global installieren
RUN npm install -g typescript

ENV PATH /app/node_modules/.bin:$PATH
EXPOSE 3000

# Vite mit expliziten Optionen starten
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Frontend Production Stage
FROM node:22-slim AS frontend
WORKDIR /app
RUN npm install -g serve@14.0.1
COPY --from=frontend_builder /frontend/dist /app/dist
EXPOSE 5173
CMD ["serve", "-s", "/app/dist", "-l", "5173"]
