import { getUsers } from '../services/user.service.js';
import { logger } from '../utils/logger.js';
import printJsonToFile from '../utils/printJson.js';


// Requirement 1 & 2: fetch all users
const users = await getUsers();
logger(users);
printJsonToFile(users, '1-01-02-get-users.json');

export default users;
