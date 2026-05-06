import {
    mapUsersWithPostsAndComments,
    buildUsersWithCounts,
    getTopByKey,
    sortByDesc,
    buildMergedPostWithComments,
    filterUsersWithMoreThanComments,
} from '../helpers/data.helper.js';

describe('data.helper', () => {
    const users = [
        { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'a@b.com' },
        { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'c@d.com' },
    ];

    const posts = [
        { id: 1, userId: 1, title: 'p1', body: 'b1' },
        { id: 2, userId: 1, title: 'p2', body: 'b2' },
        { id: 3, userId: 2, title: 'p3', body: 'b3' },
    ];

    const comments = [
        { id: 1, postId: 1, name: 'c1', email: 'x@y.com', body: 'cb1' },
        { id: 2, postId: 1, name: 'c2', email: 'x@y.com', body: 'cb2' },
        { id: 3, postId: 2, name: 'c3', email: 'x@y.com', body: 'cb3' },
        { id: 4, postId: 3, name: 'c4', email: 'x@y.com', body: 'cb4' },
        { id: 5, postId: 3, name: 'c5', email: 'x@y.com', body: 'cb5' },
    ];

    it('maps users with their posts and comments', () => {
        const result = mapUsersWithPostsAndComments(users, posts, comments);

        expect(result).toHaveLength(2);
        expect(result[0].posts).toHaveLength(2);
        expect(result[0].comments).toHaveLength(3);
        expect(result[1].posts).toHaveLength(1);
        expect(result[1].comments).toHaveLength(2);
    });

    it('builds counts per user', () => {
        expect(buildUsersWithCounts(users, posts, comments)).toEqual([
            {
                id: 1,
                name: 'Leanne Graham',
                username: 'Bret',
                email: 'a@b.com',
                commentsCount: 3,
                postsCount: 2,
            },
            {
                id: 2,
                name: 'Ervin Howell',
                username: 'Antonette',
                email: 'c@d.com',
                commentsCount: 2,
                postsCount: 1,
            },
        ]);
    });

    it('filters users with more than N comments', () => {
        const counts = buildUsersWithCounts(users, posts, comments);

        expect(filterUsersWithMoreThanComments(counts, 2)).toHaveLength(1);
        expect(filterUsersWithMoreThanComments(counts, 3)).toHaveLength(0);
    });

    it('finds all top items by key when tied', () => {
        const counts = buildUsersWithCounts(users, posts, comments);

        expect(getTopByKey(counts, 'postsCount')).toMatchObject([{ id: 1, postsCount: 2 }]);
        expect(getTopByKey([], 'postsCount')).toEqual([]);

        const tied = getTopByKey([
            { id: 1, postsCount: 10 },
            { id: 2, postsCount: 10 },
            { id: 3, postsCount: 8 },
        ], 'postsCount');

        expect(tied).toHaveLength(2);
        expect(tied.map((item) => item.id)).toEqual([1, 2]);
    });

    it('sorts by count descending', () => {
        const counts = buildUsersWithCounts(users, posts, comments);
        const sorted = sortByDesc(counts, 'postsCount');

        expect(sorted[0].postsCount).toBeGreaterThanOrEqual(sorted[1].postsCount);
    });

    it('merges post with comments', () => {
        expect(buildMergedPostWithComments(posts[0], comments.slice(0, 2))).toEqual({
            id: 1,
            userId: 1,
            title: 'p1',
            body: 'b1',
            comments: comments.slice(0, 2),
        });
    });

    it('handles invalid or empty input safely', () => {
        expect(mapUsersWithPostsAndComments(null, undefined, 'bad')).toEqual([]);
        expect(buildUsersWithCounts(null, undefined, 'bad')).toEqual([]);
        expect(filterUsersWithMoreThanComments(null, 3)).toEqual([]);
        expect(sortByDesc(null, 'postsCount')).toEqual([]);
        expect(buildMergedPostWithComments(null, null)).toEqual({ comments: [] });
    });
});