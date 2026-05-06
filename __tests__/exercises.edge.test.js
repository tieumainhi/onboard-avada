import {
    mapUsersWithPostsAndComments,
    buildUsersWithCounts,
    getTopByKey,
    sortByDesc,
    buildMergedPostWithComments,
    filterUsersWithMoreThanComments,
} from '../helpers/data.helper.js';

describe('Exercises edge cases', () => {
    test('mapUsersWithPostsAndComments handles empty and wrong types', () => {
        expect(mapUsersWithPostsAndComments([], [], [])).toEqual([]);
        expect(mapUsersWithPostsAndComments(null, undefined, 'bad')).toEqual([]);
    });

    test('buildUsersWithCounts handles empty and wrong types', () => {
        expect(buildUsersWithCounts([], [], [])).toEqual([]);
        expect(buildUsersWithCounts(null, {}, 123)).toEqual([]);
    });

    test('negative ids are supported and counted correctly', () => {
        const users = [{ id: -1, name: 'Neg', username: 'neg', email: 'n@x.com' }];
        const posts = [{ id: -10, userId: -1, title: 't', body: 'b' }];
        const comments = [{ id: -100, postId: -10, name: 'c', body: 'b' }];

        const mapped = mapUsersWithPostsAndComments(users, posts, comments);
        expect(mapped).toHaveLength(1);
        expect(mapped[0].posts).toHaveLength(1);
        expect(mapped[0].comments).toHaveLength(1);

        const counts = buildUsersWithCounts(users, posts, comments);
        expect(counts[0].postsCount).toBe(1);
        expect(counts[0].commentsCount).toBe(1);
    });

    test('sortByDesc and getTopByKey behaviour with ties and negatives', () => {
        const items = [
            { id: 1, postsCount: -1 },
            { id: 2, postsCount: -5 },
            { id: 3, postsCount: -2 },
        ];
        const sorted = sortByDesc(items, 'postsCount');
        expect(sorted[0].id).toBe(1);

        const top = getTopByKey(items, 'postsCount');
        expect(top.id).toBe(1);
    });

    test('buildMergedPostWithComments handles null post and wrong comments', () => {
        expect(buildMergedPostWithComments(null, null)).toMatchObject({ comments: [] });
    });

    test('filterUsersWithMoreThanComments filters correctly', () => {
        const users = [
            { id: 1, commentsCount: 0 },
            { id: 2, commentsCount: 5 },
        ];
        expect(filterUsersWithMoreThanComments(users, 3)).toEqual([{ id: 2, commentsCount: 5 }]);
    });

    test('large dataset mapping performance (logs timing)', () => {
        const users = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `u${i}`, username: `u${i}`, email: `${i}@x` }));
        const posts = [];
        const comments = [];
        const postsPerUser = 40; // 50*40 = 2000 posts
        const commentsPerPost = 3; // ~6000 comments

        let postId = 1;
        for (const u of users) {
            for (let p = 0; p < postsPerUser; p++) {
                posts.push({ id: postId, userId: u.id, title: `t${postId}`, body: 'b' });
                for (let c = 0; c < commentsPerPost; c++) {
                    comments.push({ id: comments.length + 1, postId: postId, name: 'n', body: 'b' });
                }
                postId++;
            }
        }

        console.time('large-mapping');
        const mapped = mapUsersWithPostsAndComments(users, posts, comments);
        console.timeEnd('large-mapping');

        const counts = buildUsersWithCounts(users, posts, comments);

        expect(mapped).toHaveLength(users.length);
        expect(counts.every((c) => c.postsCount === postsPerUser)).toBeTruthy();
        expect(counts.every((c) => c.commentsCount === postsPerUser * commentsPerPost)).toBeTruthy();
    }, 20000);
});
