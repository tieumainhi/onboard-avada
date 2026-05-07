import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'products.json');

const products = [];

for (let i = 1; i <= 1000; i++) {
    products.push({
        id: i,
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        description: faker.commerce.productDescription(),
        product: faker.commerce.department(),
        color: faker.color.human(),
        createdAt: faker.date.past().toISOString(),
        image: faker.image.url()
    });
}

const data = JSON.stringify(products, null, 2);
fs.writeFileSync(outputPath, data, 'utf-8');

console.log(`✅ Generated ${products.length} products and saved to products.json`);
