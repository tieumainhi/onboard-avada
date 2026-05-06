import { getUser } from './services/user.service.js';
import { logger } from './utils/logger.js';

async function main() {
    logger('Hello world!');
    const user = await getUser();
    logger(user);
}

main();