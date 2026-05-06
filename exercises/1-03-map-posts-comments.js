import { getUsers } from '../services/user.service.js';
import { getPosts, getComments } from '../services/post.service.js';
import { mapUsersWithPostsAndComments } from '../helpers/data.helper.js';
import { logger } from '../utils/logger.js';
import printJsonToFile from '../utils/printJson.js';


// Requirement 3: get posts & comments and map them to users
const [users, posts, comments] = await Promise.all([getUsers(), getPosts(), getComments()]);
logger(users.length, posts.length, comments.length);


const mapped = mapUsersWithPostsAndComments(users, posts, comments);
printJsonToFile(mapped, '1-03-map-posts-comments.json');


export default mapped;
