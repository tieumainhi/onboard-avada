import { log } from 'console';
import { getAll as getAllProducts, getOne as getOneProduct, add as addProduct, update as updateProduct, remove as removeProduct } from '../../database/productRepository.js';

/**
 * Get all products with limit and sort options
 * @param ctx
 */
async function getProducts(ctx) {
    try {
        const sourceQuery = ctx.state.productQuery ?? ctx.query;
        const limit = sourceQuery.limit !== undefined ? Number(sourceQuery.limit) : undefined;
        const sort = sourceQuery.sort;

        const products = getAllProducts({ limit, sort });

        ctx.body = {
            success: true,
            data: products,
            count: products.length
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            data: [],
            error: e.message
        };
    }
}

/**
 * Get one product by ID with optional fields selection
 * @param ctx
 */
async function getProduct(ctx) {
    try {
        const id = ctx.state.id ?? Number(ctx.params.id);
        const fields = ctx.state.productQuery?.fields ?? ctx.query.fields;
        const product = getOneProduct(id);

        if (!product) {
            ctx.status = 404;
            return ctx.body = {
                success: false,
                error: 'Product not found'
            };
        }

        let result = product;

        // Filter fields if specified
        if (fields) {
            const fieldList = fields.split(',').map(f => f.trim());
            result = {};
            fieldList.forEach(field => {
                if (field in product) {
                    result[field] = product[field];
                }
            });
        }

        ctx.body = {
            success: true,
            data: result
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Create a new product
 * @param ctx
 */
async function createProduct(ctx) {
    try {
        const data = ctx.request.body;
        const newProduct = addProduct(data);

        ctx.status = 201;
        ctx.body = {
            success: true,
            data: newProduct
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Update a product by ID
 * @param ctx
 */
async function updateProductById(ctx) {
    try {
        const id = ctx.state.id ?? Number(ctx.params.id);
        const data = ctx.request.body;

        const updated = updateProduct(id, data);

        if (!updated) {
            ctx.status = 404;
            return ctx.body = {
                success: false,
                error: 'Product not found'
            };
        }

        ctx.body = {
            success: true,
            data: updated
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Delete a product by ID
 * @param ctx
 */
async function deleteProduct(ctx) {
    try {
        const id = ctx.state.id ?? Number(ctx.params.id);
        const deleted = removeProduct(id);

        if (!deleted) {
            ctx.status = 404;
            return ctx.body = {
                success: false,
                error: 'Product not found'
            };
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Product deleted successfully'
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

export {
    getProducts,
    getProduct,
    createProduct,
    updateProductById,
    deleteProduct
};