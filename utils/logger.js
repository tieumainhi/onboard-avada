export const logger = (message) => {
    const output = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    console.log(`[${new Date().toISOString()}] ${output}`);
};
