import { getUsers } from '../services/user.service.js';
import { getPosts, getComments } from '../services/post.service.js';
import { buildUsersWithCounts, getTopByKey, sortByDesc } from '../helpers/data.helper.js';
import { logger } from '../utils/logger.js';
import printJsonToFile from '../utils/printJson.js';

// Requirement: who has most comments/posts and sort by postsCount desc
const [users, posts, comments] = await Promise.all([getUsers(), getPosts(), getComments()]);

const usersWithCounts = buildUsersWithCounts(users, posts, comments);
// ex: [{ id: 1, name: 'Leanne Graham', postsCount: 10, commentsCount: 50 }, ...]

const topByComments = getTopByKey(usersWithCounts, 'commentsCount');
const topByPosts = getTopByKey(usersWithCounts, 'postsCount');
const sortedByPosts = sortByDesc(usersWithCounts, 'postsCount');

logger({ topByComments, topByPosts, sortedByPosts });
printJsonToFile({ topByComments, topByPosts, sortedByPosts }, '3-01-02-top-and-sort.json');

export { topByComments, topByPosts, sortedByPosts };
