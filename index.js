import { getUsers } from './services/user.service.js';
import {
    getPosts,
    getComments,
    getPostById,
    getCommentsByPostId,
} from './services/post.service.js';
import {
    mapUsersWithPostsAndComments,
    buildUsersWithCounts,
    getTopByKey,
    sortByDesc,
    buildMergedPostWithComments,
    filterUsersWithMoreThanComments,
} from './helpers/data.helper.js';
import { logger } from './utils/logger.js';

async function main() {
    const [users, posts, comments, post, postComments] = await Promise.all([
        getUsers(),
        getPosts(),
        getComments(),
        getPostById(1),
        getCommentsByPostId(1),
    ]);

    console.time('build-mapped-data');

    const mappedUsers = mapUsersWithPostsAndComments(users, posts, comments);
    const usersWithCounts = buildUsersWithCounts(users, posts, comments);
    const usersWithMoreThan3Comments = filterUsersWithMoreThanComments(usersWithCounts, 3);
    const sortedUsersByPostsCountDesc = sortByDesc(usersWithCounts, 'postsCount');
    const topUserByComments = getTopByKey(usersWithCounts, 'commentsCount');
    const topUserByPosts = getTopByKey(usersWithCounts, 'postsCount');
    const mergedPost = buildMergedPostWithComments(post, postComments);

    console.timeEnd('build-mapped-data');

    // logger({
    //     mappedUsers,
    //     usersWithMoreThan3Comments,
    //     usersWithCounts,
    //     topUserByComments,
    //     topUserByPosts,
    //     sortedUsersByPostsCountDesc,
    //     mergedPost,
    // });
}

main();