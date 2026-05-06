import { getUsers } from '../services/user.service.js';
import { getPosts, getComments } from '../services/post.service.js';
import { buildUsersWithCounts, filterUsersWithMoreThanComments } from '../helpers/data.helper.js';
import { logger } from '../utils/logger.js';
import printJsonToFile from '../utils/printJson.js';

// Requirement 1 (filter) and 2 (reformat counts)
const [users, posts, comments] = await Promise.all([getUsers(), getPosts(), getComments()]);

const usersWithCounts = buildUsersWithCounts(users, posts, comments);
const filtered = filterUsersWithMoreThanComments(usersWithCounts, 3);

logger(filtered);
printJsonToFile(filtered, '2-01-02-filter-more-than-3-comments.json');

export default filtered;
