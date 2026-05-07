import { log } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, 'products.json');

function readProducts() {
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
}

function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
}


function getAll(query = {}) {
    const { limit, sort } = query;
    let products = readProducts()
    // Sort by createdAt
    if (sort === 'desc') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'asc') {
        products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Apply limit
    if (limit) {
        return products.slice(0, parseInt(limit));
    }

    return products;
}


function getOne(id) {
    const products = readProducts();
    return products.find(product => product.id === parseInt(id));
}

/**
 * Create a new product
 * @param {object} data - Product data
 * @returns {object} Created product
 */
function add(data) {
    const products = readProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
        id: newId,
        ...data,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    writeProducts(products);
    return newProduct;
}

/**
 * Update a product by ID
 * @param {number} id - Product ID
 * @param {data} data - Updated data
 * @returns {object} Updated product or null
 */
function update(id, data) {
    const products = readProducts();
    const index = products.findIndex(product => product.id === parseInt(id));

    if (index === -1) {
        return null;
    }

    const updatedProduct = {
        ...products[index],
        ...data,
        id: products[index].id,
        createdAt: products[index].createdAt
    };

    products[index] = updatedProduct;
    writeProducts(products);
    return updatedProduct;
}


function remove(id) {
    const products = readProducts();
    const initialLength = products.length;

    const filtered = products.filter(product => product.id !== parseInt(id));

    // If no product was removed, return false
    if (filtered.length === initialLength) {
        return false;
    }

    writeProducts(filtered);
    return true;
}

export {
    getAll,
    getOne,
    add,
    update,
    remove
};