import { getPostById, getCommentsByPostId } from '../services/post.service.js';
import { buildMergedPostWithComments } from '../helpers/data.helper.js';
import { logger } from '../utils/logger.js';
import printJsonToFile from '../utils/printJson.js';


// Requirement: fetch post id=1 and its comments concurrently, then merge
const [post, comments] = await Promise.all([getPostById(1), getCommentsByPostId(1)]);

const merged = buildMergedPostWithComments(post, comments);
logger(merged);
printJsonToFile(merged, '3-03-get-post-1-merge-comments.json');

export default merged;
