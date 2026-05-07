import yup from 'yup';

const productSchema = yup.object().shape({
    name: yup.string().required('Product name is required'),
    price: yup.number().positive('Price must be positive').required('Price is required'),
    description: yup.string().required('Description is required'),
    product: yup.string().required('Product type is required'),
    color: yup.string().required('Color is required'),
    image: yup.string().url('Image must be a valid URL').required('Image URL is required')
}).strict(true).noUnknown('Unknown fields are not allowed');


const queryProductSchema = yup.object().shape({
    limit: yup.number().positive('Limit must be a positive number').integer('Limit must be an integer'),
    sort: yup.string().oneOf(['asc', 'desc'], 'Sort must be either "asc" or "desc"'),
    fields: yup.string()
}).strict(true).noUnknown('Unknown query parameters are not allowed');

export async function productInputMiddleware(ctx, next) {
    try {
        const postData = ctx.request.body;
        console.log('Validating product POST data:', postData);
        await productSchema.validate(postData, { abortEarly: false });
        await next();
    } catch (e) {
        console.log('Product validation error:', e.errors);
        ctx.status = 400;
        ctx.body = {
            success: false,
            errors: e.errors,
            errorName: e.name
        }
    }
}

export async function queryProductInputMiddleware(ctx, next) {
    try {
        const queryData = ctx.query;
        await queryProductSchema.validate({
            ...queryData,
            limit: queryData.limit ? parseInt(queryData.limit) : undefined
        }, { abortEarly: false });

        await next();
    } catch (e) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            errors: e.errors,
            errorName: e.name
        }
    }
}
