# UMS - User Management System

NodeJS aplikácia pre správu používateľov s gRPC komunikáciou (Server + Client architektura).

## Architektúra

- **Server** - gRPC server s business logikou (port 8081)
- **Client** - gRPC client pre komunikáciu so serverom (port 8091)
- **Database** - JSON-server mock databáza (port 3000)

## Technológie

- NodeJS + TypeScript
- NestJS
- gRPC + Protocol Buffers
- JSON-server (mock DB)
- Bcrypt (hashing hesiel)
- JWT (autentifikácia)
- Docker & docker-compose

## Spustenie

### Príprava
```bash
# 1. Skopírujte .env.example na .env
cp .env.example .env
```

### Spustenie
```bash
# Spustenie celého systému
docker-compose up -d

# Server: http://localhost:8081
# Client: http://localhost:8091
# DB: http://localhost:3000
```

### Zastavenie
```bash
docker-compose down
```

## Funkcionality

- Vytvorenie používateľa
- Získanie detailu používateľa
- Paginovaný zoznam používateľov
- Prihlásenie používateľa (JWT)


