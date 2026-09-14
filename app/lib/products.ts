import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/products.json');

export function getProducts() {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export function saveProduct(newProduct: any) {
  const products = getProducts();
  const productWithId = { id: Date.now().toString(), ...newProduct };
  products.push(productWithId);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  return productWithId;
}