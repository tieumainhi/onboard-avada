/**
 * Top-level error handler middleware that catches exceptions
 * and returns JSON {success: false, error} with appropriate status code
 */
export async function errorHandlerMiddleware(ctx, next) {
    try {
        await next();

        // Handle 404 Not Found
        if (ctx.status === 404) {
            ctx.body = {
                success: false,
                error: 'Not Found'
            };
        }
    } catch (e) {
        console.error('Error caught by error handler:', e.message);

        // Determine status code based on error
        let status = 500;
        let errorMessage = e.message || 'Internal Server Error';

        // Check if it's a validation error
        if (e.name === 'ValidationError') {
            status = 400;
            errorMessage = e.errors?.[0] || 'Validation failed';
        }
        // Check if error message contains common HTTP status indicators
        else if (e.message.includes('Not Found') || e.message.includes('not found')) {
            status = 404;
        } else if (e.message.includes('Unauthorized') || e.message.includes('unauthorized')) {
            status = 401;
        } else if (e.message.includes('Forbidden') || e.message.includes('forbidden')) {
            status = 403;
        }

        ctx.status = status;
        ctx.body = {
            success: false,
            error: errorMessage
        };
    }
}
