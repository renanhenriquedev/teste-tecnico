# Customer Service (Node.js + TypeScript)

Serviço de cadastro e consulta de clientes com **Express**, **MongoDB (Mongoose)**, **Redis (cache)** e **RabbitMQ (mensageria)**.  
Inclui **Swagger/OpenAPI** em `/docs`, **paginações** em `GET /clientes`, **cache por id**, testes unitários/integrados e ambiente **Docker** completo.

## 🧰 Stack
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- Redis (cache)
- RabbitMQ (mensageria)
- Jest (testes)
- Swagger UI (documentação)
- Docker / Docker Compose

## 🗂 Estrutura (resumo)
```
src/
  app/
    index.ts         # monta app, rotas, middlewares, swagger, health
    server.ts        # sobe o servidor e inicia consumo do Rabbit
    swagger.ts       # monta /docs
    openapi.json     # especificação Swagger
    health.ts        # liveness (/health) e readiness (/ready)
  config/
    env.ts           # variáveis de ambiente com defaults
  controllers/
    ClienteController.ts
  entities/
    Cliente.ts
  infra/
    db/
      mongoose.ts
      ClientModel.ts
  middlewares/
    validate.ts
    error.ts
  repositories/
    BaseRepository.ts
    ClienteRepository.ts
  services/
    CacheService.ts
    MessageQueueService.ts
  use-cases/
    ClienteUseCases.ts
  scripts/
    seed.ts       
tests/
docker/
  docker-compose.yml
Dockerfile
```

## 🔌 Endpoints principais

- `GET /health` → liveness
- `GET /ready` → readiness
- `POST /clientes` → cria cliente
- `GET /clientes` → lista com paginação: `?page=1&limit=20&sort=asc|desc`
- `GET /clientes/:id` → busca por id (usa cache Redis)
- `PUT /clientes/:id` → atualiza
- `DELETE /clientes/:id` → remove
- `GET /docs` → Swagger UI

> Dica: exemplos de payload estão no Swagger.

## ⚙️ Variáveis de ambiente

Crie um `.env` (exemplo):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/customers
REDIS_URI=redis://localhost:6379
RABBIT_URI=amqp://localhost:5672
REDIS_TTL_SECONDS=300
```

> Em **Docker**, as URIs internas normalmente são:
> - `mongodb://mongo:27017/customers`
> - `redis://redis:6379`
> - `amqp://rabbitmq:5672`

## ▶️ Executando local (sem Docker)

1) Instale deps
```bash
npm install
```

2) Suba Mongo, Redis e RabbitMQ localmente (ou use Docker compose).

3) Build + start
```bash
npm run build
npm start
```

4) Dev (hot-reload)
```bash
npm run dev
```

Acesse:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## 🐳 Executando com Docker

Na pasta `customer-service/docker`:
```bash
docker compose up -d --build
docker compose logs -f app
```

- App: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- RabbitMQ UI: `http://localhost:15672` (user: guest / pass: guest)

## 🧪 Testes

```bash
npm test
```

## 🌱 Seed (dados de exemplo)

Cria alguns clientes no Mongo:
```bash
# dev (ts-node)
npm run seed:dev

# production build
npm run build
npm run seed
```

> Scripts previstos no package.json:
> ```json
> {
>   "scripts": {
>     "seed:dev": "ts-node src/scripts/seed.ts",
>     "seed": "node dist/scripts/seed.js"
>   }
> }
> ```
> Se necessário, instale: `npm i -D ts-node`

## 🧵 Mensageria (RabbitMQ)

- `POST /clientes` publica uma mensagem na fila **clientes**.
- O consumidor inicia em `server.ts` e loga `"[MQ] Novo cliente recebido: ..."`.
- Se RabbitMQ não estiver pronto, há **retry com backoff** automático.

## 🧩 Arquitetura (resumo)

- **Controllers** → recebem req/res
- **UseCases** → orquestram regras de negócio (Repository + Cache + MQ)
- **Repositories** → persistência (Mongoose)
- **Services** → integrações externas (Redis/Rabbit)
- **Middlewares** → validação (Zod), tratamento de erros, etc.

## 🧭 Documentação (Swagger)

- Arquivo: `src/app/openapi.json`
- Montagem: `src/app/swagger.ts`
- UI: `GET /docs`

## ✅ Healthchecks

- `GET /health`: liveness
- `GET /ready`: readiness

## 📦 CI (GitHub Actions)

Workflow básico em `.github/workflows/ci.yml` executa:
- `npm ci`
- `npm test`
- `npm run build`

---

### ☕ Contato
Qualquer dúvida, abra uma issue ou fale comigo. Bom código! 🚀
