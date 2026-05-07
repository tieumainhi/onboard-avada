import { getAll as getAllProducts } from '../../database/productRepository.js';

/**
 * Render products HTML page
 * @param ctx
 */
async function renderProducts(ctx) {
    try {
        const products = getAllProducts({});
        await ctx.render('products', { products });
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Failed to render products page: ' + e.message
        };
    }
}

export { renderProducts };
