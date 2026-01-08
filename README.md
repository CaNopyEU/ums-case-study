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

## Development

Pre local development bez Dockeru potrebujete:
1. Spustiť JSON-server databázu
2. Nastaviť localhost URLs v .env.local
3. Spustiť server a client

```bash
# 1. Vytvoriť .env.local pre local development
cp .env .env.local

# 2. Upraviť .env.local - zmeniť:
#    GRPC_SERVER_URL=localhost:8081
#    DB_URL=http://localhost:3000

# 3. Spustiť JSON-server (v jednom termináli)
npx json-server --watch db/db.json --port 3000

# 4. Spustiť server (v druhom termináli)
./start-dev.sh server
# alebo
cd server && npm install && npm run start:dev

# 5. Spustiť client (v treťom termináli)
./start-dev.sh client
# alebo
cd client && npm install && npm run start:dev
```

Alternatívne použite helper script ktorý automaticky načíta .env.local:
```bash
# Server
./start-dev.sh server

# Client
./start-dev.sh client
```
