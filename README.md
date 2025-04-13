# Redis CRUD API – Summary

This project is a Redis-based CRUD API built with **Node.js**, **TypeScript**, and **Docker**, including **Swagger documentation** and **automated testing**.


## 🔧 Tech Stack

- Redis (key-value database)
- Node.js + Express + TypeScript
- Docker & Docker Compose
- Swagger (OpenAPI docs)
- Jest + Supertest (testing)


## 🚀 How to Run

```bash
# Clone the repo
git clone https://github.com/your-username/redis-project.git
cd redis-project
npm install

# Start everything with Docker
npm run build
```

🔗 API base: [`http://localhost:5000/api/products`](http://localhost:5000/api/products)  
📘 Swagger UI: [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs)


## 📦 API Endpoints

| Method | Path                             | Description               |
|--------|----------------------------------|---------------------------|
| GET    | `/api/products`                 | List all products         |
| GET    | `/api/products/:id`             | Get product by ID         |
| POST   | `/api/products`                 | Create a new product      |
| PUT    | `/api/products/:id`             | Update a product          |
| DELETE | `/api/products/:id`             | Delete product by ID      |
| DELETE | `/api/products/name/:name`      | Delete by product name    |

> ✅ IDs are auto-generated if omitted in POST requests.


## 🧪 Run Unit Tests

```bash
npm run test
```


## 📂 Project Structure

- `src/` – API code and dataset loader
- `data/` – JSON dataset (20 products)
- `tests/` – Jest tests
- `Dockerfile` & `docker-compose.yml`


## 📚 References

- Redis – https://redis.io/
- Docker Documentation – https://docs.docker.com/
- Swagger/OpenAPI – https://swagger.io/specification/
- Jest Testing Framework – https://jestjs.io/
- Supertest – https://github.com/visionmedia/supertest
- TypeScript – https://www.typescriptlang.org/
- Express – https://expressjs.com/
- Node.js – https://nodejs.org/