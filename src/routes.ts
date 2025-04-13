import { Router, Request, Response } from "express";

const router = Router();

async function generateNewProductId(client: any): Promise<string> {
  const keys = await client.keys("product:p*");
  const numbers = keys.map((key: string) => {
    const id = key.split(":")[1];
    return parseInt(id.substring(1));
  });
  const max = numbers.length ? Math.max(...numbers) : 0;
  return `p${max + 1}`;
}

router.post("/products", async (req: Request, res: Response): Promise<void> => {
  let product = req.body;
  const client = req.app.locals.redisClient;

  if (!product.id) {
    product.id = await generateNewProductId(client);
  }

  const key = `product:${product.id}`;
  await client.hSet(key, product);
  res.status(201).json({ message: "Producto creado", product });
});

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  const client = req.app.locals.redisClient;
  const keys = await client.keys("product:*");

  const products = [];
  for (const key of keys) {
    const product = await client.hGetAll(key);
    products.push(product);
  }

  res.json(products);
});


router.get(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const key = `product:${req.params.id}`;
    const client = req.app.locals.redisClient;
    const product = await client.hGetAll(key);
    if (Object.keys(product).length === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(product);
  }
);

router.put(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const key = `product:${req.params.id}`;
    const client = req.app.locals.redisClient;
    const exists = await client.exists(key);
    if (!exists) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    await client.hSet(key, req.body);
    res.json({ message: "Producto actualizado" });
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    const key = `product:${req.params.id}`;
    const client = req.app.locals.redisClient;
    const result = await client.del(key);
    if (result === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json({ message: "Producto eliminado" });
  }
);

router.delete(
  "/products/name/:name",
  async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const client = req.app.locals.redisClient;

    const keys = await client.keys("product:*");
    let deletedCount = 0;

    for (const key of keys) {
      const product = await client.hGetAll(key);
      if (product.name === name) {
        await client.del(key);
        deletedCount++;
      }
    }

    if (deletedCount === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json({ message: `${deletedCount} producto(s) eliminado(s)` });
    }
  }
);

export default router;
