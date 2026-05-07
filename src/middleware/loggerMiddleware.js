/**
 * Logger middleware that prints method url status duration for every request
 */
export async function loggerMiddleware(ctx, next) {
    const startTime = Date.now();

    try {
        await next();
    } finally {
        const duration = Date.now() - startTime;
        const { method, url, status } = ctx;
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${status} ${duration}ms`);
    }
}
