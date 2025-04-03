import request from 'supertest';
import app from '../src/index';
import { createClient } from 'redis';

describe('Pruebas CRUD de productos', () => {
  let redisClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    redisClient = createClient({ url: 'redis://localhost:6379' });
    await redisClient.connect();
  });

  afterAll(async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  beforeEach(async () => {
    const keys = await redisClient.keys('product:*');
    for (const key of keys) {
      await redisClient.del(key);
    }
  });

  test('POST /products - Crear un producto sin ID (debe autogenerar)', async () => {
    const productData = { name: 'Test Product', price: 100, category: 'Test' };
    const res = await request(app).post('/api/products').send(productData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Producto creado');
    expect(res.body).toHaveProperty('product');
    expect(res.body.product).toHaveProperty('id');
    const createdId = res.body.product.id;
    const productInRedis = await redisClient.hGetAll(`product:${createdId}`);
    expect(productInRedis.name).toBe('Test Product');
  });

  test('POST /products - Crear un producto con ID propio', async () => {
    const productData = { id: 'p99', name: 'Manual ID Product', price: 200, category: 'Manual' };
    const res = await request(app).post('/api/products').send(productData);
    expect(res.status).toBe(201);
    expect(res.body.product.id).toBe('p99');
    const productInRedis = await redisClient.hGetAll('product:p99');
    expect(productInRedis.price).toBe('200');
  });

  test('GET /products - Lista de productos vacía al inicio', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('GET /products - Debe retornar la lista con un producto creado', async () => {
    await redisClient.hSet('product:p1', { id: 'p1', name: 'Prod1', price: 50, category: 'Test' });
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Prod1');
  });

  test('GET /products/:id - Retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/products/p999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Producto no encontrado');
  });

  test('GET /products/:id - Retorna producto si existe', async () => {
    await redisClient.hSet('product:p1', { id: 'p1', name: 'Test1', price: 10, category: 'Cat1' });
    const res = await request(app).get('/api/products/p1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test1');
  });

  test('PUT /products/:id - Retorna 404 si producto no existe', async () => {
    const res = await request(app).put('/api/products/p999').send({ name: 'No existe' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Producto no encontrado');
  });

  test('PUT /products/:id - Actualiza producto existente', async () => {
    await redisClient.hSet('product:p1', { id: 'p1', name: 'Antiguo', price: 10 });
    const res = await request(app).put('/api/products/p1').send({ name: 'Nuevo', price: 20 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Producto actualizado');

    const productInRedis = await redisClient.hGetAll('product:p1');
    expect(productInRedis.name).toBe('Nuevo');
    expect(productInRedis.price).toBe('20');
  });

  test('DELETE /products/:id - 404 si no existe', async () => {
    const res = await request(app).delete('/api/products/p999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Producto no encontrado');
  });

  test('DELETE /products/:id - Elimina producto existente', async () => {
    await redisClient.hSet('product:p5', { id: 'p5', name: 'Prod5', price: 500 });
    const res = await request(app).delete('/api/products/p5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Producto eliminado');

    const productInRedis = await redisClient.hGetAll('product:p5');
    expect(Object.keys(productInRedis).length).toBe(0);
  });

  test('DELETE /products/name/:name - 404 si no hay productos con ese nombre', async () => {
    const res = await request(app).delete('/api/products/name/INEXISTENTE');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Producto no encontrado');
  });

  test('DELETE /products/name/:name - Elimina todos los productos con un nombre dado', async () => {
    await redisClient.hSet('product:p1', { id: 'p1', name: 'MismoNombre', price: 100 });
    await redisClient.hSet('product:p2', { id: 'p2', name: 'MismoNombre', price: 200 });
    await redisClient.hSet('product:p3', { id: 'p3', name: 'OtroNombre', price: 300 });

    const res = await request(app).delete('/api/products/name/MismoNombre');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('producto(s) eliminado(s)');

    const product1 = await redisClient.hGetAll('product:p1');
    const product2 = await redisClient.hGetAll('product:p2');
    expect(Object.keys(product1).length).toBe(0);
    expect(Object.keys(product2).length).toBe(0);

    const product3 = await redisClient.hGetAll('product:p3');
    expect(product3.name).toBe('OtroNombre');
  });
});
