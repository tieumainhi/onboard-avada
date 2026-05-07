import Koa from 'koa';
import koaBody from 'koa-body';
import render from 'koa-ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pageRouter, apiRouter } from './routes/routes.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';

// Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = new Koa();

// Configure EJS
render(app, {
    root: path.join(__dirname, 'views'), // Views directory
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

// Top-level error handler (must be first)
app.use(errorHandlerMiddleware);

// Logger middleware
app.use(loggerMiddleware);

// Body parser
app.use(koaBody());


// Routes
app.use(pageRouter.routes());
app.use(pageRouter.allowedMethods());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());


app.use(async (ctx) => {
    ctx.body = {
        message: 'Hello World!',
    };
});
app.listen(5000);
console.log('Server running on port 3000');