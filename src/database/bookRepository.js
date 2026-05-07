import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import booksJson from './books.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksPath = path.join(__dirname, 'books.json');
const books = booksJson.data;

function writeBooks(books) {
    fs.writeFileSync('./src/database/books.json', JSON.stringify({
        data: books
    }));
}


/**
 *
 * @returns {[{author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}]}
 */
function getAll() {
    return books
}

/**
 *
 * @param id
 * @returns {{author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number}}
 */
function getOne(id) {
    return books.find(book => book.id === parseInt(id));
}

/**
 *
 * @param data
 */
function add(data) {
    const updatedBooks = [data, ...books];
    writeBooks(updatedBooks);
}

export {
    getOne,
    getAll,
    add
};