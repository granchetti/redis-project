// src/loadDataset.ts
import { createClient } from 'redis';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Carga variables de entorno

async function loadDataset() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = createClient({ url: redisUrl });
  client.on('error', (err) => console.error('Error en Redis:', err));
  await client.connect();

  try {
    const data = await fs.readFile(path.join(__dirname, '../data/datasetProducts.json'), 'utf8');
    const products = JSON.parse(data);
    for (const product of products) {
      const key = `product:${product.id}`;
      await client.hSet(key, product);
    }
    console.log('Dataset de productos cargado en Redis.');
  } catch (err) {
    console.error('Error leyendo el dataset:', err);
  } finally {
    await client.quit();
  }
}

loadDataset();
