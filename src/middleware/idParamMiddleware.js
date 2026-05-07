import yup from 'yup';

const idSchema = yup.number().typeError('id must be a number').positive('id must be positive').integer('id must be an integer').required();

export async function validateIdParam(ctx, next) {
    try {
        const raw = ctx.params.id;
        const val = Array.isArray(raw) ? raw[0] : raw;
        const idNum = Number(val);
        const validated = await idSchema.validate(idNum);
        ctx.state.id = Number(validated);
        await next();
    } catch (e) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            errors: e.errors || [e.message],
            errorName: e.name || 'ValidationError'
        };
    }
}
