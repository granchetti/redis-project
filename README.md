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

- API: `http://localhost:5000/api/products`
- Swagger: `http://localhost:5000/api-docs`





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


## ✍️ Author

**Giulia Ranchetti** – April 2025  
Master in Software Development and Architecture
