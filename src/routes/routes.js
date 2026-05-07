import Router from 'koa-router';
import { getBooks, getBook, save } from '../handlers/books/bookHandlers.js';
import bookInputMiddleware from '../middleware/bookInputMiddleware.js';
import { getProducts, getProduct, createProduct, updateProductById, deleteProduct } from '../handlers/products/productHandlers.js';
import { productInputMiddleware, queryProductInputMiddleware } from '../middleware/productInputMiddleware.js';
import { validateIdParam } from '../middleware/idParamMiddleware.js';
import { renderProducts } from '../handlers/pages/pageHandlers.js';


// Page routes (HTML rendering)
const pageRouter = new Router();
pageRouter.get('/products', renderProducts);

// API routes (JSON responses)
const apiRouter = new Router({
    prefix: '/api'
});

// Book routes
apiRouter.get('/books', getBooks);
apiRouter.get('/books/:id', getBook);
apiRouter.post('/books', bookInputMiddleware, save);

// Product API routes
apiRouter.get('/products', queryProductInputMiddleware, getProducts);
apiRouter.get('/product/:id', queryProductInputMiddleware, validateIdParam, getProduct);
apiRouter.post('/products', productInputMiddleware, createProduct);
apiRouter.put('/product/:id', validateIdParam, productInputMiddleware, updateProductById);
apiRouter.delete('/product/:id', validateIdParam, deleteProduct);

// Export both routers
export { pageRouter, apiRouter };