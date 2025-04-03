import request from 'supertest';
import app from '../src/index';

describe('API CRUD de productos', () => {
  it('Debe crear un producto', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ id: 'p51', name: 'Producto Test', price: 99, category: 'Test' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Producto creado');
  });

  it('Debe obtener un producto existente', async () => {
    // Primero, crea el producto
    await request(app)
      .post('/api/products')
      .send({ id: 'p52', name: 'Producto Test 2', price: 150, category: 'Test' });
    const res = await request(app).get('/api/products/p52');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Producto Test 2');
  });

  // Agrega pruebas para actualizar y eliminar producto
});
